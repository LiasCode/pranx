import * as esbuild from "esbuild";
import * as fse from "fs-extra";
import { exec } from "node:child_process";
import path from "node:path";

const OUTPUT_DIR = path.resolve(path.join(process.cwd(), "dist"));
const OUTPUT_VENDORS_DIR = path.join(OUTPUT_DIR, "client");

await fse.emptyDir(OUTPUT_DIR);
await fse.emptyDir(OUTPUT_VENDORS_DIR);

await fse.copy("./lib/client", OUTPUT_VENDORS_DIR);

const build_config: esbuild.BuildOptions = {
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
};

if (process.env.WATCH === "true") {
  const ctx = await esbuild.context(build_config);
  await ctx.watch();
  exec("tsc --watch");
} else {
  await esbuild.build(build_config);
}
