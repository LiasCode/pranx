import * as fse from "fs-extra";
import { OUTPUT_DIR, OUTPUT_VENDORS_DIR, TYPES_OUT_DIR, TYPES_SRC_DIR } from "./config";

export async function prepare_output_dir() {
  console.time("build - prepare");
  await fse.emptyDir(OUTPUT_DIR);
  // Vendors
  await fse.copy("./lib/client", OUTPUT_VENDORS_DIR);
  await fse.copy(TYPES_SRC_DIR, TYPES_OUT_DIR);
  console.timeEnd("build - prepare");
}
