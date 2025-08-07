import { Hono } from "hono";
import type { PranxBuildMode } from "./build/build.js";
import { start_dev } from "./cmd/dev.js";
import { start_prod } from "./cmd/prod.js";

export type PranxMode = PranxBuildMode;

export type InitOptions = {
  /**
   * for use your own hono instance
   * */
  server?: Hono;

  /**
   * Optimize bundle and watch changes
   * @default "dev"
   **/
  mode?: PranxMode;
};

export async function init(options?: InitOptions): Promise<Hono> {
  const options_parsed: Required<InitOptions> = {
    mode: options?.mode || "prod",
    server: options?.server || new Hono(),
  };

  if (options_parsed.mode === "dev") {
    return await start_dev(options_parsed.server);
  }

  if (options_parsed.mode === "prod") {
    return await start_prod(options_parsed.server);
  }

  throw new Error("Pranx mode should be 'dev' or 'prod'");
}
