import { Hono, type Handler } from "hono";
import { compress } from "hono/compress";
import { serveStatic } from "hono/serve-static";
import { appendTrailingSlash } from "hono/trailing-slash";
import * as fs from "node:fs/promises";
import path from "node:path";
import type { Component } from "preact/compat";
import { attach_endpoints } from "./hono/attach-endpoints";
import { NextFileRouter } from "./router/next-file-base-router";

export async function init(props?: { pages_root?: string; public_root?: string }) {
  const calculated_pages_root = props?.pages_root || path.join(process.cwd(), "pages");
  const calculated_public_root = props?.pages_root || path.join(process.cwd(), "public");

  const prextFileRouter = new NextFileRouter<Handler, () => Promise<Component>>({
    root: calculated_pages_root,
    name: "Prext File-Base Router",
  });

  const router_components_parsed = await prextFileRouter.make();

  const server = new Hono({ strict: true });

  server.use(appendTrailingSlash());
  server.use(compress());

  await attach_endpoints(server, router_components_parsed);

  server.get(
    "*",
    serveStatic({
      root: calculated_public_root,
      getContent(path) {
        return fs.readFile(path, "utf-8");
      },
    })
  );

  return server;
}
