import * as esbuild from "esbuild";
import { get_pages_config, type PagesBundleOptions } from "./config.js";

export async function watch_bundle_pages(options: PagesBundleOptions) {
  const bundles_config = await get_pages_config(options);

  const ctx = await esbuild.context(bundles_config);

  return ctx;
}
