import { META_TAG } from "@/client/Meta.js";
import type { HYDRATE_DATA } from "@/client/mount.js";
import { SCRIPTS_TAG } from "@/client/Scripts.js";
import { logger } from "@/utils/logger.js";
import { measureTime } from "@/utils/time-perf.js";
import { minifySync } from "@swc/html";
import fse from "fs-extra";
import kleur from "kleur";
import { join, resolve } from "pathe";
import { Fragment, h } from "preact";
import { renderToString } from "preact-render-to-string";
import type { PageModule, ServerEntryModule } from "../../types/index.js";
import { bundle_browser } from "../build/bundle/browser.js";
import { bundle_server } from "../build/bundle/server.js";
import {
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PRANX_DIR,
} from "../build/constants.js";

export async function build() {
  logger.log(kleur.bold().magenta("Pranx Build\n"));

  measureTime("build_measure_time");

  await fse.emptyDir(OUTPUT_PRANX_DIR);

  await bundle_server({
    optimize: true,
  });

  const browser_bundle_metafile = await bundle_browser({
    optimize: true,
  });

  let server_entry_module: ServerEntryModule | null = null;

  server_entry_module = (await import(
    join(OUTPUT_BUNDLE_SERVER_DIR, "entry-server.js")
  )) as ServerEntryModule;

  const hydrate_data: HYDRATE_DATA = {
    routes: [],
  };

  const pranx_bundle_replace_path = join(".pranx", "browser");

  for (const [file, _output] of Object.entries(browser_bundle_metafile.metafile.outputs)) {
    if (!file.endsWith("page.js")) continue;

    hydrate_data.routes.push({
      path: file.replace(pranx_bundle_replace_path, "").replace("page.js", "") || "/",
      module: file.replace(pranx_bundle_replace_path, ""),
      props: {},
      type: "ssg",
    });
  }

  await fse.writeFile(
    join(OUTPUT_BUNDLE_SERVER_DIR, "routes.manifest.json"),
    JSON.stringify(hydrate_data.routes, null, 2)
  );

  const hydrate_data_as_string = JSON.stringify(hydrate_data);

  for (const route of hydrate_data.routes) {
    const file_absolute = resolve(join(OUTPUT_BUNDLE_SERVER_DIR, "pages", route.module));
    const page_module = (await import(file_absolute)) as PageModule;

    const page_prerendered = renderToString(
      h(server_entry_module?.default || Fragment, {}, h(page_module.default, null, null))
    );

    const page_as_html = `<!DOCTYPE html>
      ${page_prerendered.replace(META_TAG, "").replace(
        SCRIPTS_TAG,
        `<script id="__PRANX_HYDRATE_DATA__" type="application/json">
          ${hydrate_data_as_string}
        </script>
        <script type="module" src="/_.._/entry-client.js"></script>`
      )}`;

    await fse.writeFile(
      join(OUTPUT_BUNDLE_BROWSER_DIR, route.path, "index.html"),
      minifySync(page_as_html, {
        collapseBooleanAttributes: true,
        collapseWhitespaces: "smart",
        normalizeAttributes: true,
        sortAttributes: true,
        removeRedundantAttributes: "smart",
        quotes: true,
        selfClosingVoidElements: false,
      }).code
    );
  }

  const build_measure_time = measureTime("build_measure_time");

  logger.log(kleur.bold().blue().underline("Routes"));
  for (const route of hydrate_data.routes) {
    const routesPath = route.path.split("/");
    routesPath.pop();
    logger.log(`- ${routesPath.join("/") || "/"}`);
  }

  console.log();
  logger.success(`Project builded in ${build_measure_time} ms\n`);
}
