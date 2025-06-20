import { Hono, type Handler } from "hono";
import { compress } from "hono/compress";
import { appendTrailingSlash } from "hono/trailing-slash";
import path from "node:path";
import { renderToStringAsync } from "preact-render-to-string";
import "preact/compat";
import "preact/debug";
import "preact/hooks";
import "preact/jsx-runtime";
import type { JSXInternal } from "preact/src/jsx";
import { NextFileRouter } from "./file-base-router/next-file-base-router";

export async function init(props?: { pages_root?: string }) {
  const calculated_root = props?.pages_root || path.join(process.cwd(), "pages");

  const prextFileRouter = new NextFileRouter<Handler, () => Promise<JSXInternal.Element>>({
    root: calculated_root,
    name: "Prext Router",
  });

  const makeRes = await prextFileRouter.make();

  // console.dir(makeRes, { depth: Number.POSITIVE_INFINITY, compact: false });

  const server = new Hono({ strict: true });

  server.use(appendTrailingSlash());
  server.use(compress());

  for (const p of makeRes) {
    if (p.kind === "PAGE") {
      server.get(p.path, async (c) => {
        if (p.exports.default !== undefined) {
          const html = await renderToStringAsync(await p.exports.default());
          return c.html(html);
        }
        return c.html(`Path: ${p.path} does not have a default exported method. File: ${p.relative_file_path}`);
      });
    }
    if (p.kind === "API_HANDLER") {
      server.get(p.path, async (c, next) => {
        if (p.exports.methods?.GET !== undefined) {
          return p.exports.methods.GET(c, next);
        }
        return c.json(`Path: ${p.path} does not have a GET exported method. File: ${p.relative_file_path}`);
      });
      server.post(p.path, async (c, next) => {
        if (p.exports.methods?.POST !== undefined) {
          return p.exports.methods.POST(c, next);
        }
        return c.json(`Path: ${p.path} does not have a POST exported method. File: ${p.relative_file_path}`);
      });
    }
  }

  return server;
}
