import type { Handler, Hono } from "hono";
import type { Component } from "preact";
import type { RouterComponent } from "../router/next-file-base-router";
import { attach_api_handler } from "./attach-api-handler";
import { attach_page } from "./attach-page";

export async function attach_endpoints(
  server: Hono,
  router_components: RouterComponent<Handler, () => Promise<Component>>[]
) {
  for (const p of router_components) {
    if (p.kind === "PAGE") {
      attach_page(p, server, router_components);
    } else if (p.kind === "API_HANDLER") {
      attach_api_handler(server, p);
    }
  }
}
