import { tailwindPlugin } from "esbuild-plugin-tailwindcss";
import { defineConfig } from "pranx";
import { mdx_plugin, sass_plugin } from "pranx/plugins";

export default defineConfig({
  esbuild: {
    plugins: [mdx_plugin(), sass_plugin(), tailwindPlugin()],
  },
});
