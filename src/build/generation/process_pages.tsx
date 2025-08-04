import type { PranxConfig } from "../../config/pranx-config.js";
import type { PranxBuildMode } from "../build.js";
import type { bundle_pages } from "../pages/bundle.js";
import type { bundle_server } from "../server/bundle.js";
import { generate_pages_map } from "./generate_pages_map.js";
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

  const { page_map_internal, hydrationData } = await generate_pages_map(groupResult);

  return {
    groupResult,
    page_map_internal,
    hydrationData,
  };
}
