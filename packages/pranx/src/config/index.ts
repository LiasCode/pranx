import { loadConfig } from "c12";
import type { PranxConfig } from "types/index.js";

const DEFAULT_CONFIG: PranxConfig = {
  esbuild: {
    alias: {},
    define: {},
    plugins: [],
  },
  csr: true,
};

let UserPranxConfig: PranxConfig | null = null;

export async function load_user_pranx_config() {
  const config = await loadConfig({
    configFile: "pranx.config",
    configFileRequired: true,
    defaultConfig: DEFAULT_CONFIG,
  });

  UserPranxConfig = config.config;
}

export async function get_user_pranx_config() {
  if (UserPranxConfig !== null) {
    await load_user_pranx_config();
    return UserPranxConfig;
  }
  return UserPranxConfig;
}
