import * as esbuild from "esbuild";
import { get_pages_config, type PagesBundleOptions } from "./config.js";

export async function bundle_pages(options: PagesBundleOptions) {
  const bundles_config = await get_pages_config(options);

  const pagesBuildResult = await esbuild.build(bundles_config);

  return pagesBuildResult;
}
