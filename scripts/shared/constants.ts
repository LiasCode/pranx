import path from "node:path";

export const SOURCE_DIR = path.resolve(path.join(process.cwd(), "src"));

export const OUTPUT_DIR = path.resolve(path.join(process.cwd(), "dist"));
export const OUTPUT_VENDORS_DIR = path.join(OUTPUT_DIR, "client");

export const TYPES_SRC_DIR = path.join(process.cwd(), "src", "types");
export const TYPES_OUT_DIR = path.join(OUTPUT_DIR, "types");
