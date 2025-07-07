import * as fse from "fs-extra";
import type { PranxConfig } from "../config/pranx-config.js";
import { bundle_hydrate_script } from "./bundle_hydrate_script.js";
import { bundle_pages } from "./bundle_pages.js";
import { bundle_server } from "./bundle_server.js";
import { bundle_vendors } from "./bundle_vendors.js";
import { CLIENT_OUTPUT_DIR, PRANX_OUTPUT_DIR, SERVER_OUTPUT_DIR } from "./constants.js";

export type PranxBuildMode = "dev" | "prod";

export async function build(user_config: PranxConfig, mode: PranxBuildMode = "prod") {
  // Clean and prepare .pranx folder
  await fse.emptyDir(PRANX_OUTPUT_DIR);
  await fse.emptyDir(CLIENT_OUTPUT_DIR);
  await fse.emptyDir(SERVER_OUTPUT_DIR);

  // Bundle hydrate script
  const hydrate_bundle_result = await bundle_hydrate_script({
    user_config,
    mode,
  });

  // Bundle vendors
  const vendors_bundle_result = await bundle_vendors({
    user_config,
    mode,
  });

  // Bundle user server-side files
  const server_bundle_result = await bundle_server({
    user_config,
    mode,
  });

  // Bundle pages
  const pages_bundle_result = await bundle_pages({
    user_config,
    mode,
  });

  return {
    server: server_bundle_result,
    pages: pages_bundle_result,
    vendors: vendors_bundle_result,
    hydrate: hydrate_bundle_result,
  };
}
