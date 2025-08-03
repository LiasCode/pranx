import sassPlugin from "esbuild-plugin-sass";
import { tailwindPlugin } from "esbuild-plugin-tailwindcss";
import { resolve } from "node:path";
import { defineConfig } from "pranx";
import { mdx_plugin } from "pranx/plugins";

export default defineConfig({
  esbuild: {
    plugins: [tailwindPlugin(), sassPlugin(), mdx_plugin()],
    alias: {
      "@ui": resolve(resolve(import.meta.dirname), "./src/components/ui/"),
      "@": resolve(resolve(import.meta.dirname), "./src/"),
    },
  },
});
