import * as fse from "fs-extra";
import { measureTime } from "../../src/utils/time-perf";
import { OUTPUT_DIR, OUTPUT_VENDORS_DIR, TYPES_OUT_DIR, TYPES_SRC_DIR } from "./config";

export async function prepare_output_dir() {
  measureTime("build-prepare");
  await fse.emptyDir(OUTPUT_DIR);

  // Vendors
  await fse.copy("./src/client", OUTPUT_VENDORS_DIR);

  await fse.copy(TYPES_SRC_DIR, TYPES_OUT_DIR);

  console.log(`Output directory prepared in ${measureTime("build-prepare")} ms`);
}
