import { Handler } from "hono";
import { randomUUID } from "node:crypto";

export const GET: Handler = (c) => {
  return c.json({ hello: "ok", uuid: randomUUID() });
};
