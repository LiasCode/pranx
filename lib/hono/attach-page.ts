import type { Handler, Hono } from "hono";
import { type Component, Fragment, h } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import type { HIERARCHY_COMPONENTS_KIND, RouterComponent } from "../router/next-file-base-router";
import { pathToHonoPath } from "./pathToHonoPath";

export function attach_page(
  component: RouterComponent<Handler, () => Promise<Component>>,
  server: Hono,
  router_components: RouterComponent<Handler, () => Promise<Component>>[]
) {
  const pagePathGroupComponents: Record<
    HIERARCHY_COMPONENTS_KIND,
    RouterComponent<Handler, () => Promise<Component>> | null
  > = {
    API_HANDLER: null,
    ERROR_BOUNDARY: null,
    LAYOUT: null,
    NOT_FOUND: null,
    PAGE: null,
    LOADING: null,
  };

  for (const cr of router_components) {
    if (cr.path === component.path) {
      if (cr.kind === "PAGE") {
        pagePathGroupComponents.PAGE = cr;
      }
      if (cr.kind === "LAYOUT") {
        pagePathGroupComponents.LAYOUT = cr;
      }
      if (cr.kind === "ERROR_BOUNDARY") {
        pagePathGroupComponents.ERROR_BOUNDARY = cr;
      }
      if (cr.kind === "LOADING") {
        pagePathGroupComponents.LOADING = cr;
      }
      if (cr.kind === "LOADING") {
        pagePathGroupComponents.LOADING = cr;
      }
    }
  }

  // console.dir(router_components, {
  //   depth: Number.POSITIVE_INFINITY,
  //   compact: false,
  // });

  let pageString = "";

  const ssrPage = async () => {
    const Page = pagePathGroupComponents.PAGE?.exports.default;

    if (!Page) {
      throw new Error(
        `Page component not found for path: ${component.path}. File: ${component.relative_file_path}`
      );
    }

    const PageValue = await Page();

    const Layout = pagePathGroupComponents.LAYOUT?.exports.default ?? Fragment;

    // const Loading = pagePathGroupComponents.LOADING?.exports.default ?? Fragment;

    // const ErrorBoundary = pagePathGroupComponents.ERROR_BOUNDARY?.exports.default ?? Fragment;

    // const NotFound = pagePathGroupComponents.NOT_FOUND?.exports.default ?? Fragment;

    pageString = await renderToStringAsync(h(Layout, {}, PageValue));
  };

  server.get(pathToHonoPath(component.path), async (c) => {
    try {
      if (component.exports.config?.static === true) {
        if (pageString === "") {
          await ssrPage();
        }
        return c.html(pageString);
      }
      await ssrPage();
      return c.html(pageString);
    } catch (error) {
      console.error(error);
      return c.html("[SSR - ERROR]", 500);
    }
  });
}
