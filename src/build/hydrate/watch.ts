import * as esbuild from "esbuild";
import { get_hydrate_config, type HydrateBundleOptions } from "./config.js";

export async function watch_bundle_hydrate(options: HydrateBundleOptions) {
  const config = await get_hydrate_config(options);

  const ctx = await esbuild.context(config);

  return ctx;
}
