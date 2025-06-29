import { serve } from "@hono/node-server";
import { pranx } from "pranx";

const server = await pranx.init({
  watch: true,
  mode: process.env.PRANX_MODE === "prod" ? "prod" : "dev",
});

serve(
  {
    fetch: server.fetch,
    port: Number(process.env.PORT) || 3030,
  },
  (info) => {
    console.log(`Server is running on port http://localhost:${info.port}`);
  }
);
