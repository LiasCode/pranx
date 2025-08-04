import kleur from "kleur";
import { Logger } from "../../src/logger";
import { measureTime } from "../../src/utils/time-perf";
import { SOURCE_DIR } from "../shared/constants";
import { prepare_output_dir } from "../shared/prepare_output_dir";
import { bundle } from "./bundle";
import { generate_types } from "./generate_types";

let rebuild_count = 1;
export const build_dev = async () => {
  Logger.info(`Rebuilding... ${rebuild_count++}`);

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
