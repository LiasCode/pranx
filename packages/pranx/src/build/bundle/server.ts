import { mdx_pranx_plugin } from "@/plugins/mdx-plugin";
import { tailwindcss_plugin } from "@/plugins/tailwind-plugin";
import esbuild from "esbuild";
import fse from "fs-extra";
import { glob } from "glob";
import { join } from "pathe";
import type { PranxConfig } from "types/index";
import { OUTPUT_BUNDLE_SERVER_DIR, SOURCE_DIR, SOURCE_PAGES_DIR } from "../constants";

export async function bundle_server(options: { optimize: boolean; user_config: PranxConfig }) {
  const server_entries = await glob(
    [
      join(SOURCE_PAGES_DIR, "**/*{page,route}.{js,ts,tsx,jsx}"),
      join(SOURCE_DIR, "entry-server.{tsx,jsx}"),
      join(SOURCE_DIR, "App.{tsx,jsx}"),
    ],
    {
      nodir: true,
      absolute: true,
    }
  );

  const server_bundle_result = await esbuild.build({
    entryPoints: server_entries,
    bundle: true,
    outdir: OUTPUT_BUNDLE_SERVER_DIR,
    format: "esm",
    sourcemap: !options.optimize,

    target: "esnext",
    platform: "node",

    keepNames: true,
    minify: options.optimize,
    metafile: true,

    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    treeShaking: true,
    splitting: true,
    packages: "external",

    jsx: "automatic",
    jsxImportSource: "preact",

    mainFields: ["module", "main"], // Prefer ESM versions
    conditions: ["import", "module", "require"], // Module resolution conditions

    outbase: SOURCE_DIR,

    alias: {
      ...(options.user_config.esbuild?.alias || {}),
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    define: {
      ...(options.user_config.esbuild?.define || {}),
    },

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".module.css": "empty",
      ".css": "empty",
      ".json": "json",
    },

    plugins: [
      mdx_pranx_plugin(),
      tailwindcss_plugin(),
      ...(options.user_config.esbuild?.plugins || []),
    ],
  });

  const css_emited = await glob([join(OUTPUT_BUNDLE_SERVER_DIR, "**/*.css")], {
    nodir: true,
    absolute: true,
  });

  for (const css_path of css_emited) {
    await fse.remove(css_path);
  }

  return server_bundle_result;
}
