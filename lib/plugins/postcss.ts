import type * as esbuild from "esbuild";
import { AcceptedPlugin } from "postcss";

export const postcss_plugin = (options: AcceptedPlugin[]): esbuild.Plugin => {
  return {
    name: "postcss",
    setup: function (build) {
      build.onResolve({ filter: /.\.(css)$/, namespace: "file" }, async (args) => {
        // const css = await readFile(sourceFullPath);

        // const result = await postcss(options.plugins).process(css, {
        //   from: sourceFullPath,
        //   to: tmpFilePath,
        // });

        // await writeFile(tmpFilePath, result.css);

        return {
          // path: tmpFilePath,
          // watchFiles: [sourceFullPath],
        };
      });
    },
  };
};
