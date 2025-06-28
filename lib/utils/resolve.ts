import * as fs from "node:fs/promises";
import path from "node:path";
import type { PranxConfig } from "../config/pranx-config";
import { Logger } from "../logger";
import type { PranxPageModule } from "../types";

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
