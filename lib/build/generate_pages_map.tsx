import path from "node:path";
import { renderToString, renderToStringAsync } from "preact-render-to-string";
import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPropsResult,
  HydrationData,
} from "../types.js";
import { CLIENT_OUTPUT_DIR } from "./constants.js";
import type { PagesGroupByPath } from "./group_pages_bundle_by_path.js";

export type InternalPageMapResult = Record<
  string,
  {
    entry_file: string;
    meta: string;
    isStatic: boolean;
    have_server_side_props: boolean;
    page_rendered_result: string;
    getStaticPropsResult: GetStaticPropsResult | null;
    getServerSidePropsFn: GetServerSideProps | null;
    getStaticPropsFn: GetStaticProps | null;
    renderFn: (props: Record<string, any>) => string;
  }
>;

export async function generate_pages_map(routes_data: PagesGroupByPath) {
  const page_map_internal: InternalPageMapResult = {};
  const hydrationData: HydrationData = { pages_map: {} };

  for (const [route_path, value] of routes_data) {
    if (!value.page) continue;

    const public_entry_page_file_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.page.file)}`;

    page_map_internal[route_path] = {
      entry_file: public_entry_page_file_path,
      meta: "",
      have_server_side_props: false,
      isStatic: true,
      getServerSidePropsFn: null,
      getStaticPropsResult: null,
      page_rendered_result: "",
      getStaticPropsFn: null,
      renderFn: (_props) => "",
    };

    // Head Metadata
    if (value.meta) {
      const meta_loader_fn = value.meta.module.meta;

      let meta_content = "";

      if (meta_loader_fn !== undefined) {
        const meta_loader_result = await meta_loader_fn();
        meta_content = await renderToStringAsync(meta_loader_result);
      }

      page_map_internal[route_path].meta = meta_content;
    }

    // CSS
    if (value.css) {
      const public_css_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.css?.file || "")}`;

      page_map_internal[route_path].meta = page_map_internal[route_path].meta.concat(
        `<link rel="stylesheet" href="${public_css_path}" />`
      );
    }

    // Page
    const PageComponent = value.page.module.default;

    page_map_internal[route_path].renderFn = (props: Record<string, any>) =>
      renderToString(<PageComponent {...props} />);

    const loader = value.loader?.module || {};
    let page_rendered_as_html = "";

    // Its plugs props via server on every request
    if (loader.getServerSideProps !== undefined) {
      page_map_internal[route_path].isStatic = false;
      page_map_internal[route_path].have_server_side_props = true;

      page_map_internal[route_path].getServerSidePropsFn = loader.getServerSideProps;
    }
    // Its static
    if (loader.getStaticProps !== undefined) {
      page_map_internal[route_path].isStatic = true;
      page_map_internal[route_path].have_server_side_props = false;

      page_map_internal[route_path].getStaticPropsFn = loader.getStaticProps;

      page_map_internal[route_path].getStaticPropsResult = await loader.getStaticProps();

      const pageProps = { ...page_map_internal[route_path].getStaticPropsResult?.props };

      page_rendered_as_html = await renderToStringAsync(<PageComponent {...pageProps} />);

      page_map_internal[route_path].page_rendered_result = page_rendered_as_html;
    }

    hydrationData.pages_map[route_path] = {
      entry_file: page_map_internal[route_path].entry_file,
      have_server_side_props: page_map_internal[route_path].have_server_side_props,
      isStatic: page_map_internal[route_path].isStatic,
      meta: page_map_internal[route_path].meta,
      props: page_map_internal[route_path].getStaticPropsResult?.props || {},
    };
  }

  return { page_map_internal, hydrationData };
}
