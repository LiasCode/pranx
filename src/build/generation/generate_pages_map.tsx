import path from "node:path";
import { renderToString } from "preact-render-to-string";
import { Logger } from "../../logger/index.js";
import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPropsResult,
  HydrationData,
} from "../../types.js";
import { CLIENT_OUTPUT_DIR } from "../constants.js";
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

    const current_page_data: InternalPageMapResult[1] = {
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
        meta_content = renderToString(meta_loader_result);
      }

      current_page_data.meta = meta_content;
    }

    // CSS
    if (value.css) {
      const public_css_path = `/${path.relative(CLIENT_OUTPUT_DIR, value.css?.file || "")}`;

      current_page_data.meta = current_page_data.meta.concat(
        `<link rel="stylesheet" href="${public_css_path}" />`
      );
    }

    // Page
    const PageComponent = value.page.module.default;

    const renderFn = (props: Record<string, any>) => renderToString(<PageComponent {...props} />);

    current_page_data.renderFn = renderFn;

    const loader = value.loader?.module || {};
    let page_rendered_as_html = "";

    if (loader.getServerSideProps !== undefined && loader.getStaticProps !== undefined) {
      Logger.error(`Route ${route_path} only can have a getServerSideProps or a getStaticProps`);
    }

    // Its plugs props via server on every request
    if (loader.getServerSideProps !== undefined) {
      current_page_data.isStatic = false;
      current_page_data.have_server_side_props = true;

      current_page_data.getServerSidePropsFn = loader.getServerSideProps;
    }
    // Its static
    let static_props: GetStaticPropsResult = { props: {} };

    if (current_page_data.isStatic === true) {
      current_page_data.have_server_side_props = false;

      if (loader.getStaticProps) {
        current_page_data.getStaticPropsFn = loader.getStaticProps;
        static_props = await loader.getStaticProps();
      }

      current_page_data.getStaticPropsResult = static_props;

      page_rendered_as_html = renderFn(static_props.props);

      current_page_data.page_rendered_result = page_rendered_as_html;
    }

    hydrationData.pages_map[route_path] = {
      entry_file: current_page_data.entry_file,
      have_server_side_props: current_page_data.have_server_side_props,
      isStatic: current_page_data.isStatic,
      meta: current_page_data.meta,
      props: static_props.props,
    };

    page_map_internal[route_path] = { ...current_page_data };
  }

  return { page_map_internal, hydrationData };
}
