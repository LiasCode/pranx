import { logger } from "@/utils/logger.js";
import kleur from "kleur";

export function dev() {
  logger.log(kleur.bold().magenta("Pranx Dev"));
}
