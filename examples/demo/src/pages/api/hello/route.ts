import { PrextHandler } from "@prext";
import { randomUUID } from "node:crypto";

export const GET: PrextHandler = (c) => {
  return c.json({ hello: "ok", uuid: randomUUID() });
};
