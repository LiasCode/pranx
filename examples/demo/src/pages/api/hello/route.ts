import { PranxHandler } from "@pranx";
import { randomUUID } from "node:crypto";

export const GET: PranxHandler = (c) => {
  return c.json({ hello: "ok", uuid: randomUUID() });
};
