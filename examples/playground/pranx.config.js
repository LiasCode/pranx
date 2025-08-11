import mdx_plugin from "@mdx-js/esbuild";
import sassPlugin from "esbuild-plugin-sass";
import { tailwindPlugin } from "esbuild-plugin-tailwindcss";
import { defineConfig } from "pranx";

export default defineConfig({
  pages_dir: "src/pages",
  public_dir: "public",
  esbuild: {
    plugins: [
      mdx_plugin({
        jsxImportSource: "preact",
        jsxRuntime: "automatic",
      }),
      sassPlugin(),
      tailwindPlugin(),
    ],
  },
});
