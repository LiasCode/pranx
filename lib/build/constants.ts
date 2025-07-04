import path from "node:path";

export const PRANX_OUTPUT_DIR = path.resolve(path.join(process.cwd(), ".pranx"));

export const PAGES_OUTPUT_DIR = path.join(PRANX_OUTPUT_DIR, "pages");

export const ROUTE_HANDLER_OUTPUT_DIR = path.resolve(
  path.join(PRANX_OUTPUT_DIR, "server", "handlers")
);

export const VENDOR_SOURCE_DIR = path.resolve(
  path.join(import.meta.dirname, "..", "client", "vendor")
);
export const VENDOR_BUNDLE_OUTPUT_PATH = path.join(PAGES_OUTPUT_DIR, "vendor");
