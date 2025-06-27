import path from "node:path";
import type { PrextConfig } from "./prext-config";

export function defineConfig(config: Partial<PrextConfig>): PrextConfig {
  return {
    pages_dir: config.pages_dir || path.resolve(path.join(process.cwd(), "src", "pages")),
    public_dir: config.public_dir || path.resolve(path.join(process.cwd(), "public")),
    esbuild: {},
  };
}
