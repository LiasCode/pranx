import { serve } from "@hono/node-server";
import { prext } from "@prext";

const server = await prext.init();

serve(
  {
    fetch: server.fetch,
    port: 3030,
  },
  (info) => {
    console.log(`Server is running on port http://localhost:${info.port}`);
  }
);
