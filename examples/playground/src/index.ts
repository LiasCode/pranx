import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { pranx } from "pranx";

const app = new Hono();

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
