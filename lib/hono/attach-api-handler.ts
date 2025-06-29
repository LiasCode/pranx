import type { Handler, Hono } from "hono";
import type { RouterComponent } from "../types.js";
import { filePathToRoutingPath } from "../utils/filePathToRoutingPath.js";

export async function attach_api_handler(server: Hono, route_component: RouterComponent<Handler>) {
  const path_resolved = filePathToRoutingPath(route_component.file_path);

  let path_resolved_without_slash: string | string[] = path_resolved.split("");
  path_resolved_without_slash.pop();
  path_resolved_without_slash = path_resolved_without_slash.join("");

  // GET
  const get_handler: Handler = async (c, next) => {
    if (route_component.exports.methods?.GET !== undefined) {
      return route_component.exports.methods.GET(c, next);
    }
    console.error(`Path: ${route_component.file_path} does not have a GET exported method.`);
    return c.notFound();
  };
  server.get(path_resolved_without_slash, get_handler);
  server.get(path_resolved, get_handler);

  // POST
  const post_handler: Handler = async (c, next) => {
    if (route_component.exports.methods?.POST !== undefined) {
      return route_component.exports.methods.POST(c, next);
    }
    console.error(`Path: ${route_component.file_path} does not have a POST exported method.`);
    return c.notFound();
  };
  server.post(path_resolved_without_slash, post_handler);
  server.post(path_resolved, post_handler);

  // PUT
  const put_handler: Handler = async (c, next) => {
    if (route_component.exports.methods?.PUT !== undefined) {
      return route_component.exports.methods.PUT(c, next);
    }
    console.error(`Path: ${route_component.file_path} does not have a PUT exported method.`);
    return c.notFound();
  };
  server.put(path_resolved_without_slash, put_handler);
  server.put(path_resolved, put_handler);

  // DELETE
  const delete_handler: Handler = async (c, next) => {
    if (route_component.exports.methods?.DELETE !== undefined) {
      return route_component.exports.methods.DELETE(c, next);
    }
    console.error(`Path: ${route_component.file_path} does not have a DELETE exported method.`);
    return c.notFound();
  };
  server.delete(path_resolved_without_slash, delete_handler);
  server.delete(path_resolved, delete_handler);

  // PATCH
  const patch_handler: Handler = async (c, next) => {
    if (route_component.exports.methods?.PATCH !== undefined) {
      return route_component.exports.methods.PATCH(c, next);
    }
    console.error(`Path: ${route_component.file_path} does not have a PATCH exported method.`);
    return c.notFound();
  };
  server.patch(path_resolved_without_slash, patch_handler);
  server.patch(path_resolved, patch_handler);
}
