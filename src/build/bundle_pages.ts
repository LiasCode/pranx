import * as esbuild from "esbuild";
import type { PranxConfig } from "../config/pranx-config.js";
import { getPageFiles } from "../utils/resolve.js";
import type { PranxBuildMode } from "./build.js";
import { CLIENT_OUTPUT_DIR } from "./constants.js";

type PagesBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export async function bundle_pages(options: PagesBundleOptions) {
  const pages_entry_points = await getPageFiles(options.user_config);

  const pagesBuildResult = await esbuild.build({
    entryPoints: pages_entry_points,
    bundle: true,
    outdir: CLIENT_OUTPUT_DIR,
    format: "esm",
    splitting: true,
    treeShaking: true,
    platform: "browser",
    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    mainFields: ["module", "main"], // Prefer ESM versions
    conditions: ["import", "module", "require"], // Module resolution conditions

    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsx: "automatic",
    jsxImportSource: "preact",

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".module.css": "local-css",
      ".css": "css",
      ".json": "json",
    },

    minify: options.mode === "prod",
    sourcemap: options.mode !== "prod",

    external: ["preact", "preact-render-to-string", "preact-iso"],
    metafile: true,

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
      ...options.user_config.esbuild?.alias,
    },

    define: {
      ...options.user_config.esbuild?.define,
    },

    plugins: options.user_config.esbuild?.plugins,
  });

  return pagesBuildResult;
}
