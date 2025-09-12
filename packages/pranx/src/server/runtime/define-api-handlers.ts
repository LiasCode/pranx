import { filePathToRoutingPath } from "@/build/filepath-to-routing-path";
import type { H3 } from "h3";
import type { PranxRouteModule, SERVER_MANIFEST } from "types/index";

export const define_api_handlers = async (server_manifest: SERVER_MANIFEST, app: H3) => {
  for (const route of server_manifest.api) {
    const {
      DELETE = undefined,
      GET = undefined,
      HEAD = undefined,
      PATCH = undefined,
      POST = undefined,
      PUT = undefined,
    } = (await import(route.absolute_module_path)) as PranxRouteModule;

    const url_for_routing_match = filePathToRoutingPath(route.path, false);

    if (GET) {
      app.on(
        "GET",
        url_for_routing_match,
        // @ts-expect-error
        GET
      );
    }
    if (POST) {
      app.on(
        "POST",
        url_for_routing_match,
        // @ts-expect-error
        POST
      );
    }
    if (HEAD) {
      app.on(
        "HEAD",
        url_for_routing_match,
        // @ts-expect-error
        HEAD
      );
    }
    if (DELETE) {
      app.on(
        "DELETE",
        url_for_routing_match,
        // @ts-expect-error
        DELETE
      );
    }
    if (PATCH) {
      app.on(
        "PATCH",
        url_for_routing_match,
        // @ts-expect-error
        PATCH
      );
    }
    if (PUT) {
      app.on(
        "PUT",
        url_for_routing_match,
        // @ts-expect-error
        PUT
      );
    }
  }
};
