import type * as esbuild from "esbuild";
import * as fs from "node:fs/promises";
import * as sass from "sass";

export const sass_plugin = (): esbuild.Plugin => {
  return {
    name: "sass",
    setup(build) {
      build.onLoad({ filter: /\.(scss|sass)$/, namespace: "file" }, async (args) => {
        const contents = await fs.readFile(args.path, "utf8");

        const cssParsed = await sass.compileStringAsync(contents);

        return {
          contents: cssParsed.css,
          loader: "css",
        };
      });
    },
  };
};
