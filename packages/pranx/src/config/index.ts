import { loadConfig } from "c12";
import type { PranxConfig } from "types/index";

const DEFAULT_CONFIG: PranxConfig = {
  esbuild: {
    alias: {},
    define: {},
    plugins: [],
  },
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

export async function get_user_pranx_config(): Promise<PranxConfig> {
  if (UserPranxConfig !== null) {
    await load_user_pranx_config();
    return UserPranxConfig as PranxConfig;
  }

  return UserPranxConfig as unknown as PranxConfig;
}
