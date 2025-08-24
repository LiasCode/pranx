import { tailwindPlugin } from "esbuild-plugin-tailwindcss";

export const tailwindcss_plugin = (options: Parameters<typeof tailwindPlugin>["0"] = {}) =>
  tailwindPlugin({
    cssModules: {
      enabled: true,
    },
    ...options,
  });
