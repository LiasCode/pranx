import kleur from "kleur";
import type { ServerManifestRoute } from "types";
import { logger } from "./logger";

export function log_routes_tree(input_routes: ServerManifestRoute[]) {
  // Loggin Routes
  logger.log(kleur.bold().blue().underline("Routes"));

  function buildTree(routes: ServerManifestRoute[]) {
    const tree: any = {};
    for (const route of routes) {
      const parts = route.path === "/" ? [] : route.path.split("/").filter(Boolean);
      let node = tree;
      for (const part of parts) {
        node.children = node.children || {};
        node.children[part] = node.children[part] || {};
        node = node.children[part];
      }
      node.route = route;
    }
    return tree;
  }

  function printTree(node: any, prefix = "", isLast = true) {
    if (node.route) {
      const icon = node.route.rendering_kind === "static" ? "●" : kleur.yellow("λ");
      let extra = "";
      if (
        node.route.rendering_kind === "static" &&
        node.route.static_generated_routes &&
        node.route.static_generated_routes.length > 0
      ) {
        extra = ` (${kleur.cyan(`${node.route.static_generated_routes.length}`)})`;
      }
      logger.log(
        `${prefix}${isLast ? "└-" : "├-"} ${icon} ${kleur.white(node.route.path)}${extra}`
      );
    }
    if (node.children) {
      const keys = Object.keys(node.children);
      keys.forEach((key, idx) => {
        printTree(node.children[key], prefix + (node.route ? "|  " : ""), idx === keys.length - 1);
      });
    }
  }

  const tree = buildTree(input_routes);

  logger.log(".");
  printTree(tree, "", true);

  logger.log(`\n${kleur.yellow("λ")} Server-side Page`);
  logger.log("● Static Page");
  logger.log(`${kleur.cyan("(#)")} Count of Static Generated Routes\n`);
}
