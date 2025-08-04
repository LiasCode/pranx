import * as esbuild from "esbuild";
import { get_vendors_config, type VendorsBundleOptions } from "./config.js";

export async function watch_bundle_vendors(options: VendorsBundleOptions) {
  const config = await get_vendors_config(options);

  return {
    preact: await esbuild.context(config.preact),
    router: await esbuild.context(config.router),
  };
}
