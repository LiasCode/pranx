import type * as esbuild from "esbuild";
import { glob } from "glob";
import path from "node:path";

export const OUTPUT_DIR = path.resolve(path.join(process.cwd(), "dist"));
export const OUTPUT_VENDORS_DIR = path.join(OUTPUT_DIR, "client");

export const TYPES_SRC_DIR = path.join(process.cwd(), "lib", "types");
export const TYPES_OUT_DIR = path.join(OUTPUT_DIR, "types");

export const entryPoints = await glob("./lib/**/*.{ts,tsx}", {
  ignore: ["lib/client/**/*", "lib/types/**/*"],
});

export const build_config: esbuild.BuildOptions = {
  entryPoints: entryPoints,
  outdir: OUTPUT_DIR,

  bundle: false,
  splitting: false,
  treeShaking: true,
  sourcemap: false,

  format: "esm",
  platform: "node",

  keepNames: true,
  minify: true,

  metafile: false,

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
};
