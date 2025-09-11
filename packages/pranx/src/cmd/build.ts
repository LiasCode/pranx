import { filePathToRoutingPath } from "@/build/filepath-to-routing-path.js";
import { get_user_pranx_config, load_user_pranx_config } from "@/config/index.js";
import { logger } from "@/utils/logger.js";
import { measureTime } from "@/utils/time-perf.js";
import fse from "fs-extra";
import kleur from "kleur";
import { join } from "pathe";
import { Fragment, h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type {
  GetStaticPropsResult,
  HYDRATE_DATA,
  PageModule,
  SERVER_MANIFEST,
  ServerEntryModule,
  ServerManifestRoute,
} from "../../types/index.js";
import { bundle_browser } from "../build/bundle/browser.js";
import { bundle_server } from "../build/bundle/server.js";
import {
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PRANX_DIR,
  SERVER_MANIFEST_OUTPUT_PATH,
  SITE_MANIFEST_OUTPUT_PATH,
} from "../build/constants.js";
import { generate_html_template } from "../build/generate_html_template.js";

export async function build() {
  logger.log(kleur.bold().magenta("Pranx Build\n"));

  measureTime("build_measure_time");

  // Loading User Config
  await load_user_pranx_config();

  // Clean output
  await fse.emptyDir(OUTPUT_PRANX_DIR);

  // Bundling
  const optimize_output = true;

  const server_bundle_result = await bundle_server({
    optimize: optimize_output,
    user_config: await get_user_pranx_config(),
  });

  const browser_bundle_result = await bundle_browser({
    optimize: optimize_output,
    user_config: await get_user_pranx_config(),
  });

  // Manifests
  const server_site_manifest: SERVER_MANIFEST = {
    entry_server: join(OUTPUT_BUNDLE_SERVER_DIR, "entry-server.js"),
    routes: [],
    api: [],
  };

  let server_entry_module: ServerEntryModule | null = null;

  server_entry_module = (await import(server_site_manifest.entry_server)) as ServerEntryModule;

  // Generating api routes Manifest
  const pranx_server_base_path = join(".pranx", "server");

  for (const [file, _output] of Object.entries(server_bundle_result.metafile.outputs)) {
    if (!file.endsWith("route.js")) continue;

    const pages_relative_path = file.replace(pranx_server_base_path, "");

    const final_path_normalized = `/${pages_relative_path
      .replace("route.js", "")
      .replace("pages", "")
      .split("/")
      .filter(Boolean)
      .join("/")}`;

    const module_path = join(OUTPUT_BUNDLE_SERVER_DIR, pages_relative_path);

    server_site_manifest.api.push({
      path: final_path_normalized,
      module: pages_relative_path,
      absolute_module_path: module_path,
    });
  }

  const pranx_browser_base_path = join(".pranx", "browser");

  type CSS_OUTPUT = {
    entry: string;
    [key: string]: string;
  };

  const css_output: CSS_OUTPUT = {
    entry: "",
  };

  // Calculating css files
  for (const [file, _output] of Object.entries(browser_bundle_result.metafile.outputs)) {
    if (!file.endsWith(".css")) continue;

    if (file.endsWith("entry-client.css")) {
      css_output.entry = file.replace(pranx_browser_base_path, "");
      continue;
    }

    const css_file_relative = file.replace(pranx_browser_base_path, "");

    const path_normalized = `/${css_file_relative
      .replace("page.css", "")
      .split("/")
      .filter(Boolean)
      .join("/")}`;

    css_output[path_normalized] = css_file_relative;
  }

  // Generating Manifest and generating static pages data
  for (const [file, _output] of Object.entries(browser_bundle_result.metafile.outputs)) {
    if (!file.endsWith("page.js")) continue;

    const pages_relative_path = file.replace(pranx_browser_base_path, "");

    const final_path_normalized = `/${pages_relative_path
      .replace("page.js", "")
      .split("/")
      .filter(Boolean)
      .join("/")}`;

    const module_path = join(OUTPUT_BUNDLE_SERVER_DIR, "pages", pages_relative_path);

    const {
      getServerSideProps = undefined,
      getStaticProps = undefined,
      getStaticPaths = undefined,
    } = (await import(module_path)) as PageModule;

    if (getServerSideProps && (getStaticProps || getStaticPaths)) {
      logger.error(`
        msg: "Only one can be present: getServerSideProps or getStaticProps/getStaticPaths"
        file: ${module_path}
        path: ${final_path_normalized}
      `);
      process.exit(1);
    }

    const isStatic = !getServerSideProps;
    const isUrlDynamic = final_path_normalized.includes("[");
    const dynamic_params = !isUrlDynamic
      ? []
      : final_path_normalized
          .split("/")
          .filter((i) => i.startsWith("[") && i.endsWith("]"))
          .map((i) => i.replace("[", "").replace("]", ""));

    if (isStatic && isUrlDynamic && !getStaticPaths) {
      logger.error(`
        msg: "getStaticPaths must be present on static pages with dynamic params"
        file: ${module_path}
        path: ${final_path_normalized}
      `);
      process.exit(1);
    }

    if (!isStatic && isUrlDynamic && !getServerSideProps) {
      logger.error(`
        msg: "getServerSideProps must be present on server pages with dynamic params"
        file: ${module_path}
        path: ${final_path_normalized}
      `);
      process.exit(1);
    }

    let statics_fn_result: GetStaticPropsResult<any> = {
      props: {},
      revalidate: -1,
    };

    if (isStatic && isUrlDynamic && getStaticPaths) {
      const static_paths_result = await getStaticPaths();
      const new_final_path = final_path_normalized;

      server_site_manifest.routes.push({
        path: final_path_normalized,
        module: pages_relative_path,
        props: statics_fn_result.props,
        rendering_kind: "static",
        revalidate: statics_fn_result.revalidate || -1,
        is_dynamic: isUrlDynamic,
        dynamic_params: dynamic_params,
        css: [css_output.entry, css_output[final_path_normalized] || ""].filter(Boolean),
        static_generated_routes: [],
        absolute_module_path: module_path,
      });

      for (const static_path of static_paths_result.paths) {
        const params: Record<string, string> = static_path.params || {};

        const replaced_path = new_final_path.replace(
          /\[([^\]]+)\]/g,
          (_, p1) => params[p1] || `[${p1}]`
        );

        if (replaced_path.includes("[")) {
          logger.error(`
            msg: "getStaticPaths did not return all the necessary params"
            file: ${module_path}
            path: ${final_path_normalized}
            params returned by getStaticPaths: ${JSON.stringify(static_path.params)}
          `);
          process.exit(1);
        }

        let statics_fn_result: GetStaticPropsResult<any> = {
          props: {},
          revalidate: -1,
        };

        if (getStaticProps) {
          statics_fn_result = await getStaticProps({
            params: static_path.params,
          });
        }

        server_site_manifest.routes.at(-1)?.static_generated_routes.push({
          path: replaced_path,
          props: statics_fn_result.props || {},
          revalidate: statics_fn_result.revalidate || -1,
        });
      }
      continue;
    }

    if (isStatic && !isUrlDynamic && getStaticProps) {
      statics_fn_result = await getStaticProps({
        params: {},
      });
    }

    server_site_manifest.routes.push({
      path: final_path_normalized,
      module: pages_relative_path,
      props: statics_fn_result.props,
      rendering_kind: isStatic ? "static" : "server-side",
      revalidate: statics_fn_result.revalidate || -1,
      static_generated_routes: [],
      is_dynamic: isUrlDynamic,
      dynamic_params: dynamic_params,
      css: [css_output.entry, css_output[final_path_normalized] || ""].filter(Boolean) as string[],
      absolute_module_path: module_path,
    });
  }

  const hydrate_data: HYDRATE_DATA = {
    routes: server_site_manifest.routes.map((r) => {
      return {
        module: r.module,
        path: r.path,
        props: r.props,
        rendering_kind: r.rendering_kind,
        css: r.css,
        is_dynamic: r.is_dynamic,
        path_parsed_for_routing: filePathToRoutingPath(r.path, false),
        static_generated_routes: r.static_generated_routes.map((r) => {
          return {
            path: r.path,
            props: r.props,
          };
        }),
      };
    }),
  };

  const hydrate_data_as_string = JSON.stringify(hydrate_data);

  // Writing static files and prerender pages
  for (const route of server_site_manifest.routes) {
    if (route.rendering_kind === "server-side") continue;

    const page_module = (await import(route.absolute_module_path)) as PageModule;

    if (route.static_generated_routes.length > 0) {
      for (const static_route of route.static_generated_routes) {
        const page_prerendered = await renderToStringAsync(
          h(
            server_entry_module?.default || Fragment,
            {},
            h(page_module.default, static_route.props, null)
          )
        );

        const html = generate_html_template({
          page_prerendered,
          hydrate_data_as_string,
          minify: optimize_output,
          css: route.css,
        });

        const output_html_path = join(OUTPUT_BUNDLE_BROWSER_DIR, static_route.path, "index.html");

        await fse.ensureDir(join(OUTPUT_BUNDLE_BROWSER_DIR, static_route.path));

        await fse.writeFile(output_html_path, html);
      }
      continue;
    }

    const page_prerendered = await renderToStringAsync(
      h(server_entry_module?.default || Fragment, {}, h(page_module.default, route.props, null))
    );

    const html = generate_html_template({
      page_prerendered,
      hydrate_data_as_string,
      minify: true,
      css: route.css,
    });

    const output_html_path = join(OUTPUT_BUNDLE_BROWSER_DIR, route.path, "index.html");

    await fse.ensureDir(join(OUTPUT_BUNDLE_BROWSER_DIR, route.path));

    await fse.writeFile(output_html_path, html);
  }

  await fse.writeFile(SERVER_MANIFEST_OUTPUT_PATH, JSON.stringify(server_site_manifest));
  await fse.writeFile(SITE_MANIFEST_OUTPUT_PATH, JSON.stringify(hydrate_data));

  const BUILD_TIME = measureTime("build_measure_time");

  printRoutesTreeForUser(server_site_manifest.routes);

  logger.success(`Project builded in ${BUILD_TIME} ms\n`);
}

export function printRoutesTreeForUser(input_routes: ServerManifestRoute[]) {
  // Loggin Routes
  logger.log(kleur.bold().blue().underline("Routes"));

  function buildTree(routes: ServerManifestRoute[]) {
    const tree: any = {};
    for (const route of routes) {
      const parts = route.path === "/" ? [] : route.path.split("/").filter(Boolean);
      let node = tree;
      for (const part of parts) {
        node.children = node.children || {};
        node.children[part] = node.children[part] || {};
        node = node.children[part];
      }
      node.route = route;
    }
    return tree;
  }

  function printTree(node: any, prefix = "", isLast = true) {
    if (node.route) {
      const icon = node.route.rendering_kind === "static" ? "●" : kleur.yellow("λ");
      let extra = "";
      if (
        node.route.rendering_kind === "static" &&
        node.route.static_generated_routes &&
        node.route.static_generated_routes.length > 0
      ) {
        extra = ` (${kleur.cyan(`${node.route.static_generated_routes.length}`)})`;
      }
      logger.log(
        `${prefix}${isLast ? "└-" : "├-"} ${icon} ${kleur.white(node.route.path)}${extra}`
      );
    }
    if (node.children) {
      const keys = Object.keys(node.children);
      keys.forEach((key, idx) => {
        printTree(node.children[key], prefix + (node.route ? "|  " : ""), idx === keys.length - 1);
      });
    }
  }

  const tree = buildTree(input_routes);

  logger.log(".");
  printTree(tree, "", true);

  logger.log(`\n${kleur.yellow("λ")} Server-side Page`);
  logger.log("● Static Page");
  logger.log(`${kleur.cyan("(#)")} Count of Static Generated Routes\n`);
}
