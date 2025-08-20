import { logger } from "@/utils/logger.js";
import kleur from "kleur";

export function build() {
  logger.log(kleur.bold().magenta("Pranx Build"));
}
