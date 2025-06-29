import { PranxHandler } from "pranx";

export const GET: PranxHandler = (c) => {
  const id = c.req.param("id");
  return c.json({ id, method: "get" });
};

export const POST: PranxHandler = (c) => {
  const id = c.req.param("id");
  return c.json({ id, method: "post" });
};
