import * as esbuild from "esbuild";
import * as fse from "fs-extra";
import path from "node:path";

const OUTPUT_DIR = path.resolve(path.join(process.cwd(), "dist"));
const OUTPUT_VENDORS_DIR = path.join(OUTPUT_DIR, "client");

await fse.emptyDir(OUTPUT_DIR);
await fse.emptyDir(OUTPUT_VENDORS_DIR);

await esbuild.build({
  entryPoints: ["./lib/**/*.ts", "./lib/**/*.tsx"],
  outdir: path.resolve(path.join(process.cwd(), "dist")),

  bundle: false,
  splitting: false,
  treeShaking: true,
  sourcemap: false,

  format: "esm",
  platform: "node",

  keepNames: true,
  minify: false,

  jsxFactory: "h",
  jsxFragment: "Fragment",
  jsx: "automatic",
  jsxImportSource: "preact",

  chunkNames: "_chunks/[name]-[hash]",
  color: true,

  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "tsx",
    ".tsx": "tsx",
    ".json": "json",
  },
});

await fse.copy("./lib/client", OUTPUT_VENDORS_DIR);
