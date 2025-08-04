import * as fse from "fs-extra";
import type { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import kleur from "kleur";
import * as fs from "node:fs/promises";
import { build } from "../build/build.js";
import {
  CLIENT_OUTPUT_DIR,
  FLAGS,
  PRANX_OUTPUT_DIR,
  SERVER_OUTPUT_DIR,
} from "../build/constants.js";
import { process_pages } from "../build/generation/process_pages.js";
import { write_pages_html } from "../build/generation/write_pages_html.js";
import { load_user_config } from "../config/config.js";
import { Logger } from "../logger/index.js";
import { attach_api_handler } from "../server/hono/attach-api-handler.js";
import { attach_page_handler } from "../server/hono/attach-page-handler.js";
import { printPagesMapsAsAsciTree } from "../utils/printPagesMapsAsAsciTree.js";
import { group_api_handlers } from "../utils/resolve.js";
import { measureTime } from "../utils/time-perf.js";

const PRANX_RUNNING_TAG_TIME = "PRANX_RUNNING_TAG_TIME" as const;

export async function start_prod(server_instance: Hono): Promise<Hono> {
  measureTime(PRANX_RUNNING_TAG_TIME);

  // Clean and prepare .pranx folder
  await fse.emptyDir(PRANX_OUTPUT_DIR);
  await fse.emptyDir(CLIENT_OUTPUT_DIR);
  await fse.emptyDir(SERVER_OUTPUT_DIR);

  console.log(kleur.bold().magenta("Pranx Start"));
  console.log(`mode: ${kleur.bold().green("prod")}\n`);

  measureTime("load-user-config");

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
  const build_result = await build(config, "prod");

  // Process and generate public files
  measureTime("process-pages");
  const { page_map_internal, hydrationData } = await process_pages({
    mode: "prod",
    pages_bundle_result: build_result.pages,
    user_config: config,
    server_bundle_result: build_result.server,
  });

  if (FLAGS.SHOW_TIMES) {
    console.log(kleur.bold().blue("* Pages processed in"), measureTime("process-pages"), "ms");
  }

  // Write Pages as Html
  measureTime("write-pages-html");
  await write_pages_html(page_map_internal, hydrationData, "prod");

  if (FLAGS.SHOW_TIMES) {
    console.log(
      kleur.bold().blue("* Write pages as html in"),
      measureTime("write-pages-html"),
      "ms"
    );
  }

  // Attach endpoints to hono server
  measureTime("attach-server-handlers");
  const server = server_instance;

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
