import { OUTPUT_BUNDLE_SERVER_DIR, SITE_MANIFEST_OUTPUT_PATH } from "@/build/constants";
import { filePathToRoutingPath } from "@/build/filepath-to-routing-path";
import { generate_html_template } from "@/build/generate_html_template";
import { logger } from "@/utils/logger";
import fse from "fs-extra";
import { defineHandler, type H3, html } from "h3";
import { extname, join, resolve } from "pathe";
import { Fragment, h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type { HYDRATE_DATA, PageModule, SERVER_MANIFEST, ServerEntryModule } from "types/index";
import { defineServeStaticHandler } from "./define-serve-static";

export const define_ssr_handlers = async (server_manifest: SERVER_MANIFEST, app: H3) => {
  for (const route of server_manifest.routes) {
    if (route.rendering_kind !== "server-side") continue;

    let server_entry_module: ServerEntryModule | null = null;
    server_entry_module = (await import(server_manifest.entry_server)) as ServerEntryModule;

    const file_absolute = resolve(join(OUTPUT_BUNDLE_SERVER_DIR, "pages", route.module));
    const { default: page, getServerSideProps } = (await import(file_absolute)) as PageModule;

    const hydrate_data = (await fse.readJSON(SITE_MANIFEST_OUTPUT_PATH)) as HYDRATE_DATA;
    const url_for_routing_match = filePathToRoutingPath(route.path, false);

    app.on(
      "GET",
      url_for_routing_match,
      defineHandler(async (event) => {
        // For files that match with dynamic routes
        if (extname(event.url.pathname.split("/").at(-1) || "")) {
          return defineServeStaticHandler(event);
        }

        let props_to_return = {};

        if (getServerSideProps) {
          props_to_return = await getServerSideProps({
            event,
          });
        }

        event.res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");

        if (event.url.searchParams.get("props") === "only") {
          return {
            props: props_to_return,
          };
        }

        const target_route_index = hydrate_data.routes.findIndex((r) => r.path === route.path);

        if (target_route_index === -1 || !hydrate_data.routes[target_route_index]) {
          logger.error(`Route not found in hydrate data: ${route.path}`);
          event.res.status = 500;
          return html(event, "Internal Server Error");
        }

        hydrate_data.routes[target_route_index].props = props_to_return;

        const page_prerendered = await renderToStringAsync(
          h(server_entry_module?.default || Fragment, {}, h(page, props_to_return, null))
        );

        const html_string = generate_html_template({
          page_prerendered,
          hydrate_data_as_string: JSON.stringify(hydrate_data),
          minify: true,
          css: route.css,
        });

        return html(event, html_string);
      })
    );
  }
};
