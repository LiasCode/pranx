import type { Handler } from "hono";
import * as fs from "node:fs/promises";
import path from "node:path";
import { ROUTE_HANDLER_OUTPUT_DIR } from "../build.js";
import type { PranxConfig } from "../config/pranx-config.js";
import { Logger } from "../logger/index.js";
import type { PranxPageModule, RouterComponent } from "../types.js";

export async function getPageFiles(user_config: PranxConfig) {
  const pages_src_files = await fs.readdir(user_config.pages_dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  });

  const pages_files = pages_src_files.filter((f) => {
    if (!f.isFile()) return false;

    if (!["page.js", "page.ts", "page.jsx", "page.tsx"].includes(f.name)) {
      return false;
    }

    return true;
  });

  const entry_points = pages_files.map((f) => path.join(f.parentPath, f.name));

  return entry_points;
}

export async function getRoutesHandlersFiles(user_config: PranxConfig) {
  const route_handler_src_files = await fs.readdir(user_config.pages_dir, {
    recursive: true,
    encoding: "utf8",
    withFileTypes: true,
  });

  const route_files = route_handler_src_files.filter((f) => {
    if (!f.isFile()) return false;

    if (!["route.js", "route.ts", "route.jsx", "route.tsx"].includes(f.name)) {
      return false;
    }

    return true;
  });

  const entry_points = route_files.map((f) => path.join(f.parentPath, f.name));

  return entry_points;
}

export async function getPageModule(modulePath: string): Promise<PranxPageModule> {
  try {
    return await import(`file://${modulePath}`);
  } catch (e) {
    if (e instanceof Error) {
      Logger.error(`Failed to load page module from ${modulePath}: ${e.message}`);
    }
    throw e;
  }
}

export async function getPageComponent(modulePath: string): Promise<PranxPageModule["default"]> {
  try {
    return (await import(`file://${modulePath}`)).default;
  } catch (e) {
    if (e instanceof Error) {
      Logger.error(`Failed to load page component from ${modulePath}: ${e.message}`);
    }
    throw e;
  }
}

export async function group_api_handlers() {
  const files = await getRoutesHandlersFiles({
    pages_dir: ROUTE_HANDLER_OUTPUT_DIR,
    public_dir: "",
  });
  const handlers: RouterComponent<Handler>[] = [];

  for (const f of files) {
    const module = (await import(f)) as RouterComponent<Handler>["exports"]["methods"];
    if (!module) {
      throw new Error(`[group_api_handlers] - ERROR IMPORTING ${f}`);
    }
    handlers.push({
      file_path: f.replace(ROUTE_HANDLER_OUTPUT_DIR, "").replace("route.js", ""),
      exports: {
        methods: { ...module },
      },
    });
  }

  return handlers;
}
