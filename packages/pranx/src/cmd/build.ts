import { META_TAG } from "@/client/Meta.js";
import { SCRIPTS_TAG } from "@/client/Scripts.js";
import { logger } from "@/utils/logger.js";
import { measureTime } from "@/utils/time-perf.js";
import { minifySync } from "@swc/html";
import fse from "fs-extra";
import kleur from "kleur";
import { join, resolve } from "pathe";
import { Fragment, h } from "preact";
import { renderToString } from "preact-render-to-string";
import type {
  GetStaticPropsResult,
  HYDRATE_DATA,
  PageModule,
  SERVER_MANIFEST,
  ServerEntryModule,
} from "../../types/index.js";
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

  const site_manifest: SERVER_MANIFEST = {
    entry_server: join(OUTPUT_BUNDLE_SERVER_DIR, "entry-server.js"),
    routes: [],
  };

  let server_entry_module: ServerEntryModule | null = null;

  server_entry_module = (await import(site_manifest.entry_server)) as ServerEntryModule;

  const pranx_bundle_replace_path = join(".pranx", "browser");

  for (const [file, _output] of Object.entries(browser_bundle_metafile.metafile.outputs)) {
    if (!file.endsWith("page.js")) continue;

    const pages_relative_path = file.replace(pranx_bundle_replace_path, "");

    const path_splitted = pages_relative_path.replace("page.js", "").split("/");
    path_splitted.pop();
    const final_path = path_splitted.join("/") || "/";

    const module_path = join(OUTPUT_BUNDLE_SERVER_DIR, "pages", pages_relative_path);
    const {
      // default: PageComponent,
      getServerSideProps,
      getStaticProps,
      getStaticPaths,
      // meta: metadata,
    } = (await import(module_path)) as PageModule;

    if (getServerSideProps && (getStaticProps || getStaticPaths)) {
      logger.error(`
msg: "Only one can be present: getServerSideProps or getStaticProps/getStaticPaths"
file: ${module_path}
path: ${final_path}`);
      process.exit(1);
    }

    const isStatic = !getServerSideProps;
    const isUrlDynamic = final_path.includes("[");
    const dynamic_params = !isUrlDynamic
      ? []
      : path_splitted
          .filter((i) => i.startsWith("[") && i.endsWith("]"))
          .map((i) => i.replace("[", "").replace("]", ""));

    if (isStatic && isUrlDynamic && !getStaticPaths) {
      logger.error(`
msg: "getStaticPaths must be present on static pages with dynamic params"
file: ${module_path}
path: ${final_path}`);
      process.exit(1);
    }

    if (!isStatic && isUrlDynamic && !getServerSideProps) {
      logger.error(`
msg: "getServerSideProps must be present on pages with dynamic params"
file: ${module_path}
path: ${final_path}`);
      process.exit(1);
    }

    let statics_fn_result: GetStaticPropsResult<any> = {
      props: {},
      revalidate: -1,
    };

    if (isStatic && getStaticProps) {
      statics_fn_result = await getStaticProps({
        fallback: false,
        paths: [],
      });
    }

    site_manifest.routes.push({
      path: final_path,
      module: pages_relative_path,
      props: statics_fn_result.props,
      rendering_kind: isStatic ? "static" : "server-side",
      revalidate: statics_fn_result.revalidate || -1,
      is_dynamic: isUrlDynamic,
      dynamic_params: dynamic_params,
    });
  }

  const hydrate_data: HYDRATE_DATA = {
    routes: site_manifest.routes.map((r) => {
      return {
        module: r.module,
        path: r.path,
        props: r.props,
        rendering_kind: r.rendering_kind,
      };
    }),
  };

  const hydrate_data_as_string = JSON.stringify(hydrate_data);

  for (const route of site_manifest.routes) {
    if (route.rendering_kind === "server-side") continue;

    const file_absolute = resolve(join(OUTPUT_BUNDLE_SERVER_DIR, "pages", route.module));
    const page_module = (await import(file_absolute)) as PageModule;

    const page_prerendered = renderToString(
      h(server_entry_module?.default || Fragment, {}, h(page_module.default, route.props, null))
    );

    const html = generate_html_template({
      page_prerendered,
      hydrate_data_as_string,
      minify: true,
    });

    const output_html_path = join(OUTPUT_BUNDLE_BROWSER_DIR, route.path, "index.html");

    await fse.writeFile(output_html_path, html);
  }

  await fse.writeFile(
    join(OUTPUT_BUNDLE_SERVER_DIR, "server.manifest.json"),
    JSON.stringify(site_manifest)
  );

  await fse.writeFile(
    join(OUTPUT_BUNDLE_BROWSER_DIR, "site.manifest.json"),
    JSON.stringify(hydrate_data)
  );

  logger.log(kleur.bold().blue().underline("Routes"));
  for (const route of site_manifest.routes) {
    logger.log(`- ${route.path}`);
  }

  console.log();
  logger.success(`Project builded in ${measureTime("build_measure_time")} ms\n`);
}

export const generate_html_template = ({
  hydrate_data_as_string,
  page_prerendered,
  minify = false,
}: {
  page_prerendered: string;
  hydrate_data_as_string: string;
  minify: boolean;
}) => {
  const template = `
      <!DOCTYPE html>
      ${page_prerendered.replace(META_TAG, "").replace(
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
