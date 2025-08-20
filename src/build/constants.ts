import { join } from "pathe";

const CWD = process.cwd();

const OUTPUT_PRANX_DIR = join(CWD, ".pranx");

const OUTPUT_PAGES_DIR = join(OUTPUT_PRANX_DIR, "bundle");
const OUTPUT_BUNDLE_BROWSER_DIR = join(OUTPUT_PAGES_DIR, "browser");
const OUTPUT_BUNDLE_SERVER_DIR = join(OUTPUT_PAGES_DIR, "server");

const SOURCE_DIR = join(CWD, "src");
const SOURCE_PAGES_DIR = join(SOURCE_DIR, "pages");

export {
  CWD,
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PAGES_DIR,
  OUTPUT_PRANX_DIR,
  SOURCE_DIR,
  SOURCE_PAGES_DIR,
};
