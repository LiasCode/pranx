import mdx from "@mdx-js/esbuild";
import * as esbuild from "esbuild";
import * as fse from "fs-extra";
import { minify as minifyHtml } from "html-minifier";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import path from "node:path";
import { h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type { PranxConfig } from "./config/pranx-config";
import { getPageFiles, getPageModule, getRoutesHandlersFiles } from "./utils/resolve";

export type PranxBuildMode = "dev" | "prod";

export const PRANX_OUTPUT_DIR = path.resolve(path.join(process.cwd(), ".pranx"));

export const PAGES_OUTPUT_DIR = path.resolve(path.join(PRANX_OUTPUT_DIR, "pages"));

export const ROUTE_HANDLER_OUTPUT_DIR = path.resolve(
  path.join(PRANX_OUTPUT_DIR, "server", "handlers")
);

export const VENDOR_SRC_DIR = path.join(import.meta.dirname, "client", "vendor");
export const VENDOR_BUNDLE_OUTPUT_PATH = path.join(PAGES_OUTPUT_DIR, "vendor");

export async function build(user_config: PranxConfig, mode: PranxBuildMode = "prod") {
  // Clean .pranx folder and prepare
  await fse.emptyDir(PRANX_OUTPUT_DIR);
  await fse.emptyDir(PAGES_OUTPUT_DIR);
  await fse.emptyDir(ROUTE_HANDLER_OUTPUT_DIR);

  // Bundle Hydrate Script
  await bundle_hydrate_script(user_config, mode);

  // Bundle vendors
  await bundle_vendors(user_config, mode);

  // Bundle pages
  const pages_bundle_result = await bundle_pages(user_config, mode);

  const outputsPagesFiles = Object.keys(pages_bundle_result.metafile.outputs).filter((f) =>
    f.endsWith("page.js")
  );
  const outputDir = PAGES_OUTPUT_DIR;

  for (const pageFile of outputsPagesFiles) {
    const pageModule = await getPageModule(path.resolve(path.join(process.cwd(), pageFile)));
    const PageComponent = pageModule.default;
    const MetaComponent = pageModule.meta;
    const getStaticProps = pageModule.getStaticProps;
    // const getServerSideProps = pageModule.getServerSideProps;
    // const getStaticPaths = pageModule.getStaticPaths;

    let getStaticPropsResult = null;

    if (getStaticProps !== undefined) {
      getStaticPropsResult = await getStaticProps();
    }

    const pageFilePath = pageFile.split("/").filter((_, i, arr) => {
      if (i === 0 || i === 1) return false;
      if (i === arr.length - 1) return false;
      return true;
    });

    const outputFileDir = path.join(outputDir, ...pageFilePath);

    const outputFile = path.join(outputFileDir, "index.html");

    let meta_content = "";

    if (MetaComponent !== undefined) {
      const meta_return = await MetaComponent();
      meta_content = await renderToStringAsync(meta_return);
    }

    const page_content = await renderToStringAsync(
      h(PageComponent, { ...getStaticPropsResult?.props })
    );

    // Script that hydrate script will load to render the page again
    const publicPageScriptPath = pageFile.replace(".pranx/pages/", "/");
    const publicCssPath = publicPageScriptPath.replace("page.js", "page.css");
    const existsCss = existsSync(path.join(PAGES_OUTPUT_DIR, publicCssPath));

    // Embed props and component map for client-side hydration (__PRANX_DATA__)
    const htmlContent = `
      <!doctype html> 
      <html>
        <head>
          ${meta_content}
          ${existsCss ? `<link rel="stylesheet" href="${publicCssPath}">` : ""}
        </head>

        <body>
         ${page_content}
        </body>

        <script
          id="__PRANX_DATA__"
          type="application/json"
          >
            ${JSON.stringify({
              pagePath: publicPageScriptPath,
              pageProps: getStaticPropsResult?.props || {},
              pageMap: {},
            })}
        </script>
      
        <script type="importmap">
          ${JSON.stringify({
            imports: {
              "preact": `./${path.join(path.relative(path.dirname(outputFile), VENDOR_BUNDLE_OUTPUT_PATH), "preact.js")}`,
              "preact/jsx-runtime": `./${path.join(path.relative(path.dirname(outputFile), VENDOR_BUNDLE_OUTPUT_PATH), "jsxRuntime.js")}`,
              "preact/hooks": `./${path.join(path.relative(path.dirname(outputFile), VENDOR_BUNDLE_OUTPUT_PATH), "hooks.js")}`,
              "preact/compat": `./${path.join(path.relative(path.dirname(outputFile), VENDOR_BUNDLE_OUTPUT_PATH), "compat.js")}`,
              "preact/devtools": `./${path.join(path.relative(path.dirname(outputFile), VENDOR_BUNDLE_OUTPUT_PATH), "devtools.js")}`,
            },
          })}
        </script>
        <script id="PRANX_HYDRATE" type="module" src="/hydrate.js"></script>
      </html>
    `;

    const finalHtml =
      mode === "prod"
        ? minifyHtml(htmlContent, {
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            html5: true,
            minifyJS: false,
            minifyCSS: true,
            minifyURLs: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeTagWhitespace: true,
          })
        : htmlContent;

    await fs.writeFile(outputFile, finalHtml);
  }

  // Bundle user Handlers
  await bundle_handlers(user_config, mode);
}

export async function bundle_hydrate_script(_user_config: PranxConfig, mode: PranxBuildMode) {
  const originHydrateScriptPath = path.resolve(
    path.join(import.meta.dirname, "client", "hydrate.js")
  );
  const outputHydrateScriptPath = path.join(PAGES_OUTPUT_DIR, "hydrate.js");

  await esbuild.build({
    entryPoints: [originHydrateScriptPath],
    bundle: true,
    outfile: outputHydrateScriptPath,
    format: "esm",
    platform: "browser",

    minify: mode === "prod",
    sourcemap: mode !== "prod",

    jsxFactory: "h",
    jsxFragment: "Fragment",
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
    },

    external: ["preact"],

    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    plugins: [],
  });
}

export async function bundle_vendors(_user_config: PranxConfig, mode: PranxBuildMode) {
  const vendorEntries = (await fs.readdir(VENDOR_SRC_DIR))
    .filter((f) => f.endsWith("js"))
    .map((f) => path.join(VENDOR_SRC_DIR, f));

  await esbuild.build({
    entryPoints: vendorEntries,
    bundle: false,
    outdir: VENDOR_BUNDLE_OUTPUT_PATH,
    format: "esm",
    platform: "browser",
    minify: mode === "prod",
    sourcemap: mode !== "prod",
    plugins: [],
  });
}

export async function bundle_pages(user_config: PranxConfig, mode: PranxBuildMode) {
  // Find pages entry files
  const pages_entry_points = await getPageFiles(user_config);

  const pagesBuildResult = await esbuild.build({
    entryPoints: pages_entry_points,
    bundle: true,
    outdir: PAGES_OUTPUT_DIR,
    format: "esm",
    splitting: true,
    treeShaking: true,
    platform: "node",
    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsx: "automatic",
    jsxImportSource: "preact",

    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".css": "css",
      ".json": "json",
    },

    minify: mode === "prod",
    sourcemap: mode !== "prod",

    external: ["preact"],
    metafile: true,
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },

    plugins: [
      mdx({
        jsxImportSource: "preact",
        jsxRuntime: "automatic",
      }),
    ],
  });

  return pagesBuildResult;
}

export async function bundle_handlers(user_config: PranxConfig, mode: PranxBuildMode) {
  const handlers_entry_points = await getRoutesHandlersFiles(user_config);

  await esbuild.build({
    entryPoints: handlers_entry_points,
    bundle: true,
    outdir: ROUTE_HANDLER_OUTPUT_DIR,
    format: "esm",
    platform: "node",
    splitting: true,
    chunkNames: "_chunks/[name]-[hash]",
    jsxFactory: "h",
    jsxFragment: "Fragment",
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
      ".json": "json",
      ".css": "text",
    },
    sourcemap: mode !== "prod",
    minify: mode === "prod",
  });
}
