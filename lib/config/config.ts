import * as fse from "fs-extra";
import { existsSync } from "node:fs";
import path from "node:path";
import { Logger } from "../logger";
import type { defineConfig } from "./defineConfig";
import type { PranxConfig } from "./pranx-config";

const PRANX_CONFIG_FILE_NAME = "pranx.config.js";

export async function load_user_config(config_file_path?: string): Promise<PranxConfig | null> {
  try {
    const file_path =
      config_file_path ?? path.resolve(path.join(process.cwd(), PRANX_CONFIG_FILE_NAME));

    const file_src = (await import(file_path)) as {
      default: ReturnType<typeof defineConfig>;
    };

    const Config = file_src.default;

    // Ensure exists the necesary folders
    await fse.ensureDir(Config.pages_dir);
    await fse.ensureDir(Config.public_dir);

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
