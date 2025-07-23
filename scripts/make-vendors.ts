import * as fse from "fs-extra";
import * as fs from "node:fs/promises";
import path from "node:path";

console.time("build - make-vendors");

const VENDORS_OUTPUT_DIR = path.resolve(path.join(process.cwd(), "lib", "client", "vendor"));

await fse.emptyDir(VENDORS_OUTPUT_DIR);

const PREACT_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "dist", "preact.module.js")
);

const COMPAT_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "compat", "dist", "compat.module.js")
);

const DEBUG_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "debug", "dist", "debug.module.js")
);

const DEVTOOLS_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "devtools", "dist", "devtools.module.js")
);

const HOOKS_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "hooks", "dist", "hooks.module.js")
);

const JSX_RUNTIME_FILE_DIR = path.resolve(
  path.join(process.cwd(), "node_modules", "preact", "jsx-runtime", "dist", "jsxRuntime.module.js")
);

await fse.copy(PREACT_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "preact.js"));

await fse.copy(COMPAT_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "compat.js"));

await fse.copy(DEBUG_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "debug.js"));

await fse.copy(DEVTOOLS_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "devtools.js"));

await fse.copy(HOOKS_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "hooks.js"));

await fse.copy(JSX_RUNTIME_FILE_DIR, path.join(VENDORS_OUTPUT_DIR, "jsxRuntime.js"));

const routerSrcContent = `
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

await fs.writeFile(path.join(VENDORS_OUTPUT_DIR, "router.js"), routerSrcContent);

console.timeEnd("build - make-vendors");
