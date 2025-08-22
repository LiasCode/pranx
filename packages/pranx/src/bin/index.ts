#!/usr/bin/env node

import { build } from "@/cmd/build.js";
import { dev } from "@/cmd/dev.js";
import { start } from "@/cmd/start.js";
import { logger } from "@/utils/logger.js";
import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "pranx",
    version: "0.0.1",
    description: "The next of preact",
  },
  args: {
    dev: {
      type: "boolean",
      description: "run pranx in dev mode",
    },
    start: {
      type: "boolean",
      description: "start pranx in production mode",
    },
    build: {
      type: "boolean",
      description: "build and bundle optimize your pranx project",
    },
  },
  async run({ args }) {
    if (args._.length > 1) {
      logger.error("The args must be only one", `current args: ${args}`);
    }
    if (args.build) {
      await build();
    }
    if (args.dev) {
      await dev();
    }
    if (args.start) {
      await start();
    }
  },
});

runMain(main);
