import * as swcHtml from "@swc/html";
import * as fs from "node:fs/promises";
import path from "node:path";
import { renderToStringAsync } from "preact-render-to-string";
import type { GetStaticPathsResult, GetStaticPropsResult, HydrationData } from "../types.js";
import type { PranxBuildMode } from "./build.js";
import { CLIENT_OUTPUT_DIR } from "./constants.js";
import type { PagesGroupByPath } from "./group_pages_bundle_by_path.js";

export async function generate_static_pages(
  routes_data: PagesGroupByPath,
  mode: PranxBuildMode = "dev"
) {
  const page_map: HydrationData["pageMap"] = {};

  for (const [route_path, value] of routes_data) {
    if (!value.page) continue;
    const public_page_file_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.page.file)}`;

    Object.assign(page_map, {
      [route_path]: {
        public_file: public_page_file_path,
        head: null,
      },
    });

    const metaFn = value.meta?.module.meta;

    let meta_content = "";

    if (metaFn !== undefined) {
      meta_content = await renderToStringAsync(await metaFn());
    }

    if (page_map[route_path]) {
      page_map[route_path].head = meta_content;
    }
  }

  for (const [route_path, value] of routes_data) {
    // skip path with no pages and with getServerSideProps
    if (!value.page || value.loader?.module.getServerSideProps) continue;
    const getStaticProps = value.loader?.module.getStaticProps;
    const getStaticPaths = value.loader?.module.getStaticPaths;

    const PageComponent = value.page.module.default;
    let getStaticPropsResult: GetStaticPropsResult | null = null;
    let getStaticPathsResult: GetStaticPathsResult | null = null;
    getStaticPathsResult;

    if (getStaticProps !== undefined) {
      getStaticPropsResult = await getStaticProps();
    }

    if (getStaticPaths !== undefined) {
      getStaticPathsResult = await getStaticPaths();
    }

    const page_content = await renderToStringAsync(
      <PageComponent {...getStaticPropsResult?.props} />
    );

    const public_page_file_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.page.file)}`;

    const it_have_css = value.css !== undefined;

    const public_css_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.css?.file || "")}`;

    if (it_have_css) {
      if (page_map[route_path] !== undefined) {
        page_map[route_path].head = `${page_map[route_path].head} 
          <link rel="stylesheet" href="${public_css_path}" />`;
      }
    }

    const output_html_file_path = path.join(CLIENT_OUTPUT_DIR, route_path, "index.html");

    const hydrationData: HydrationData = {
      pagePath: public_page_file_path,
      pageProps: { ...getStaticPropsResult?.props },
      pageMap: page_map,
    };

    const htmlContent = `
      <!doctype html>
      <html>
        <head>
          ${page_map[route_path]?.head || ""}
        </head>

        <body>${page_content}</body>

        <script type="importmap">
          ${JSON.stringify({
            imports: {
              "preact": "/vendor/preact.js",
              "preact/jsx-runtime": "/vendor/jsxRuntime.js",
              "preact/hooks": "/vendor/hooks.js",
              "preact/compat": "/vendor/compat.js",
              "preact/devtools": "/vendor/devtools.js",
            },
          })} 
        </script>

        <script id="__PRANX_DATA__" type="application/json">${JSON.stringify(hydrationData)}</script>

        <script id="__PRANX_HYDRATE_SCRIPT__" type="module" src="/hydrate.js"></script>
      </html>
    `;

    let finalHtmlContent = htmlContent;

    if (mode === "prod") {
      const html = await swcHtml.minify(htmlContent, {
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
    await fs.writeFile(output_html_file_path, finalHtmlContent);
  }
}
