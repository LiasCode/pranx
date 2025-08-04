import chokidar from "chokidar";
import type { BuildOptions, BuildResult } from "esbuild";
import kleur from "kleur";
import path from "node:path";
import type { PranxConfig } from "../config/pranx-config.js";
import { watch_bundle_hydrate } from "./hydrate/watch.js";
import { watch_bundle_pages } from "./pages/watch.js";
import { watch_bundle_server } from "./server/watch.js";
import { watch_bundle_vendors } from "./vendors/watch.js";

export type PranxBuildMode = "dev" | "prod";

export type ResultBundle = {
  server: BuildResult<
    BuildOptions & {
      metafile: true;
    }
  >;
  pages: BuildResult<
    BuildOptions & {
      metafile: true;
    }
  >;
  vendors: {
    preact: BuildResult<BuildOptions>;
    router: BuildResult<BuildOptions>;
  };
  hydrate: BuildResult<BuildOptions>;
};

export type OnRebuildCb = (result: ResultBundle) => Promise<void>;

export async function watch_build(user_config: PranxConfig, onRebuild: OnRebuildCb) {
  const pages_watcher = chokidar.watch(path.join(process.cwd(), "src"));

  const ctx_hydrate = await watch_bundle_hydrate({
    user_config,
    mode: "dev",
  });

  const ctx_vendors = await watch_bundle_vendors({
    user_config,
    mode: "dev",
  });

  const ctx_server = await watch_bundle_server({
    user_config,
    mode: "dev",
  });

  const ctx_pages = await watch_bundle_pages({
    user_config,
    mode: "dev",
  });

  const rebuild_cb = async () => {
    const hydrate_result = await ctx_hydrate.rebuild();
    const vendors_preact_result = await ctx_vendors.preact.rebuild();
    const vendors_router_result = await ctx_vendors.router.rebuild();
    const server_result = await ctx_server.rebuild();
    const pages_result = await ctx_pages.rebuild();

    await onRebuild({
      hydrate: hydrate_result,
      pages: pages_result,
      server: server_result,
      vendors: {
        preact: vendors_preact_result,
        router: vendors_router_result,
      },
    });
  };

  pages_watcher.on("change", async (file: string) => {
    console.log(`change: ${kleur.bold().yellow(path.relative(process.cwd(), file))} `);
    await rebuild_cb();
  });

  await rebuild_cb();
}
