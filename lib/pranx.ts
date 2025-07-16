import * as fse from "fs-extra";
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, type PranxBuildMode } from "./build/build.js";
import { CLIENT_OUTPUT_DIR, PRANX_OUTPUT_DIR, SERVER_OUTPUT_DIR } from "./build/constants.js";
import { process_pages } from "./build/process_pages.js";
import { load_user_config } from "./config/config.js";
import { attach_api_handler } from "./hono/attach-api-handler.js";
import { attach_page_handler } from "./hono/attach-page-handler.js";
import { Logger } from "./logger/index.js";
import { filePathToRoutingPath } from "./utils/filePathToRoutingPath.js";
import { group_api_handlers } from "./utils/resolve.js";

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

export async function init(options?: InitOptions): Promise<Hono> {
  console.time("[PRANX]-running");

  Logger.info("[PRANX]-[INIT]");

  const options_parsed: InitOptions = {
    mode: "dev",
    watch: true,
    ...options,
  };

  await fse.emptyDir(PRANX_OUTPUT_DIR);

  const config = await load_user_config();

  if (config === null) {
    Logger.error("Config can't be parsed");
    process.exit(1);
  }

  // Build and bundle
  console.time("[PRANX]-build-time");
  const build_result = await build(config, options_parsed.mode);
  console.timeEnd("[PRANX]-build-time");

  // Process and generate public files
  console.time("[PRANX]-generation");
  const { page_map_internal, hydrationData } = await process_pages({
    mode: options_parsed.mode || "dev",
    pages_bundle_result: build_result.pages,
    user_config: config,
    server_bundle_result: build_result.server,
  });
  console.timeEnd("[PRANX]-generation");

  // Attach endpoints to hono server and declare static content
  console.time("[PRANX]-server-attach");

  const server = options_parsed?.server || new Hono();

  const handlers = await group_api_handlers();

  for (const h of handlers) {
    await attach_api_handler(server, h);
    Logger.success(
      `[ATTACHED HANDLER] ${filePathToRoutingPath(h.file_path.replace(SERVER_OUTPUT_DIR, ""))} ${Object.keys(h?.exports?.methods || {}).toString()}`
    );
  }

  for (const [path, page_data] of Object.entries(page_map_internal)) {
    await attach_page_handler(server, path, page_data, hydrationData);
  }

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
  console.timeEnd("[PRANX]-server-attach");

  console.timeEnd("[PRANX]-running");
  return server;
}
