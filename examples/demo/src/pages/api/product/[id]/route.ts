import { PrextHandler } from "@prext";

export const GET: PrextHandler = (c) => {
  const id = c.req.param("id");
  return c.json({ id });
};
