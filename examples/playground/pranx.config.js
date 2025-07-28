import { tailwindPlugin } from "esbuild-plugin-tailwindcss";
import { resolve } from "node:path";
import { defineConfig } from "pranx";
import { mdx_plugin, sass_plugin } from "pranx/plugins";

export default defineConfig({
  esbuild: {
    plugins: [mdx_plugin(), sass_plugin(), tailwindPlugin()],
    alias: {
      "@ui": resolve(resolve(import.meta.dirname), "./src/components/ui/"),
      "@": resolve(resolve(import.meta.dirname), "./src/"),
    },
  },
});
