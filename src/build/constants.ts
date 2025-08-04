import path from "node:path";

// sources
export const CLIENT_SOURCE_DIR = path.resolve(path.join(import.meta.dirname, "..", "client"));

export const HYDRATE_SOURCE_FILE = path.resolve(path.join(CLIENT_SOURCE_DIR, "hydrate.tsx"));

export const VENDOR_SOURCE_DIR = path.resolve(path.join(CLIENT_SOURCE_DIR, "vendor"));

// outputs
export const PRANX_OUTPUT_DIR = path.resolve(path.join(process.cwd(), ".pranx"));

export const CLIENT_OUTPUT_DIR = path.join(PRANX_OUTPUT_DIR, "client");

export const SERVER_OUTPUT_DIR = path.join(PRANX_OUTPUT_DIR, "server");

export const VENDOR_BUNDLE_OUTPUT_PATH = path.join(CLIENT_OUTPUT_DIR, "vendor");

export const HYDRATE_OUTPUT_FILE = path.join(CLIENT_OUTPUT_DIR, "hydrate.js");

// FLAGS
export const FLAGS = {
  SHOW_TIMES: Boolean(process.env.SHOW_TIMES === "true"),
};
