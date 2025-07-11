import { defineConfig, plugins } from "pranx";

export default defineConfig({
  esbuild: {
    plugins: [plugins.mdx_plugin(), plugins.sass_plugin()],
  },
});
