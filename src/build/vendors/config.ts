import type { BuildOptions } from "esbuild";
import * as fs from "node:fs/promises";
import path from "node:path";
import type { PranxConfig } from "../../config/pranx-config.js";
import type { PranxBuildMode } from "../build.js";
import { VENDOR_BUNDLE_OUTPUT_PATH, VENDOR_SOURCE_DIR } from "../constants.js";

export type VendorsBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export const get_vendors_config = async (
  options: VendorsBundleOptions
): Promise<{
  preact: BuildOptions;
  router: BuildOptions;
}> => {
  const vendorEntries = (await fs.readdir(VENDOR_SOURCE_DIR))
    .filter((f) => f.endsWith("js") && f !== "router.js")
    .map((f) => path.join(VENDOR_SOURCE_DIR, f));

  return {
    preact: {
      entryPoints: vendorEntries,
      bundle: false,
      outdir: VENDOR_BUNDLE_OUTPUT_PATH,
      format: "esm",
      platform: "browser",
      minify: options.mode === "prod",
      sourcemap: options.mode !== "prod",
      plugins: [],
    },
    router: {
      entryPoints: [path.join(VENDOR_SOURCE_DIR, "router.js")],
      bundle: true,
      outdir: VENDOR_BUNDLE_OUTPUT_PATH,
      format: "esm",
      platform: "browser",
      minify: options.mode === "prod",
      sourcemap: options.mode !== "prod",
      plugins: [],
      external: ["preact"],
    },
  };
};
