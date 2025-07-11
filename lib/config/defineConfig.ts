import path from "node:path";
import type { PranxConfig } from "./pranx-config.js";

export function defineConfig(config: Partial<PranxConfig>): PranxConfig {
  return {
    pages_dir: config.pages_dir || path.resolve(path.join(process.cwd(), "src", "pages")),
    public_dir: config.public_dir || path.resolve(path.join(process.cwd(), "public")),
    esbuild: config.esbuild || {},
  };
}
