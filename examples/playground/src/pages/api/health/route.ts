import type { PranxHandler } from "pranx";

export const GET: PranxHandler = (c) => {
  return c.json({ ok: true }, 200);
};
