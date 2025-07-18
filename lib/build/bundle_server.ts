import * as esbuild from "esbuild";
import type { PranxConfig } from "../config/pranx-config.js";
import { getLoadersFiles, getMetaFiles, getRoutesHandlersFiles } from "../utils/resolve.js";
import type { PranxBuildMode } from "./build.js";
import { SERVER_OUTPUT_DIR } from "./constants.js";

type HandlersBundleOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
};

export async function bundle_server(options: HandlersBundleOptions) {
  const handlers_entry_points = await getRoutesHandlersFiles(options.user_config);
  const loader_entry_points = await getLoadersFiles(options.user_config);
  const meta_entry_points = await getMetaFiles(options.user_config);

  const result = await esbuild.build({
    entryPoints: [...handlers_entry_points, ...loader_entry_points, ...meta_entry_points],
    bundle: true,
    outdir: SERVER_OUTPUT_DIR,
    format: "esm",
    platform: "node",
    splitting: true,
    treeShaking: true,
    chunkNames: "_chunks/[name]-[hash]",
    outbase: options.user_config.pages_dir,
    resolveExtensions: [".js"],

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
      ".css": "text",
    },
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsx: "automatic",
    jsxImportSource: "preact",

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    external: ["preact", "preact-render-to-string", "preact-iso"],

    sourcemap: false,
    minify: false,
    metafile: true,
  });

  return result;
}
