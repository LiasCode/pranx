import kleur from "kleur";
import type { ServerManifestRoute } from "types";
import { logger } from "./logger";

type LogRouteKind = "static" | "static-dynamic" | "server-side";

const ICONS = {
  server: () => kleur.yellow("λ"),
  static: () => kleur.white("○"),
  staticDyn: () => kleur.white("●"),
  folder: () => kleur.white("┬"),
};

const getKindIcon = (kind: LogRouteKind) =>
  kind === "server-side" ? ICONS.server() : kind === "static" ? ICONS.static() : ICONS.staticDyn();

export function log_routes_simple(input_routes: ServerManifestRoute[]) {
  logger.log(kleur.bold().blue().underline("Routes"));
  logger.log(".");

  let index = 0;
  for (const r of input_routes) {
    if (r.static_generated_routes.length > 0) {
      for (const sr of r.static_generated_routes) {
        logger.log(`├─ ${getKindIcon("static-dynamic")} ${sr.path}`);
      }
      index++;
      continue;
    }

    if (index === input_routes.length - 1) {
      logger.log(`└─ ${getKindIcon(r.rendering_kind)} ${r.path}`);
      continue;
    }
    logger.log(`├─ ${getKindIcon(r.rendering_kind)} ${r.path}`);

    // "└─" : "├─";
    //  "│ "

    index++;
  }

  logger.log("");
  logger.log(`${ICONS.server()} Server-side`);
  logger.log(`${ICONS.static()} Static`);
  logger.log(`${ICONS.staticDyn()} Static with dynamic params\n`);
}
