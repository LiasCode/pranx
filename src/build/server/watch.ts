import * as esbuild from "esbuild";
import { get_server_config, type ServerBundleOptions } from "./config.js";

export async function watch_bundle_server(options: ServerBundleOptions) {
  const config = await get_server_config(options);

  const ctx = await esbuild.context(config);

  return ctx;
}
