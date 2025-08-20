import esbuild from "esbuild";
import fse from "fs-extra";
import { join } from "pathe";

const SOURCE_DIR = join(process.cwd(), "src");
const OUTPUT_DIR = join(process.cwd(), "dist");

await fse.emptyDir(OUTPUT_DIR);

await esbuild.build({
  entryPoints: [join(SOURCE_DIR, "bin", "index.ts"), join(SOURCE_DIR, "index.ts")],
  bundle: true,
  outdir: OUTPUT_DIR,
  target: "ESNext",
  format: "esm",

  keepNames: true,
  minify: false,
  metafile: false,

  chunkNames: "_chunks/[name]-[hash]",
  assetNames: "_assets/[name]-[hash]",

  mainFields: ["module", "main"], // Prefer ESM versions
  conditions: ["import", "module", "require"], // Module resolution conditions

  treeShaking: true,
  packages: "external",
  splitting: true,

  jsx: "transform",
  jsxFactory: "h",
  jsxFragment: "Fragment",

  platform: "node",

  alias: {
    "@": SOURCE_DIR,
    "react": "preact/compat",
    "react-dom": "preact/compat",
  },

  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "tsx",
    ".tsx": "tsx",
    ".json": "json",
  },
});
