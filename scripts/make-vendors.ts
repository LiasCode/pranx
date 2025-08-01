import * as fse from "fs-extra";
import kleur from "kleur";
import * as fs from "node:fs/promises";
import path from "node:path";
import { measureTime } from "../src/utils/time-perf";

measureTime("make-vendors");

const VENDORS_OUTPUT_DIR = path.resolve(path.join(process.cwd(), "src", "client", "vendor"));

await fse.emptyDir(VENDORS_OUTPUT_DIR);

const PREACT_PATH = path.resolve(path.join(process.cwd(), "node_modules", "preact"));

const PREACT_FILE = path.join(PREACT_PATH, "dist", "preact.module.js");

const COMPAT_FILE = path.join(PREACT_PATH, "compat", "dist", "compat.module.js");

const DEBUG_FILE = path.join(PREACT_PATH, "debug", "dist", "debug.module.js");

const DEVTOOLS_FILE = path.join(PREACT_PATH, "devtools", "dist", "devtools.module.js");

const HOOKS_FILE = path.join(PREACT_PATH, "hooks", "dist", "hooks.module.js");

const JSX_RUNTIME_FILE = path.join(PREACT_PATH, "jsx-runtime", "dist", "jsxRuntime.module.js");

await fse.copy(PREACT_FILE, path.join(VENDORS_OUTPUT_DIR, "preact.js"));

await fse.copy(COMPAT_FILE, path.join(VENDORS_OUTPUT_DIR, "compat.js"));

await fse.copy(DEBUG_FILE, path.join(VENDORS_OUTPUT_DIR, "debug.js"));

await fse.copy(DEVTOOLS_FILE, path.join(VENDORS_OUTPUT_DIR, "devtools.js"));

await fse.copy(HOOKS_FILE, path.join(VENDORS_OUTPUT_DIR, "hooks.js"));

await fse.copy(JSX_RUNTIME_FILE, path.join(VENDORS_OUTPUT_DIR, "jsxRuntime.js"));

const ROUTER_FILE_SOURCE = `
import {
  ErrorBoundary,
  LocationProvider,
  Route,
  Router,
  hydrate,
  lazy,
  prerender,
  useLocation,
  useRoute,
} from "preact-iso";

export {
  ErrorBoundary,
  LocationProvider,
  Route,
  Router,
  hydrate,
  lazy,
  prerender,
  useLocation,
  useRoute,
};`;

await fs.writeFile(path.join(VENDORS_OUTPUT_DIR, "router.js"), ROUTER_FILE_SOURCE);

console.log(kleur.green().bold(`Make vendors in ${measureTime("make-vendors")} ms`));
