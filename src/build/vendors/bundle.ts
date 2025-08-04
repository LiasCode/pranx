import * as esbuild from "esbuild";
import { get_vendors_config, type VendorsBundleOptions } from "./config.js";

export async function bundle_vendors(options: VendorsBundleOptions) {
  const config = await get_vendors_config(options);

  const preact_result = await esbuild.build(config.preact);
  const router_result = await esbuild.build(config.router);

  return {
    preact: preact_result,
    router: router_result,
  };
}
