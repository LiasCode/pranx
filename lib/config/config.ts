import { existsSync } from "node:fs";
import path from "node:path";
import { Logger } from "../logger";
import type { defineConfig } from "./defineConfig";
import type { PrextConfig } from "./prext-config";

const PREXT_CONFIG_FILE_NAME = "prext.config.js";

export async function load_user_config(config_file_path?: string): Promise<PrextConfig | null> {
  try {
    const file_path = config_file_path ?? path.resolve(path.join(process.cwd(), PREXT_CONFIG_FILE_NAME));

    const file_src = (await import(file_path)) as { default: ReturnType<typeof defineConfig> };

    const Config = file_src.default;

    if (!existsSync(Config.pages_dir)) {
      throw new Error("[Config.pages_dir] does not exists");
    }

    if (!existsSync(Config.public_dir)) {
      throw new Error("[Config.public_dir] does not exists");
    }

    return Config;
  } catch (error) {
    if (!(error instanceof Error)) return null;

    Logger.error(error.message);

    return null;
  }
}
