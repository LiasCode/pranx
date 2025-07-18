import * as fse from "fs-extra";
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, type PranxBuildMode } from "./build/build.js";
import { CLIENT_OUTPUT_DIR, PRANX_OUTPUT_DIR, SERVER_OUTPUT_DIR } from "./build/constants.js";
import type { InternalPageMapResult } from "./build/generate_pages_map.js";
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

const PRANX_RUNNING_TAG_TIME = "Pranx Running in" as const;

export async function init(options?: InitOptions): Promise<Hono> {
  console.log("========");
  console.time(PRANX_RUNNING_TAG_TIME);

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
  const build_result = await build(config, options_parsed.mode);

  // Process and generate public files
  const { page_map_internal, hydrationData } = await process_pages({
    mode: options_parsed.mode || "dev",
    pages_bundle_result: build_result.pages,
    user_config: config,
    server_bundle_result: build_result.server,
  });

  // Attach endpoints to hono server and declare static content
  const server = options_parsed?.server || new Hono();

  const handlers = await group_api_handlers();

  Logger.info("[server]");
  for (const h of handlers) {
    await attach_api_handler(server, h);
    const path = filePathToRoutingPath(h.file_path.replace(SERVER_OUTPUT_DIR, ""));
    console.log(` - ${path} (${Object.keys(h?.exports?.methods || {}).toString()})`);
  }

  for (const [path, page_data] of Object.entries(page_map_internal)) {
    if (!page_data.have_server_side_props) continue;
    await attach_page_handler(server, path, page_data, hydrationData);
  }

  printPagesMapsasAsciTree(page_map_internal);

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

  console.timeEnd(PRANX_RUNNING_TAG_TIME);
  console.log("========");
  return server;
}

const printPagesMapsasAsciTree = (page_map_internal: InternalPageMapResult) => {
  Logger.info("[pages]");
  for (const [path, page_data] of Object.entries(page_map_internal)) {
    console.log(
      ` - ${filePathToRoutingPath(path)} (${page_data.isStatic ? "static" : "server props"})`
    );
  }
};
