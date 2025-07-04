import * as esbuild from "esbuild";
import * as fs from "node:fs/promises";
import path from "node:path";
import type { PranxConfig } from "../config/pranx-config.js";
import type { PranxBuildMode } from "./build.js";
import { VENDOR_BUNDLE_OUTPUT_PATH, VENDOR_SOURCE_DIR } from "./constants.js";

type VendorsBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export async function bundle_vendors(options: VendorsBundleOptions) {
  const vendorEntries = (await fs.readdir(VENDOR_SOURCE_DIR))
    .filter((f) => f.endsWith("js"))
    .map((f) => path.join(VENDOR_SOURCE_DIR, f));

  const result = await esbuild.build({
    entryPoints: vendorEntries,
    bundle: false,
    outdir: VENDOR_BUNDLE_OUTPUT_PATH,
    format: "esm",
    platform: "browser",
    minify: options.mode === "prod",
    sourcemap: options.mode !== "prod",
    plugins: [],
  });

  return result;
}
