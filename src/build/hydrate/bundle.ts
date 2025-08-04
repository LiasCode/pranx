import * as esbuild from "esbuild";
import { get_hydrate_config, type HydrateBundleOptions } from "./config.js";

export async function bundle_hydrate(options: HydrateBundleOptions) {
  const config = await get_hydrate_config(options);

  const result = await esbuild.build(config);

  return result;
}
