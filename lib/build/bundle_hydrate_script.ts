import * as esbuild from "esbuild";
import path from "node:path";
import type { PranxConfig } from "../config/pranx-config.js";
import type { PranxBuildMode } from "./build.js";
import { CLIENT_OUTPUT_DIR } from "./constants.js";

type HydrateBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export async function bundle_hydrate_script(options: HydrateBundleOptions) {
  const originHydrateScriptPath = path.resolve(
    path.join(import.meta.dirname, "..", "client", "hydrate.js")
  );
  const outputHydrateScriptPath = path.join(CLIENT_OUTPUT_DIR, "hydrate.js");

  const result = await esbuild.build({
    entryPoints: [originHydrateScriptPath],
    bundle: true,
    outfile: outputHydrateScriptPath,
    format: "esm",
    platform: "browser",

    minify: options.mode === "prod",
    sourcemap: options.mode !== "prod",

    jsxFactory: "h",
    jsxFragment: "Fragment",
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
    },

    external: ["preact"],

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    plugins: [],
    metafile: true,
  });

  return result;
}
