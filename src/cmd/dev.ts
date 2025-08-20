import { bundle_dev } from "@/build/bundle_dev.js";
import { logger } from "@/utils/logger.js";
import kleur from "kleur";

export async function dev() {
  logger.log(kleur.bold().magenta("Pranx Dev"));
  await bundle_dev();
}
