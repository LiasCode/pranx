import { OUTPUT_BUNDLE_BROWSER_DIR, PUBLIC_USER_DIR } from "@/build/constants.js";
import fse from "fs-extra";
import { type EventHandlerRequest, type H3Event, serveStatic } from "h3";
import { join } from "pathe";

export const defineServeStaticHandler = (event: H3Event<EventHandlerRequest>) =>
  serveStatic(event, {
    indexNames: ["/index.html"],

    getContents: async (id) => {
      const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
      const target_public_file = join(PUBLIC_USER_DIR, id);

      const existsTargetFile = await fse.exists(target_file);

      const buffer = await fse.readFile(existsTargetFile ? target_file : target_public_file);

      return new Uint8Array(buffer);
    },

    getMeta: async (id) => {
      const target_file = join(OUTPUT_BUNDLE_BROWSER_DIR, id);
      const target_public_file = join(PUBLIC_USER_DIR, id);

      const existsTargetFile = await fse.exists(target_file);

      const stats = await fse
        .stat(existsTargetFile ? target_file : target_public_file)
        .catch(() => {});

      if (stats?.isFile()) {
        return stats;
      }

      return undefined;
    },

    headers: {
      "Cache-Control": "public, max-age=2592000, immutable", // agresive caching
      "Expires": new Date(Date.now() + 2592000000).toUTCString(), // one month
    },
  });
