import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { pranx } from "pranx";

const app = await pranx.init({
  mode: process.env.NODE_ENV === "production" ? "prod" : "dev",
});

app.use(logger());

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3030,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
