import { minify } from "@swc/html";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import path from "node:path";
import { renderToStringAsync } from "preact-render-to-string";
import type { PranxConfig } from "../config/pranx-config.js";
import type { GetStaticPathsResult, GetStaticPropsResult, HydrationData } from "../types.js";
import { getPageModule } from "../utils/resolve.js";
import type { PranxBuildMode } from "./build.js";
import type { bundle_pages } from "./bundle_pages.js";
import { PAGES_OUTPUT_DIR, VENDOR_BUNDLE_OUTPUT_PATH } from "./constants.js";

type ProcessPagesOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
  pages_bundle_result: Awaited<ReturnType<typeof bundle_pages>>;
};

export async function process_pages(options: ProcessPagesOptions) {
  const outputsPagesFiles = Object.keys(options.pages_bundle_result.metafile.outputs).filter((f) =>
    f.endsWith("page.js")
  );

  for (const pageFile of outputsPagesFiles) {
    const pageModule = await getPageModule(path.resolve(path.join(process.cwd(), pageFile)));
    const PageComponent = pageModule.default;
    const MetaComponent = pageModule.meta;
    const getStaticProps = pageModule.getStaticProps;
    const getStaticPaths = pageModule.getStaticPaths;
    const getServerSideProps = pageModule.getServerSideProps;

    let getStaticPropsResult: GetStaticPropsResult | null = null;

    if (getStaticProps !== undefined) {
      getStaticPropsResult = await getStaticProps();
    }

    let getStaticPathsResult: GetStaticPathsResult | null = null;
    getStaticPathsResult;

    if (getStaticPaths !== undefined) {
      getStaticPathsResult = await getStaticPaths();
    }

    let getServerSidePropsResult: any | null = null;
    getServerSidePropsResult;

    if (getServerSideProps !== undefined) {
      getServerSidePropsResult = await getServerSideProps();
    }

    const pageFilePath = pageFile.split("/").filter((_, i, arr) => {
      if (i === 0 || i === 1) return false;
      if (i === arr.length - 1) return false;
      return true;
    });

    const outputFileDir = path.join(PAGES_OUTPUT_DIR, ...pageFilePath);

    const outputHtmlFilePath = path.join(outputFileDir, "index.html");

    let meta_content = "";

    if (MetaComponent !== undefined) {
      const meta_return = await MetaComponent();
      meta_content = await renderToStringAsync(meta_return);
    }

    const page_content = await renderToStringAsync(
      <PageComponent {...getStaticPropsResult?.props} />
    );

    // Script that hydrate script will load to render the page again
    const publicPageScriptPath = pageFile.replace(".pranx/pages/", "/");
    const publicCssPath = publicPageScriptPath.replace("page.js", "page.css");
    const existsCss = existsSync(path.join(PAGES_OUTPUT_DIR, publicCssPath));

    const hydrationData: HydrationData = {
      pagePath: publicPageScriptPath,
      pageProps: getStaticPropsResult?.props || {},
      pageMap: {},
    };

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
            ${JSON.stringify(hydrationData)}
        </script>
      
        <script type="importmap">
          ${JSON.stringify({
            imports: {
              "preact": `./${path.join(path.relative(path.dirname(outputHtmlFilePath), VENDOR_BUNDLE_OUTPUT_PATH), "preact.js")}`,
              "preact/jsx-runtime": `./${path.join(path.relative(path.dirname(outputHtmlFilePath), VENDOR_BUNDLE_OUTPUT_PATH), "jsxRuntime.js")}`,
              "preact/hooks": `./${path.join(path.relative(path.dirname(outputHtmlFilePath), VENDOR_BUNDLE_OUTPUT_PATH), "hooks.js")}`,
              "preact/compat": `./${path.join(path.relative(path.dirname(outputHtmlFilePath), VENDOR_BUNDLE_OUTPUT_PATH), "compat.js")}`,
              "preact/devtools": `./${path.join(path.relative(path.dirname(outputHtmlFilePath), VENDOR_BUNDLE_OUTPUT_PATH), "devtools.js")}`,
            },
          })}
        </script>
        <script id="PRANX_HYDRATE" type="module" src="/hydrate.js"></script>
      </html>
    `;

    let finalHtmlContent = htmlContent;

    if (options.mode === "prod") {
      const html = await minify(htmlContent, {
        collapseBooleanAttributes: true,
        removeComments: true,
        collapseWhitespaces: "all",
        minifyJs: true,
        minifyCss: true,
        minifyJson: true,
        forceSetHtml5Doctype: true,
        sortAttributes: true,
      });
      finalHtmlContent = html.code;
    }
    await fs.writeFile(outputHtmlFilePath, finalHtmlContent);
  }
}
