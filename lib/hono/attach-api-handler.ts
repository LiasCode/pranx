import type { Handler, Hono } from "hono";
import type { Component } from "preact";
import type { RouterComponent } from "../router/next-file-base-router";
import { pathToHonoPath } from "./pathToHonoPath";

export function attach_api_handler(
  server: Hono,
  route_component: RouterComponent<Handler, () => Promise<Component>>
) {
  server.get(pathToHonoPath(route_component.path), async (c, next) => {
    if (route_component.exports.methods?.GET !== undefined) {
      return route_component.exports.methods.GET(c, next);
    }
    return c.json(
      `Path: ${route_component.path} does not have a GET exported method. File: ${route_component.relative_file_path}`
    );
  });

  server.post(pathToHonoPath(route_component.path), async (c, next) => {
    if (route_component.exports.methods?.POST !== undefined) {
      return route_component.exports.methods.POST(c, next);
    }
    return c.json(
      `Path: ${route_component.path} does not have a POST exported method. File: ${route_component.relative_file_path}`
    );
  });

  server.put(pathToHonoPath(route_component.path), async (c, next) => {
    if (route_component.exports.methods?.PUT !== undefined) {
      return route_component.exports.methods.PUT(c, next);
    }
    return c.json(
      `Path: ${route_component.path} does not have a PUT exported method. File: ${route_component.relative_file_path}`
    );
  });

  server.delete(pathToHonoPath(route_component.path), async (c, next) => {
    if (route_component.exports.methods?.DELETE !== undefined) {
      return route_component.exports.methods.DELETE(c, next);
    }
    return c.json(
      `Path: ${route_component.path} does not have a delete exported method. File: ${route_component.relative_file_path}`
    );
  });

  server.patch(pathToHonoPath(route_component.path), async (c, next) => {
    if (route_component.exports.methods?.PATCH !== undefined) {
      return route_component.exports.methods.PATCH(c, next);
    }
    return c.json(
      `Path: ${route_component.path} does not have a patch exported method. File: ${route_component.relative_file_path}`
    );
  });
}
