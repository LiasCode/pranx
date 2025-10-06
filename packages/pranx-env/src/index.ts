import * as dotenv from "dotenv";
import pathe from "pathe";
import type { EnvVars } from "types";

function loadEnv(): EnvVars | null {
  try {
    const defaultEnvFilePath = pathe.join(process.cwd(), ".env");

    const result = dotenv.config({
      encoding: "utf-8",
      quiet: true,
      path: defaultEnvFilePath,
    });

    if (result.error) {
      return null;
    }

    return result.parsed || {};
  } catch (_error) {
    return null;
  }
}

const PUBLIC_PREFIX = "PUBLIC_PRANX";

function extractPublicEnv(env: EnvVars): EnvVars {
  const publicVars = {};

  for (const envar of Object.entries(env)) {
    const [key, value] = envar;
    if (!key.startsWith(PUBLIC_PREFIX)) continue;
    Object.assign(publicVars, { [key]: value });
  }

  return publicVars;
}

function extractPrivateEnv(env: EnvVars): EnvVars {
  const privateVars = {};

  for (const envar of Object.entries(env)) {
    const [key, value] = envar;
    if (key.startsWith(PUBLIC_PREFIX)) continue;
    Object.assign(privateVars, { [key]: value });
  }

  return privateVars;
}

export { extractPrivateEnv, extractPublicEnv, loadEnv };
