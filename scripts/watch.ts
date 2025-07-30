import * as esbuild from "esbuild";
import { exec } from "node:child_process";
import { Logger } from "../src/logger/index";
import { build_config_dev } from "./shared/config";
import { prepare_output_dir } from "./shared/prepare_output_dir";

Logger.info("Starting watch mode for development build");

await prepare_output_dir();

const ctx = await esbuild.context(build_config_dev);

await ctx.watch();

exec("tsc --watch");
