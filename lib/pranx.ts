import * as fse from "fs-extra";
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, type PranxBuildMode } from "./build/build.js";
import { PAGES_OUTPUT_DIR, PRANX_OUTPUT_DIR, ROUTE_HANDLER_OUTPUT_DIR } from "./build/constants.js";
import { load_user_config } from "./config/config.js";
import { attach_api_handler } from "./hono/attach-api-handler.js";
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

  console.time("[PRANX]-build-time");
  await build(config, options_parsed.mode);
  console.timeEnd("[PRANX]-build-time");

  // Attach endpoints to hono server and declare static content
  console.time("[PRANX]-server-attach");

  const server = options_parsed?.server || new Hono();

  const handlers = await group_api_handlers();

  for (const h of handlers) {
    await attach_api_handler(server, h);
    Logger.success(
      `[ATTACHED HANDLER] ${filePathToRoutingPath(h.file_path.replace(ROUTE_HANDLER_OUTPUT_DIR, ""))} ${Object.keys(h?.exports?.methods || {}).toString()}`
    );
  }

  server.use(
    "*",
    serveStatic({
      root: PAGES_OUTPUT_DIR,
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
