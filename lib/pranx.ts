import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, PAGES_OUTPUT_DIR, PRANX_OUTPUT_DIR, type PranxBuildMode } from "./build";
import { load_user_config } from "./config/config";
import { Logger } from "./logger";

type PranxMode = PranxBuildMode;

type InitOptions = {
  server?: Hono;
  watch?: boolean;
  mode?: PranxMode;
};

export async function init(options?: InitOptions): Promise<Hono> {
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

  const server = options_parsed?.server || new Hono();

  // await attach_endpoints(server, router_components_parsed);

  server.get(
    "*",
    serveStatic({
      root: PAGES_OUTPUT_DIR,
      getContent(path) {
        return fs.readFile(path, "utf-8");
      },
    })
  );

  return server;
}
