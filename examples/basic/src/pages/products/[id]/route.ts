import { defineHandler } from "pranx/server";

export const POST = defineHandler((event) => {
  return { params: event.context.params };
});
