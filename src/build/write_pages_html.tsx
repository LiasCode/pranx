import * as swcHtml from "@swc/html";
import * as fs from "node:fs/promises";
import path from "node:path";
import type { HydrationData } from "../types.js";
import type { PranxBuildMode } from "./build.js";
import { CLIENT_OUTPUT_DIR } from "./constants.js";
import type { InternalPageMapResult } from "./generate_pages_map.js";

export const imports_map = JSON.stringify({
  imports: {
    "preact": "/vendor/preact.js",
    "preact/jsx-runtime": "/vendor/jsxRuntime.js",
    "preact/hooks": "/vendor/hooks.js",
    "preact/compat": "/vendor/compat.js",
    "preact/devtools": "/vendor/devtools.js",
    "preact-iso": "/vendor/router.js",
  },
});

export async function write_pages_html(
  pages_map: InternalPageMapResult,
  hydration_data: HydrationData,
  mode: PranxBuildMode = "dev"
) {
  for (const [route_path, value] of Object.entries(pages_map)) {
    if (value.have_server_side_props) continue;

    const output_html_file_path = path.join(CLIENT_OUTPUT_DIR, route_path, "index.html");

    const html_content = html_page_template(value, hydration_data);

    let final_html_content = html_content;

    if (mode === "prod") {
      const html = await swcHtml.minify(html_content, {
        collapseBooleanAttributes: true,
        removeComments: true,
        collapseWhitespaces: "all",
        minifyJs: true,
        minifyCss: true,
        minifyJson: true,
        forceSetHtml5Doctype: true,
        sortAttributes: true,
      });
      final_html_content = html.code;
    }
    await fs.writeFile(output_html_file_path, final_html_content);
  }
}

export const html_page_template = (
  page_value: InternalPageMapResult[1],
  hydration_data: HydrationData
) => {
  return `
    <!doctype html>
    <html>
      <head>
        ${page_value.meta}
      </head>

      <body>${page_value.page_rendered_result}</body>

      <script type="importmap">${imports_map}</script>

      <script id="__PRANX_DATA__" type="application/json">${JSON.stringify(hydration_data)}</script>

      <script id="__PRANX_HYDRATE_SCRIPT__" type="module" src="/hydrate.js"></script>
    </html>
  `;
};
