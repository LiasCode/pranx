import { exec, execSync } from "node:child_process";
import { measureTime } from "../../src/utils/time-perf";

export const generate_types = (options?: { sync: boolean }) => {
  measureTime("generate_types");

  if (options?.sync) {
    execSync("tsc");
  } else {
    exec("tsc");
  }

  console.log(`Generate types in ${measureTime("generate_types")} ms`);
};
