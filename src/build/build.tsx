import kleur from "kleur";
import type { PranxConfig } from "../config/pranx-config.js";
import { measureTime } from "../utils/time-perf.js";
import { FLAGS } from "./constants.js";
import { bundle_hydrate } from "./hydrate/bundle.js";
import { bundle_pages } from "./pages/bundle.js";
import { bundle_server } from "./server/bundle.js";
import { bundle_vendors } from "./vendors/bundle.js";

export type PranxBuildMode = "dev" | "prod";

export async function build(user_config: PranxConfig, mode: PranxBuildMode = "prod") {
  // Bundle hydrate script
  measureTime("hydrate-bundle");
  const hydrate_bundle_result = await bundle_hydrate({
    user_config,
    mode,
  });
  const hydrateBundleTime = measureTime("hydrate-bundle");

  // Bundle vendors
  measureTime("vendors-bundle");
  const vendors_bundle_result = await bundle_vendors({
    user_config,
    mode,
  });
  const vendorsBundleTime = measureTime("vendors-bundle");

  // Bundle user server-side files
  measureTime("server-bundle");
  const server_bundle_result = await bundle_server({
    user_config,
    mode,
  });
  const serverBundleTime = measureTime("server-bundle");

  // Bundle pages
  measureTime("pages-bundle");
  const pages_bundle_result = await bundle_pages({
    user_config,
    mode,
  });
  const pagesBundleTime = measureTime("pages-bundle");

  if (FLAGS.SHOW_TIMES) {
    console.log(kleur.bold().blue("* Hydrate bundle time:"), hydrateBundleTime, "ms");
    console.log(kleur.bold().blue("* Vendors bundle time:"), vendorsBundleTime, "ms");
    console.log(kleur.bold().blue("* Server bundle time:"), serverBundleTime, "ms");
    console.log(kleur.bold().blue("* Pages bundle time:"), pagesBundleTime, "ms");
  }

  return {
    server: server_bundle_result,
    pages: pages_bundle_result,
    vendors: vendors_bundle_result,
    hydrate: hydrate_bundle_result,
  };
}
