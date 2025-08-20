import type { HYDRATE_DATA } from "@/client/mount.js";
import { logger } from "@/utils/logger.js";
import esbuild from "esbuild";
import fse from "fs-extra";
import { glob } from "glob";
import { join, resolve } from "pathe";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import type { PropsWithChildren } from "preact/compat";
import type { LayoutModule, PageModule } from "../../types/index.js";
import {
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PRANX_DIR,
  SOURCE_DIR,
  SOURCE_PAGES_DIR,
} from "./constants.js";

export async function bundle_dev() {
  await fse.emptyDir(OUTPUT_PRANX_DIR);

  const server_entries = await glob(join(SOURCE_PAGES_DIR, "**", "*.{js,ts,tsx,jsx}"), {
    nodir: true,
    absolute: true,
  });

  await esbuild.build({
    entryPoints: server_entries,
    bundle: true,
    outdir: OUTPUT_BUNDLE_SERVER_DIR,
    format: "esm",
    sourcemap: false,

    target: "esnext",
    platform: "node",

    keepNames: true,
    minify: false,
    metafile: false,

    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    treeShaking: true,
    splitting: true,
    packages: "external",

    jsx: "automatic",
    jsxImportSource: "preact",

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
    },
  });

  const browser_entries = (
    await glob(
      [join(SOURCE_PAGES_DIR, "**", "*.{js,ts,tsx,jsx}"), join(SOURCE_DIR, "entry-client.tsx")],
      {
        nodir: true,
        absolute: true,
      }
    )
  ).filter((p) => !p.endsWith("layout.tsx"));

  const browser_bundle_metafile = await esbuild.build({
    entryPoints: browser_entries,
    bundle: true,
    outdir: OUTPUT_BUNDLE_BROWSER_DIR,
    format: "esm",
    sourcemap: false,

    target: "esnext",
    platform: "browser",

    keepNames: true,
    minify: false,
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
    },
  });

  let layout_module = {
    default(props: PropsWithChildren) {
      return props.children;
    },
  } as LayoutModule;

  const layout_path = join(OUTPUT_BUNDLE_SERVER_DIR, "layout.js");

  if (fse.existsSync(layout_path)) {
    layout_module = (await import(layout_path)) as LayoutModule;
  }

  const hydrate_data: HYDRATE_DATA = {
    routes: [],
  };

  const pranx_bundle_replace_path = join(".pranx", "bundle", "browser");

  for (const [file, _output] of Object.entries(browser_bundle_metafile.metafile.outputs)) {
    if (!file.endsWith("page.js")) continue;

    hydrate_data.routes.push({
      path: file.replace(pranx_bundle_replace_path, "").replace("page.js", "") || "/",
      module: file.replace(pranx_bundle_replace_path, ""),
      props: {},
      type: "ssg",
    });
  }

  await fse.writeFile(
    join(OUTPUT_BUNDLE_SERVER_DIR, "routes.manifest.json"),
    JSON.stringify(hydrate_data.routes, null, 2)
  );

  for (const route of hydrate_data.routes) {
    const file_absolute = resolve(join(OUTPUT_BUNDLE_BROWSER_DIR, route.module));
    const page_module = (await import(file_absolute)) as PageModule;

    const page_prerendered = renderToString(
      h(layout_module.default, {}, h(page_module.default, {}, null))
    );

    await fse.writeFile(
      file_absolute.replace("page.js", "index.html"),
      `<!DOCTYPE html>${page_prerendered
        .replace(
          "__PRANX_SCRIPTS__",
          `
        <script
          id="__PRANX_HYDRATE_DATA__"
          type="application/json"
        >
          ${JSON.stringify(hydrate_data, null, 2)}
        </script>
        <script
          type="module"
          src="/_.._/entry-client.js"
        ></script>`
        )
        .trim()}`
    );
  }
}
