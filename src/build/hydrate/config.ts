import type { BuildOptions } from "esbuild";
import type { PranxConfig } from "../../config/pranx-config.js";
import type { PranxBuildMode } from "../build.js";
import { HYDRATE_OUTPUT_FILE, HYDRATE_SOURCE_FILE } from "../constants.js";

export type HydrateBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export const get_hydrate_config = async (options: HydrateBundleOptions): Promise<BuildOptions> => {
  return {
    entryPoints: [HYDRATE_SOURCE_FILE],
    bundle: true,
    outfile: HYDRATE_OUTPUT_FILE,
    format: "esm",
    platform: "browser",

    minify: options.mode === "prod",
    sourcemap: options.mode !== "prod",
    treeShaking: true,

    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsx: "automatic",
    jsxImportSource: "preact",

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
    },

    external: ["preact", "preact-render-to-string", "preact-iso"],

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    plugins: [],
    metafile: true,
  };
};
