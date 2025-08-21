import { bundle_dev } from "@/build/bundle_dev.js";
import { OUTPUT_BUNDLE_BROWSER_DIR } from "@/build/constants.js";
import { logger } from "@/utils/logger.js";
import consola from "consola";
import { getRandomPort } from "get-port-please";
import { H3, serve, serveStatic } from "h3";
import kleur from "kleur";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const app = new H3();

app.use("**", (event) => {
  return serveStatic(event, {
    indexNames: ["/index.html"],

    getContents: async (id) => {
      const buffer = await readFile(join(OUTPUT_BUNDLE_BROWSER_DIR, id));
      return new Uint8Array(buffer);
    },

    getMeta: async (id) => {
      const stats = await stat(join(OUTPUT_BUNDLE_BROWSER_DIR, id)).catch(() => {});

      if (stats?.isFile()) {
        return {
          size: stats.size,
          mtime: stats.mtimeMs,
        };
      }

      return undefined;
    },
  });
});

export async function dev() {
  logger.log(kleur.bold().magenta("Pranx Dev"));

  await bundle_dev();

  const PORT = await getRandomPort();

  serve(app, { port: PORT });

  consola.success(`server listen on http://localhost:${PORT}`);
}
