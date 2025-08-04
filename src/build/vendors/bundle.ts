import * as esbuild from "esbuild";
import { get_vendors_config, type VendorsBundleOptions } from "./config.js";

export async function bundle_vendors(options: VendorsBundleOptions) {
  const config = await get_vendors_config(options);

  await esbuild.build(config.preact);
  await esbuild.build(config.router);
}
