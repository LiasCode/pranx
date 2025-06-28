import { serve } from "@hono/node-server";
import { prext } from "@prext";

const server = await prext.init({
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
