import { logger } from "@/utils/logger.js";
import { measureTime } from "@/utils/time-perf.js";

export function dev() {
  logger.info("Pranx Dev");
  measureTime("");
}
