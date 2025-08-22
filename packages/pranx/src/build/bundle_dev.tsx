import { META_TAG } from "@/client/Meta.js";
import type { HYDRATE_DATA } from "@/client/mount.js";
import { SCRIPTS_TAG } from "@/client/Scripts.js";
import { minifySync } from "@swc/html";
import esbuild from "esbuild";
import fse from "fs-extra";
import { glob } from "glob";
import { join, resolve } from "pathe";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import type { PropsWithChildren } from "preact/compat";
import type { PageModule, ServerEntryModule } from "../../types/index.js";
import {
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PRANX_DIR,
  SOURCE_DIR,
  SOURCE_PAGES_DIR,
} from "./constants.js";

export async function bundle_dev() {
  await fse.emptyDir(OUTPUT_PRANX_DIR);

  const server_entries = await glob(
    [join(SOURCE_PAGES_DIR, "**/*page.{js,ts,tsx,jsx}"), join(SOURCE_DIR, "entry-server.tsx")],
    {
      nodir: true,
      absolute: true,
    }
  );

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

    outbase: SOURCE_DIR,

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".module.css": "local-css",
      ".css": "css",
      ".json": "json",
    },
  });

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
    sourcemap: true,

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
      ".module.css": "local-css",
      ".css": "css",
      ".json": "json",
    },
  });

  let server_entry_module = {
    default(props: PropsWithChildren) {
      return props.children;
    },
  } as ServerEntryModule;

  const server_entry_path = join(OUTPUT_BUNDLE_SERVER_DIR, "entry-server.js");

  if (fse.existsSync(server_entry_path)) {
    server_entry_module = (await import(server_entry_path)) as ServerEntryModule;
  }

  const hydrate_data: HYDRATE_DATA = {
    routes: [],
  };

  const pranx_bundle_replace_path = join(".pranx", "browser");

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
    const file_absolute = resolve(join(OUTPUT_BUNDLE_SERVER_DIR, "pages", route.module));
    const page_module = (await import(file_absolute)) as PageModule;

    const page_prerendered = renderToString(
      h(server_entry_module.default, {}, h(page_module.default, null, null))
    );

    const page_as_html = `<!DOCTYPE html>
      ${page_prerendered.replace(META_TAG, "").replace(
        SCRIPTS_TAG,
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
      )}`;

    await fse.writeFile(
      join(OUTPUT_BUNDLE_BROWSER_DIR, route.path, "index.html"),
      minifySync(page_as_html, {
        collapseBooleanAttributes: true,
        collapseWhitespaces: "smart",
        normalizeAttributes: true,
        sortAttributes: true,
        removeRedundantAttributes: "smart",
        quotes: true,
        selfClosingVoidElements: false,
      }).code
    );
  }
}
