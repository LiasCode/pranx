import type * as esbuild from "esbuild";
import { glob } from "glob";
import { OUTPUT_DIR } from "./constants";

export const entryPoints = await glob("./src/**/*.{ts,tsx}", {
  ignore: ["src/client/**/*", "src/types/**/*"],
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

  define: {
    "process.env.SHOW_TIMES": JSON.stringify("false"),
  },
};

export const build_config_dev: esbuild.BuildOptions = {
  entryPoints: entryPoints,
  outdir: OUTPUT_DIR,

  bundle: false,
  splitting: false,
  treeShaking: true,
  sourcemap: true,

  format: "esm",
  platform: "node",

  keepNames: true,
  minify: false,

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

  define: {
    "process.env.SHOW_TIMES": JSON.stringify("true"),
  },
};
