import * as esbuild from "esbuild";
import * as fs from "node:fs/promises";
import path from "node:path";
import { h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type { PrextConfig } from "./config/prext-config";
import { Logger } from "./logger";
import type { PrextPageModule } from "./types";

export const PREXT_OUTPUT_DIR = path.resolve(path.join(process.cwd(), ".prext"));
export const PAGES_OUTPUT_DIR = path.resolve(path.join(PREXT_OUTPUT_DIR, "pages"));
export const ROUTE_HANDLER_OUTPUT_DIR = path.resolve(path.join(PREXT_OUTPUT_DIR, "server", "handlers"));

export async function build(user_config: PrextConfig) {
  // 1- Clean .prext folder
  await fs.rm(PREXT_OUTPUT_DIR, { force: true, recursive: true });

  // 2- Find pages entry files
  const pages_entry_points = await getPageFiles(user_config);

  const originHydrateScriptPath = path.resolve(path.join(import.meta.dirname, "client", "hydrate.js"));

  const outputHydrateScriptPath = path.join(user_config.pages_dir, "hydrate.js");

  await fs.copyFile(originHydrateScriptPath, outputHydrateScriptPath);

  // 3- Bundle Vendor preact lib
  const vendorSrcDir = path.join(import.meta.dirname, "client", "vendor");
  const vendorBundleOutputPath = path.join(PAGES_OUTPUT_DIR, "vendor");

  const vendorEntries = (await fs.readdir(vendorSrcDir))
    .filter((f) => f.endsWith("js"))
    .map((f) => path.join(vendorSrcDir, f));

  await esbuild.build({
    entryPoints: vendorEntries,
    bundle: false,
    outdir: vendorBundleOutputPath,
    format: "esm",
    platform: "browser",
    minify: false,
    sourcemap: false,
  });

  // 4- Bundle user pages
  const pagesBuildResult = await esbuild.build({
    entryPoints: [...pages_entry_points, outputHydrateScriptPath],
    bundle: true,
    outdir: PAGES_OUTPUT_DIR,
    format: "esm",
    splitting: true,
    platform: "node",
    chunkNames: "_chunks/[name]-[hash]",
    assetNames: "_assets/[name]-[hash]",

    jsxFactory: "h",
    jsxFragment: "Fragment",
    loader: { ".js": "jsx", ".jsx": "jsx", ".ts": "tsx", ".tsx": "tsx", ".css": "css", ".json": "json" },

    minify: false,
    sourcemap: false,

    external: ["preact", "preact-render-to-string"], // Assume preact is shared or already handled by hydration script
    metafile: true,
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },
  });

  await fs.rm(outputHydrateScriptPath, { force: true });

  const outputsPagesFiles = Object.keys(pagesBuildResult.metafile.outputs).filter((f) => f.endsWith("page.js"));

  const outputDir = PAGES_OUTPUT_DIR;

  for (const pageFile of outputsPagesFiles) {
    const pageModule = await getPageModule(path.resolve(path.join(process.cwd(), pageFile)));
    const PageComponent = pageModule.default;
    const getStaticProps = pageModule.getStaticProps;
    // const getServerSideProps = pageModule.getServerSideProps;
    // const getStaticPaths = pageModule.getStaticPaths;

    let getStaticPropsResult = null;

    if (getStaticProps !== undefined) {
      getStaticPropsResult = await getStaticProps();
    }

    const pageFilePath = pageFile.split("/");

    pageFilePath.shift();
    pageFilePath.shift();
    pageFilePath.pop();

    const outputFileDir = path.join(outputDir, ...pageFilePath);

    const outputFile = path.join(outputFileDir, "index.html");

    const element = await renderToStringAsync(h(PageComponent, { ...getStaticPropsResult?.props }));

    // Script that hydrate script will load to render the page again
    const publicPageScriptPath = pageFile.replace(".prext/pages/", "/");
    const publicCssPath = publicPageScriptPath.replace("page.js", "page.css");

    // Embed props and component map for client-side hydration (__PREXT_DATA__)
    const htmlContent = `
    <!doctype html> 
      <html>
        <head>
          <title>Prext App</title>
          <link
            rel="icon"
            type="image/svg+xml"
            href="/favicon.svg"
          />
          <link rel="stylesheet" href="${publicCssPath}">
        </head>

        <body>
         ${element}
        </body>

        <script
          id="__PREXT_DATA__"
          type="application/json"
          >
            ${JSON.stringify({
              pagePath: publicPageScriptPath,
              pageProps: getStaticPropsResult?.props || {},
              pageMap: {},
            })}
        </script>
      
        <script type="importmap">
          {
            "imports": {
              "preact": "./${path.join(path.relative(path.dirname(outputFile), vendorBundleOutputPath), "preact.js")}",
              "preact/jsx-runtime": "./${path.join(path.relative(path.dirname(outputFile), vendorBundleOutputPath), "jsxRuntime.js")}",
              "preact/hooks": "./${path.join(path.relative(path.dirname(outputFile), vendorBundleOutputPath), "hooks.js")}",
              "preact/compat": "./${path.join(path.relative(path.dirname(outputFile), vendorBundleOutputPath), "compat.js")}"
            }
          }
        </script>
        <script id="PREXT_HYDRATE" type="module" src="/hydrate.js"></script>
      </html>
    `;

    await fs.writeFile(outputFile, htmlContent);
  }

  // 5- Find Route Handlers entry files
  const handlers_entry_points = await getRoutesHandlersFiles(user_config);

  // 6- Bundle user Handlers
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
    loader: { ".js": "jsx", ".jsx": "jsx", ".ts": "tsx", ".tsx": "tsx", ".json": "json" },
    sourcemap: false,
    minify: false,
  });
}

export async function getPageFiles(user_config: PrextConfig) {
  const pages_src_files = await fs.readdir(user_config.pages_dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  });

  const pages_files = pages_src_files.filter((f) => {
    if (!f.isFile()) return false;

    if (!["page.js", "page.ts", "page.jsx", "page.tsx"].includes(f.name)) {
      return false;
    }

    return true;
  });

  const entry_points = pages_files.map((f) => path.join(f.parentPath, f.name));

  return entry_points;
}

export async function getRoutesHandlersFiles(user_config: PrextConfig) {
  const route_handler_src_files = await fs.readdir(user_config.pages_dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  });

  const route_files = route_handler_src_files.filter((f) => {
    if (!f.isFile()) return false;

    if (!["route.js", "route.ts", "route.jsx", "route.tsx"].includes(f.name)) {
      return false;
    }

    return true;
  });

  const entry_points = route_files.map((f) => path.join(f.parentPath, f.name));

  return entry_points;
}

export async function getPageModule(modulePath: string): Promise<PrextPageModule> {
  try {
    return await import(`file://${modulePath}`);
  } catch (e) {
    if (e instanceof Error) {
      Logger.error(`Failed to load page module from ${modulePath}: ${e.message}`);
    }
    throw e;
  }
}

export async function getPageComponent(modulePath: string): Promise<PrextPageModule["default"]> {
  try {
    return (await import(`file://${modulePath}`)).default;
  } catch (e) {
    if (e instanceof Error) {
      Logger.error(`Failed to load page component from ${modulePath}: ${e.message}`);
    }
    throw e;
  }
}
