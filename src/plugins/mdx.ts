import mdx, { type Options } from "@mdx-js/esbuild";
import type * as esbuild from "esbuild";

export const mdx_plugin = (options: Options): esbuild.Plugin => {
  return mdx({
    ...options,
    jsxImportSource: "preact",
    jsxRuntime: "automatic",
  });
};
