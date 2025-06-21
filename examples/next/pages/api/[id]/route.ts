import { Handler } from "hono";

export const GET: Handler = (c) => {
  const id = c.req.param("id");
  return c.json({ id });
};
