import type { Handler, Hono } from "hono";
import type { InternalPageMapResult } from "../build/generate_pages_map.js";
import { html_page_template } from "../build/write_pages_html.js";
import type { HydrationData } from "../types.js";
import { filePathToRoutingPath } from "../utils/filePathToRoutingPath.js";

export async function attach_page_handler(
  server: Hono,
  file_path: string,
  page_data: InternalPageMapResult[1],
  hydratation_data: HydrationData
) {
  const path_resolved = filePathToRoutingPath(file_path);

  let path_resolved_without_slash: string | string[] = path_resolved.split("");
  path_resolved_without_slash.pop();
  path_resolved_without_slash = path_resolved_without_slash.join("");

  const get_handler: Handler = async (c) => {
    try {
      const page_props = (await page_data.getServerSidePropsFn?.(c)) || {};

      page_data.page_rendered_result = page_data.renderFn(page_props);

      const h = JSON.parse(JSON.stringify(hydratation_data)) as HydrationData;

      if (h.pages_map[file_path]) {
        h.pages_map[file_path].props = page_props;
      }

      const html = html_page_template(page_data, h);

      return c.html(html);
    } catch (error) {
      return c.notFound();
    }
  };
  server.get(path_resolved_without_slash, get_handler);
  server.get(path_resolved, get_handler);

  const post_props_handler: Handler = async (c) => {
    try {
      const page_props = (await page_data.getServerSidePropsFn?.(c)) || {};
      return c.json(page_props);
    } catch (error) {
      return c.notFound();
    }
  };
  server.post(path_resolved_without_slash, post_props_handler);
  server.post(path_resolved, post_props_handler);
}
