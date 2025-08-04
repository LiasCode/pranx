import chokidar from "chokidar";
import kleur from "kleur";
import path from "node:path";
import { Logger } from "../src/logger/index";
import { SOURCE_DIR } from "./shared/constants";
import { build_dev, build_start } from "./watch/build-dev";

Logger.success("Starting watch mode for development build");

const watcher = chokidar.watch(SOURCE_DIR, {
  ignoreInitial: true,
  persistent: true,
});

// Watcher start
watcher.on("ready", async () => {
  build_start();
});

// Files Changes
watcher.on("change", async (file) => {
  console.log(kleur.bold().yellow(`[change]: ${path.relative(process.cwd(), file)}`));
  build_dev();
});
