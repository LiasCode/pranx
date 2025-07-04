import * as fse from "fs-extra";
import type { PranxConfig } from "../config/pranx-config.js";
import { bundle_handlers } from "./bundle_handlers.js";
import { bundle_hydrate_script } from "./bundle_hydrate_script.js";
import { bundle_pages } from "./bundle_pages.js";
import { bundle_vendors } from "./bundle_vendors.js";
import { PAGES_OUTPUT_DIR, PRANX_OUTPUT_DIR, ROUTE_HANDLER_OUTPUT_DIR } from "./constants.js";
import { process_pages } from "./process_pages.js";

export type PranxBuildMode = "dev" | "prod";

export async function build(user_config: PranxConfig, mode: PranxBuildMode = "prod") {
  // Clean .pranx folder and prepare
  await fse.emptyDir(PRANX_OUTPUT_DIR);
  await fse.emptyDir(PAGES_OUTPUT_DIR);
  await fse.emptyDir(ROUTE_HANDLER_OUTPUT_DIR);

  // Bundle Hydrate Script
  await bundle_hydrate_script({
    user_config,
    mode,
  });

  // Bundle vendors
  await bundle_vendors({
    user_config,
    mode,
  });

  // Bundle user Handlers
  await bundle_handlers({
    user_config,
    mode,
  });

  // Bundle pages
  const pages_bundle_result = await bundle_pages({
    user_config,
    mode,
  });

  // Process and generate public files
  await process_pages({
    mode,
    pages_bundle_result,
    user_config,
  });
}
