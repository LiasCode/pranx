import { DotenvParseOutput } from "dotenv";

export declare function loadEnv(): EnvVars | null;

export declare function extractPublicEnv(env: EnvVars): EnvVars;

export declare function extractPrivateEnv(env: EnvVars): EnvVars;

export type EnvVars = DotenvParseOutput;
