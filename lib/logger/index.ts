import kleur from "kleur";

export const Logger = {
  info: (msg: string) => console.log(kleur.blue(`[Prext] ${msg}`)),
  success: (msg: string) => console.log(kleur.green(`[Prext] ${msg}`)),
  warn: (msg: string) => console.log(kleur.yellow(`[Prext] ${msg}`)),
  error: (msg: string) => console.error(kleur.red(`[Prext] ${msg}`)),
};
