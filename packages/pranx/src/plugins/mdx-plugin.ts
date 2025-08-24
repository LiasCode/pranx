import mdx_plugin from "@mdx-js/esbuild";
import type { Plugin } from "esbuild";

export const mdx_pranx_plugin = (): Plugin =>
  mdx_plugin({
    jsx: false,
    jsxRuntime: "automatic",
    jsxImportSource: "preact",
  });
