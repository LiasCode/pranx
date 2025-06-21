import { Hono, type Handler } from "hono";
import { compress } from "hono/compress";
import { appendTrailingSlash } from "hono/trailing-slash";
import path from "node:path";
import "preact/compat";
import type { Component } from "preact/compat";
import "preact/debug";
import "preact/hooks";
import "preact/jsx-runtime";
import { attach_endpoints } from "./hono/attach-endpoints";
import { NextFileRouter } from "./router/next-file-base-router";

export async function init(props?: { pages_root?: string }) {
  const calculated_root = props?.pages_root || path.join(process.cwd(), "pages");

  const prextFileRouter = new NextFileRouter<Handler, () => Promise<Component>>({
    root: calculated_root,
    name: "Prext File-Base Router",
  });

  const router_components_parsed = await prextFileRouter.make();

  const server = new Hono({ strict: true });

  server.use(appendTrailingSlash());
  server.use(compress());

  await attach_endpoints(server, router_components_parsed);

  return server;
}
