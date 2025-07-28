import path from "node:path";

export const PRANX_OUTPUT_DIR = path.resolve(path.join(process.cwd(), ".pranx"));

export const CLIENT_OUTPUT_DIR = path.join(PRANX_OUTPUT_DIR, "client");

export const SERVER_OUTPUT_DIR = path.join(PRANX_OUTPUT_DIR, "server");

export const VENDOR_SOURCE_DIR = path.resolve(
  path.join(import.meta.dirname, "..", "client", "vendor")
);

export const VENDOR_BUNDLE_OUTPUT_PATH = path.join(CLIENT_OUTPUT_DIR, "vendor");
