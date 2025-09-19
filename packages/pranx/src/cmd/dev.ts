import { logger } from "@/log/logger";
import kleur from "kleur";

export async function dev() {
  logger.log(kleur.bold().magenta("Pranx Dev"));
}
