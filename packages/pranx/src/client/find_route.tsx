import type { HydrateDataRoute } from "types/index.js";
import { exec_route_match } from "./exec-match.js";

export const find_route = (url: string) => {
  let current_route: HydrateDataRoute | null = null;

  for (const r of window.__PRANX_HYDRATE_DATA__.routes) {
    const exec_result = exec_route_match(url, r.path_parsed_for_routing);

    if (exec_result) {
      current_route = r;
      break;
    }
  }

  return current_route;
};
