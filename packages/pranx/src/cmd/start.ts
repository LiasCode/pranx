import {
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  PUBLIC_USER_DIR,
  SERVER_MANIFEST_OUTPUT_PATH,
  SITE_MANIFEST_OUTPUT_PATH,
} from "@/build/constants.js";
import { filePathToRoutingPath } from "@/build/filepath-to-routing-path.js";
import { generate_html_template } from "@/build/generate_html_template.js";
import { logger } from "@/utils/logger.js";
import { measureTime } from "@/utils/time-perf.js";
import fse from "fs-extra";
import { defineHandler, H3, html, serve, serveStatic } from "h3";
import kleur from "kleur";
import { readFile, stat } from "node:fs/promises";
import { join, resolve } from "pathe";
import { Fragment, h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type { HYDRATE_DATA, PageModule, SERVER_MANIFEST, ServerEntryModule } from "types/index.js";
import * as ufo from "ufo";

export async function start() {
  measureTime("pranx-start");

  logger.log(kleur.bold().magenta("Pranx Start"));

  const server_manifest = (await fse.readJSON(SERVER_MANIFEST_OUTPUT_PATH)) as SERVER_MANIFEST;

  const PORT = Number(process.env.PORT) || 3030;

  const app = new H3();

  for (const route of server_manifest.routes) {
    if (route.rendering_kind === "server-side") {
      let server_entry_module: ServerEntryModule | null = null;
      server_entry_module = (await import(server_manifest.entry_server)) as ServerEntryModule;

      const file_absolute = resolve(join(OUTPUT_BUNDLE_SERVER_DIR, "pages", route.module));
      const { default: page, getServerSideProps } = (await import(file_absolute)) as PageModule;

      const hydrate_data = (await fse.readJSON(SITE_MANIFEST_OUTPUT_PATH)) as HYDRATE_DATA;

      app.on(
        "GET",
        filePathToRoutingPath(route.path, false),
        defineHandler({
          middleware: [],
          meta: {},
          handler: async (event) => {
            const url_parsed = ufo.parseURL(event.req.url);
            const params = new URLSearchParams(url_parsed.search);
            const return_only_props = Boolean(params.get("props"));

            let props_to_return = {};

            if (getServerSideProps) {
              props_to_return = await getServerSideProps();
            }

            if (return_only_props) {
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

            event.res.headers.set("Content-Type", "text/html");

            return html(event, html_string);
          },
        })
      );
    }
  }

  app.on("GET", "**", (event) => {
    return serveStatic(event, {
      indexNames: ["/index.html"],

      getContents: async (id) => {
        const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
        const target_public_file = join(PUBLIC_USER_DIR, id);

        const existsTargetFile = await fse.exists(target_file);

        const buffer = await readFile(existsTargetFile ? target_file : target_public_file);

        return new Uint8Array(buffer);
      },

      getMeta: async (id) => {
        const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
        const target_public_file = join(PUBLIC_USER_DIR, id);

        const existsTargetFile = await fse.exists(target_file);

        const stats = await stat(existsTargetFile ? target_file : target_public_file).catch(
          () => {}
        );

        if (stats?.isFile()) {
          return stats;
        }

        return undefined;
      },
    });
  });

  const SERVER = serve(app, { port: PORT });

  await SERVER.ready();

  const START_TIME = measureTime("pranx-start");

  logger.success(`Start in ${START_TIME} ms`);
}
