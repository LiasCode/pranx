import * as esbuild from "esbuild";
import { measureTime } from "../src/utils/time-perf";
import { build_config } from "./shared/config";
import { prepare_output_dir } from "./shared/prepare_output_dir";
import { generate_types } from "./watch/generate_types";

await prepare_output_dir();

measureTime("Build for production");

measureTime("bundle");
await esbuild.build(build_config);
console.log(`Bundle in ${measureTime("bundle")} ms`);

generate_types({
  sync: true,
});

console.log(`Build completed in ${measureTime("Build for production")} ms`);
