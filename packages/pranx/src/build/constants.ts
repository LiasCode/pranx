import { join } from "pathe";

const CWD = process.cwd();

const OUTPUT_PRANX_DIR = join(CWD, ".pranx");

const OUTPUT_PAGES_DIR = join(OUTPUT_PRANX_DIR);
const OUTPUT_BUNDLE_BROWSER_DIR = join(OUTPUT_PAGES_DIR, "browser");
const OUTPUT_BUNDLE_SERVER_DIR = join(OUTPUT_PAGES_DIR, "server");

const SOURCE_DIR = join(CWD, "src");
const SOURCE_PAGES_DIR = join(SOURCE_DIR, "pages");

const PUBLIC_USER_DIR = join(CWD, "public");

const SERVER_MANIFEST_OUTPUT_PATH = join(OUTPUT_BUNDLE_SERVER_DIR, "server.manifest.json");
const SITE_MANIFEST_OUTPUT_PATH = join(OUTPUT_BUNDLE_BROWSER_DIR, "site.manifest.json");

export {
  CWD,
  OUTPUT_BUNDLE_BROWSER_DIR,
  OUTPUT_BUNDLE_SERVER_DIR,
  OUTPUT_PAGES_DIR,
  OUTPUT_PRANX_DIR,
  PUBLIC_USER_DIR,
  SERVER_MANIFEST_OUTPUT_PATH,
  SITE_MANIFEST_OUTPUT_PATH,
  SOURCE_DIR,
  SOURCE_PAGES_DIR,
};
