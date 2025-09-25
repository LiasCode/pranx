#!/usr/bin/env node

import { logger } from "@/log/logger";
import { convertHumanReadable } from "@/utils/ms-time-converter";
import { measureTime } from "@/utils/time-perf";
import { defineCommand, runMain } from "citty";
import fse from "fs-extra";
import { downloadTemplate } from "giget";
import kleur from "kleur";
import * as pathe from "pathe";

measureTime("create-pranx-time");

const main = defineCommand({
  meta: {
    name: "create-pranx",
    description: "Starter for pranx, the next of preact",
  },
  args: {
    template: {
      type: "string",
      description: "The template to use",
      alias: "t",
      default: "basic",
    },
    name: {
      type: "string",
      description: "Name of the project",
      alias: "n",
      required: true,
    },
    force: {
      type: "boolean",
      description: "If the dir exists, will be replaced",
      default: false,
      required: false,
      alias: "f",
    },
    debug: {
      type: "boolean",
      description: "Debug, used for see ctx",
      default: false,
      required: false,
    },
  },
  async run(ctx) {
    try {
      if (ctx.args.debug) {
        console.dir(ctx);
      }
      logger.log(
        `Cloning template ${kleur.bold(ctx.args.template)} into ${kleur.bold(`./${ctx.args.name}`)}`
      );

      const output_path = pathe.join(process.cwd(), ctx.args.name);

      const alreadyExistsOutputDir = await fse.exists(output_path);

      if (alreadyExistsOutputDir && !ctx.args.force) {
        logger.error("Ouput path already exists, use --force to replace it");
        process.exit(1);
      }

      await fse.rm(output_path, { recursive: true, force: true });

      const REPO_URL = `github:LiasCode/pranx-templates/templates/${ctx.args.template}`;

      if (ctx.args.debug) {
        console.dir(REPO_URL);
      }

      await downloadTemplate(REPO_URL, {
        force: true,
        silent: true,
        forceClean: true,
        dir: output_path,
      });

      logger.log(`
Enter the project:
${kleur.bold("cd")} ./${ctx.args.name}

Install deps:
${kleur.bold("npm")} i

Build:
${kleur.bold("npm")} run build

Start:
${kleur.bold("npm")} run start
`);

      logger.success(`Done in ${convertHumanReadable(measureTime("create-pranx-time") || 0)}`);
    } catch (error) {
      if (!(error instanceof Error)) {
        return;
      }
      logger.error(error.message);
    }
  },
});

runMain(main);
