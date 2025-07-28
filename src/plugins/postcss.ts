import type * as esbuild from "esbuild";
import type { AcceptedPlugin } from "postcss";

export const postcss_plugin = (_options: AcceptedPlugin[]): esbuild.Plugin => {
  return {
    name: "postcss",
    setup: (build) => {
      build.onResolve({ filter: /.\.(css)$/, namespace: "file" }, async (_args) => {
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
