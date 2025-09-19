import { SERVER_MANIFEST_OUTPUT_PATH } from "@/build/constants";
import { logger } from "@/log/logger";
import { define_api_handlers } from "@/server/runtime/define-api-handlers";
import { defineServeStaticHandler } from "@/server/runtime/define-serve-static";
import { define_ssr_handlers } from "@/server/runtime/define-ssr-handlers";
import { measureTime } from "@/utils/time-perf";
import fse from "fs-extra";
import { H3, serve } from "h3";
import kleur from "kleur";
import type { SERVER_MANIFEST } from "types/index";

export async function start() {
  measureTime("pranx-start");

  logger.log(kleur.bold().magenta("Pranx Start"));

  const server_manifest = (await fse.readJSON(SERVER_MANIFEST_OUTPUT_PATH)) as SERVER_MANIFEST;

  const PORT = Number(process.env.PORT) || 3030;

  const app = new H3();

  await define_ssr_handlers(server_manifest, app);

  await define_api_handlers(server_manifest, app);

  app.on("GET", "**", (event) => defineServeStaticHandler(event));

  const server_instance = serve(app, { port: PORT });

  await server_instance.ready();

  logger.success(`Start in ${measureTime("pranx-start")} ms`);
}
