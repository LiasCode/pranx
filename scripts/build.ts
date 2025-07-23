import * as esbuild from "esbuild";
import { execSync } from "node:child_process";
import { build_config } from "./shared/config";
import { prepare_output_dir } from "./shared/prepare_output_dir";

await prepare_output_dir();

console.time("build - production");
await esbuild.build(build_config);

execSync("tsc");

console.timeEnd("build - production");
