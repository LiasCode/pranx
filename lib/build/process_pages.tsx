import type { PranxConfig } from "../config/pranx-config.js";
import type { PranxBuildMode } from "./build.js";
import type { bundle_pages } from "./bundle_pages.js";
import type { bundle_server } from "./bundle_server.js";
import { generate_static_pages } from "./generate_static_pages.js";
import { group_pages_bundle_by_path } from "./group_pages_bundle_by_path.js";

export type ProcessPagesOptions = {
  user_config: PranxConfig;
  mode: PranxBuildMode;
  pages_bundle_result: Awaited<ReturnType<typeof bundle_pages>>;
  server_bundle_result: Awaited<ReturnType<typeof bundle_server>>;
};

export async function process_pages(options: ProcessPagesOptions) {
  const groupResult = await group_pages_bundle_by_path({
    pages: options.pages_bundle_result,
    server: options.server_bundle_result,
  });

  await generate_static_pages(groupResult, options.mode);
}
