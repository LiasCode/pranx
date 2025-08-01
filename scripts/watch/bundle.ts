import * as esbuild from "esbuild";
import { measureTime } from "../../src/utils/time-perf";
import { build_config_dev } from "../shared/config";

const ctx = await esbuild.context(build_config_dev);

export const bundle = async () => {
  measureTime("bundle");
  await ctx.rebuild();
  console.log(`Bundle in ${measureTime("bundle")} ms`);
};
