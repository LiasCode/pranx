import * as esbuild from "esbuild";
import { execSync } from "node:child_process";
import { measureTime } from "../src/utils/time-perf";
import { build_config } from "./shared/config";
import { prepare_output_dir } from "./shared/prepare_output_dir";

await prepare_output_dir();

measureTime("Build for production");

await esbuild.build(build_config);

execSync("tsc");

console.log(`Build completed in ${measureTime("Build for production")} ms`);
