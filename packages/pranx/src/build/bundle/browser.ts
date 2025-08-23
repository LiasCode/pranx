import { mdx_pranx_plugin } from "@/plugins/mdx.js";
import { strip_server_only_from_pages_plugin } from "@/plugins/strip-server-only-from-pages.js";
import esbuild from "esbuild";
import { glob } from "glob";
import { join } from "pathe";
import { OUTPUT_BUNDLE_BROWSER_DIR, SOURCE_DIR, SOURCE_PAGES_DIR } from "../constants.js";

export async function bundle_browser(options: { optimize: boolean }) {
  const browser_entries = await glob(
    [join(SOURCE_PAGES_DIR, "**/*page.{js,ts,tsx,jsx}"), join(SOURCE_DIR, "entry-client.tsx")],
    {
      nodir: true,
      absolute: true,
    }
  );

  const browser_bundle_metafile = await esbuild.build({
    entryPoints: browser_entries,
    bundle: true,
    outdir: OUTPUT_BUNDLE_BROWSER_DIR,
    format: "esm",
    sourcemap: !options.optimize,

    target: "esnext",
    platform: "browser",

    keepNames: true,
    minify: options.optimize,
    metafile: true,

    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    treeShaking: true,
    splitting: true,
    packages: "bundle",

    jsx: "automatic",
    jsxImportSource: "preact",

    outbase: SOURCE_PAGES_DIR,

    mainFields: ["module", "main"], // Prefer ESM versions
    conditions: ["import", "module", "require"], // Module resolution conditions

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
      ".css": "css",
      ".module.css": "local-css",
    },

    plugins: [
      strip_server_only_from_pages_plugin([
        "getServerSideProps",
        "getStaticProps",
        "getStaticPaths",
        "getInitialProps",
        "meta",
      ]),
      mdx_pranx_plugin(),
    ],
  });

  return browser_bundle_metafile;
}
