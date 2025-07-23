import * as esbuild from "esbuild";
import { exec } from "node:child_process";
import { Logger } from "../lib/logger/index";
import { build_config } from "./shared/config";
import { prepare_output_dir } from "./shared/prepare_output_dir";

await prepare_output_dir();

const ctx = await esbuild.context(build_config);

await ctx.watch();

exec("tsc --watch");

Logger.info("Running build in watch mode");
