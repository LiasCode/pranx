import { META_TAG } from "@/server/components/meta";
import { SCRIPTS_TAG } from "@/server/components/scripts";
import { minifySync } from "@swc/html";
import { readFileSync } from "node:fs";

let critical_css = "";

export const generate_html_template = ({
  hydrate_data_as_string,
  page_prerendered,
  minify = false,
  css_links = [],
  critical_css_filepath = "",
}: {
  page_prerendered: string;
  hydrate_data_as_string: string;
  minify: boolean;
  css_links: string[];
  critical_css_filepath: string;
}) => {
  if (!critical_css) {
    critical_css = readFileSync(critical_css_filepath, { encoding: "utf8" });
  }

  const template = `
      <!DOCTYPE html>
      ${page_prerendered
        .replace(
          META_TAG,
          `<style>${critical_css}</style> 
          ${css_links.map((css_path) => `<link rel="stylesheet" href="${css_path}" />`).join("\n")}`
        )
        .replace(
          SCRIPTS_TAG,
          `<script>window.__PRANX_HYDRATE_DATA__=${hydrate_data_as_string}</script> 
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
    tagOmission: "keep-head-and-body",
  }).code;
};
