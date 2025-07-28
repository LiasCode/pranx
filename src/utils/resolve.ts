import { glob } from "glob";
import type { Handler } from "hono";
import { SERVER_OUTPUT_DIR } from "../build/constants.js";
import type { PranxConfig } from "../config/pranx-config.js";
import { Logger } from "../logger/index.js";
import type { RouterComponent } from "../types.js";

export async function getPageFiles(user_config: PranxConfig) {
  const entry_points = await glob("**/*page.{ts,js,jsx,tsx}", {
    cwd: user_config.pages_dir,
    absolute: true,
  });

  return entry_points;
}

export async function getMetaFiles(user_config: PranxConfig) {
  const entry_points = await glob("**/*meta.{ts,js,jsx,tsx}", {
    cwd: user_config.pages_dir,
    absolute: true,
  });

  return entry_points;
}

export async function getRoutesHandlersFiles(user_config: PranxConfig) {
  const entry_points = await glob("**/*route.{ts,js,jsx,tsx}", {
    cwd: user_config.pages_dir,
    absolute: true,
  });

  return entry_points;
}

export async function getLoadersFiles(user_config: PranxConfig) {
  const entry_points = await glob("**/*loader.{ts,js,jsx,tsx}", {
    cwd: user_config.pages_dir,
    absolute: true,
  });

  return entry_points;
}

export async function getModule<T>(modulePath: string): Promise<T> {
  try {
    return await import(`file://${modulePath}`);
  } catch (e) {
    if (e instanceof Error) {
      Logger.error(`Failed to load module from ${modulePath}: ${e.message}`);
    }
    throw e;
  }
}

export async function group_api_handlers() {
  const files = await getRoutesHandlersFiles({
    pages_dir: SERVER_OUTPUT_DIR,
    public_dir: "",
  });
  const handlers: RouterComponent<Handler>[] = [];

  for (const f of files) {
    const module = (await import(f)) as RouterComponent<Handler>["exports"]["methods"];
    if (!module) {
      throw new Error(`[group_api_handlers] - ERROR IMPORTING ${f}`);
    }
    handlers.push({
      file_path: f.replace(SERVER_OUTPUT_DIR, "").replace("route.js", ""),
      exports: {
        methods: { ...module },
      },
    });
  }

  return handlers;
}
