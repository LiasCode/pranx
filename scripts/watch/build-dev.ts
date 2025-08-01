import * as esbuild from "esbuild";
import kleur from "kleur";
import { exec } from "node:child_process";
import { Logger } from "../../src/logger";
import { measureTime } from "../../src/utils/time-perf";
import { build_config_dev } from "../shared/config";
import { SOURCE_DIR } from "../shared/constants";
import { prepare_output_dir } from "../shared/prepare_output_dir";

export const build_dev = async () => {
  Logger.info("Rebuilding...");
  measureTime("build_dev");
  await prepare_output_dir();
  await bundle();
  generate_types();
  console.log(`Rebuilded in ${measureTime("build_dev")} ms`);
};

export const build_start = async () => {
  await prepare_output_dir();
  await bundle();
  generate_types();
  console.log(`Watching path ${kleur.bold().underline(SOURCE_DIR)}`);
};

const generate_types = () => {
  measureTime("generate_types");
  exec("tsc");
  console.log(`Generate types in ${measureTime("generate_types")} ms`);
};

const ctx = await esbuild.context(build_config_dev);

const bundle = async () => {
  measureTime("bundle");
  await ctx.rebuild();
  console.log(`Bundle in ${measureTime("bundle")} ms`);
};
