import type { PranxHandler } from "pranx";

export const GET: PranxHandler = (c) => {
  return c.json({ ok: true }, 200);
};

export const POST: PranxHandler = (c) => {
  return c.json({ ok: true, msg: "From POST /api/health" }, 200);
};
