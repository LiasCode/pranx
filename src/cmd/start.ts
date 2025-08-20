import { logger } from "@/utils/logger.js";
import kleur from "kleur";

export function start() {
  logger.log(kleur.bold().magenta("Pranx Start"));
}
