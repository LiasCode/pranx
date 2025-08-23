import { remove_top_level_functions } from "@/utils/remove_top_level_funtions.js";
import type { Plugin } from "esbuild";
import fse from "fs-extra";
import { basename } from "pathe";

export const strip_server_only_from_pages_plugin = (ids: string[]): Plugin => {
  return {
    name: "pranx-remove-server-only",
    setup(build) {
      build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
        if (!["page.js", "page.jsx", "page.ts", "page.tsx"].includes(basename(args.path))) {
          return {};
        }

        const code = await fse.readFile(args.path, "utf-8");

        const code_parsed = remove_top_level_functions(code, ids);

        return {
          contents: code_parsed,
          loader: "tsx",
        };
      });
    },
  };
};
