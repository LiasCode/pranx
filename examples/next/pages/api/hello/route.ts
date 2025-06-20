import { Handler } from "hono";

export const GET: Handler = (c) => {
  return c.json({ hello: "ok" });
};
