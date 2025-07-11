import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as fs from "node:fs/promises";
import path from "node:path";
import { pranx } from "pranx";

const app = new Hono();

app.get("/favicon.svg", async (c) => {
  return c.body(await fs.readFile(path.join(process.cwd(), "public", "favicon.svg")));
});

await pranx.init({
  mode: process.env.NODE_ENV === "production" ? "prod" : "dev",
  server: app,
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3030,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
