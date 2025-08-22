import { bundle_dev } from "@/build/bundle_dev.js";
import { OUTPUT_BUNDLE_BROWSER_DIR, PUBLIC_USER_DIR } from "@/build/constants.js";
import { logger } from "@/utils/logger.js";
import fse from "fs-extra";
import { checkPort, getRandomPort } from "get-port-please";
import { H3, serve, serveStatic } from "h3";
import kleur from "kleur";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

export async function dev() {
  logger.log(kleur.bold().magenta("Pranx Dev"));

  await bundle_dev();

  const DEFAULT_PORT = 3030;
  const isPortUsed = await checkPort(DEFAULT_PORT);

  const PORT = !isPortUsed ? await getRandomPort() : DEFAULT_PORT;

  const app = new H3();

  app.use("**", (event) => {
    return serveStatic(event, {
      indexNames: ["/index.html"],

      getContents: async (id) => {
        const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
        const target_public_file = join(PUBLIC_USER_DIR, id);

        const existsTargetFile = await fse.exists(target_file);

        const buffer = await readFile(existsTargetFile ? target_file : target_public_file);

        return new Uint8Array(buffer);
      },

      getMeta: async (id) => {
        const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
        const target_public_file = join(PUBLIC_USER_DIR, id);

        const existsTargetFile = await fse.exists(target_file);

        const stats = await stat(existsTargetFile ? target_file : target_public_file).catch(
          () => {}
        );

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

  serve(app, { port: PORT });
}
