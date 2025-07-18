import type { JSONValue } from "hono/utils/types";
import kleur from "kleur";

export const Logger = {
  info: (msg: string) => console.log(kleur.blue(`${msg}`)),
  success: (msg: string) => console.log(kleur.green(`${msg}`)),
  warn: (msg: string) => console.log(kleur.yellow(`${msg}`)),
  error: (msg: string) => console.error(kleur.red(`${msg}`)),
  inspect: (msg: JSONValue) =>
    console.dir(msg, {
      compact: false,
      depth: Number.POSITIVE_INFINITY,
      colors: true,
    }),
};
