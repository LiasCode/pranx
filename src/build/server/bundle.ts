import * as esbuild from "esbuild";
import { get_server_config, type ServerBundleOptions } from "./config.js";

export async function bundle_server(options: ServerBundleOptions) {
  const config = await get_server_config(options);

  const result = await esbuild.build(config);

  return result;
}
