import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, type PranxBuildMode } from "./build/build.js";
import { PAGES_OUTPUT_DIR, PRANX_OUTPUT_DIR, ROUTE_HANDLER_OUTPUT_DIR } from "./build/constants.js";
import { load_user_config } from "./config/config.js";
import { attach_api_handler } from "./hono/attach-api-handler.js";
import { Logger } from "./logger/index.js";
import { group_api_handlers } from "./utils/resolve.js";

type PranxMode = PranxBuildMode;

type InitOptions = {
  server?: Hono;
  watch?: boolean;
  mode?: PranxMode;
};

export async function init(options?: InitOptions): Promise<Hono> {
  console.time("[PRANX]-running");

  Logger.info("[PRANX]-[INIT]");

  const options_parsed: InitOptions = {
    mode: "dev",
    watch: true,
    ...options,
  };

  await fs.rm(PRANX_OUTPUT_DIR, { force: true, recursive: true });

  const config = await load_user_config();

  if (config === null) {
    Logger.error("[PRANX]-Config can't be parsed");
    process.exit(1);
  }

  console.time("[PRANX]-build-time");
  await build(config, options_parsed.mode);
  console.timeEnd("[PRANX]-build-time");

  console.time("[PRANX]-server-attach");

  const server = options_parsed?.server || new Hono();

  const handlers = await group_api_handlers();

  for (const h of handlers) {
    await attach_api_handler(server, h);
    Logger.success(`Attached api handler ${h.file_path.replace(ROUTE_HANDLER_OUTPUT_DIR, "")}`);
  }

  server.get(
    "*",
    serveStatic({
      root: PAGES_OUTPUT_DIR,
      getContent(path) {
        return fs.readFile(path, "utf-8");
      },
    })
  );
  console.timeEnd("[PRANX]-server-attach");

  console.timeEnd("[PRANX]-running");
  return server;
}
