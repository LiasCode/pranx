import { logger } from "@/utils/logger.js";
import kleur from "kleur";

export async function start() {
  logger.log(kleur.bold().magenta("Pranx Start"));
}
