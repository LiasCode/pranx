import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import kleur from "kleur";
import * as fs from "node:fs/promises";
import { build, type PranxBuildMode } from "./build/build.js";
import { CLIENT_OUTPUT_DIR, FLAGS } from "./build/constants.js";
import { process_pages } from "./build/process_pages.js";
import { load_user_config } from "./config/config.js";
import { attach_api_handler } from "./hono/attach-api-handler.js";
import { attach_page_handler } from "./hono/attach-page-handler.js";
import { Logger } from "./logger/index.js";
import { printPagesMapsAsAsciTree } from "./utils/printPagesMapsAsAsciTree.js";
import { group_api_handlers } from "./utils/resolve.js";
import { measureTime } from "./utils/time-perf.js";

type PranxMode = PranxBuildMode;

type InitOptions = {
  /**
   * for use your own hono instance
   * */
  server?: Hono;

  /**
   * optimize bundle
   * @default "dev"
   * */
  mode?: PranxMode;

  /**
   * work in progress
   * reload when detect changes
   * @default true
   * */
  watch?: boolean;
};

const PRANX_RUNNING_TAG_TIME = "PRANX_RUNNING_TAG_TIME" as const;

export async function init(options?: InitOptions): Promise<Hono> {
  measureTime(PRANX_RUNNING_TAG_TIME);

  console.log(kleur.bold().magenta("Pranx Start\n"));

  measureTime("load-user-config");
  const options_parsed: InitOptions = {
    mode: "dev",
    watch: true,
    ...options,
  };

  const config = await load_user_config();

  if (config === null) {
    Logger.error("Config can't be parsed");
    process.exit(1);
  }

  if (FLAGS.SHOW_TIMES) {
    console.log(
      kleur.bold().blue("* User config loaded in"),
      measureTime("load-user-config"),
      "ms"
    );
  }

  // Build and bundle
  const build_result = await build(config, options_parsed.mode);

  // Process and generate public files
  measureTime("process-pages");
  const { page_map_internal, hydrationData } = await process_pages({
    mode: options_parsed.mode || "dev",
    pages_bundle_result: build_result.pages,
    user_config: config,
    server_bundle_result: build_result.server,
  });
  if (FLAGS.SHOW_TIMES) {
    console.log(kleur.bold().blue("* Pages processed in"), measureTime("process-pages"), "ms");
  }

  // Attach endpoints to hono server
  measureTime("attach-server-handlers");
  const server = options_parsed?.server || new Hono();

  const handlers = await group_api_handlers();

  for (const h of handlers) {
    await attach_api_handler(server, h);
  }

  for (const [path, page_data] of Object.entries(page_map_internal)) {
    if (!page_data.have_server_side_props) continue;
    await attach_page_handler(server, path, page_data, hydrationData);
  }

  // Declare static content
  server.use(
    "*",
    serveStatic({
      root: CLIENT_OUTPUT_DIR,
      getContent: async (path) => {
        try {
          const content = await fs.readFile(path, "utf-8");
          return content;
        } catch (error) {
          return null;
        }
      },
    })
  );

  server.use(
    "*",
    serveStatic({
      root: config.public_dir,
      getContent: async (path) => {
        try {
          const content = await fs.readFile(path, "utf-8");
          return content;
        } catch (error) {
          return null;
        }
      },
    })
  );

  if (FLAGS.SHOW_TIMES) {
    console.log(
      kleur.bold().blue("* Server handlers attached in"),
      measureTime("attach-server-handlers"),
      "ms\n"
    );
  }

  await printPagesMapsAsAsciTree({
    handlers,
    page_map_internal,
  });

  console.log(
    kleur.bold().magenta(
      `Pranx started in ${kleur
        .bold()
        .underline()
        .green(measureTime(PRANX_RUNNING_TAG_TIME) || 0)} ms \n`
    )
  );

  return server;
}
