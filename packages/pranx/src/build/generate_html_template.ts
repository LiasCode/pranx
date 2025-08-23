import { META_TAG } from "@/client/Meta.js";
import { SCRIPTS_TAG } from "@/client/Scripts.js";
import { minifySync } from "@swc/html";

export const generate_html_template = ({
  hydrate_data_as_string,
  page_prerendered,
  minify = false,
  css = [],
}: {
  page_prerendered: string;
  hydrate_data_as_string: string;
  minify: boolean;
  css: string[];
}) => {
  const template = `
      <!DOCTYPE html>
      ${page_prerendered
        .replace(
          META_TAG,
          `${css.map((css_path) => `<link rel="stylesheet" href="${css_path}" />`).join("\n")}`
        )
        .replace(
          SCRIPTS_TAG,
          `
        <script>window.__PRANX_HYDRATE_DATA__=${hydrate_data_as_string}</script>
        <script type="module" src="/_.._/entry-client.js"></script>`
        )}`;

  if (!minify) return template;

  return minifySync(template, {
    collapseBooleanAttributes: true,
    collapseWhitespaces: "smart",
    normalizeAttributes: true,
    sortAttributes: true,
    removeRedundantAttributes: "smart",
    quotes: true,
    selfClosingVoidElements: false,
  }).code;
};
