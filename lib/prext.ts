import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import * as fs from "node:fs/promises";
import { build, PAGES_OUTPUT_DIR, PREXT_OUTPUT_DIR } from "./build";
import { load_user_config } from "./config/config";
import { Logger } from "./logger";

export async function init(props?: { server?: Hono; watch?: boolean }): Promise<Hono> {
  Logger.info("Init");

  await fs.rm(PREXT_OUTPUT_DIR, { force: true, recursive: true });

  const config = await load_user_config();

  if (config === null) {
    Logger.error("Config can't be parsed");
    process.exit(1);
  }

  console.time("build-time");
  await build(config, "dev");
  console.timeEnd("build-time");

  const server = props?.server || new Hono();

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
