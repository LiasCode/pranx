import { defineHandler } from "pranx/server";

export const POST = defineHandler((event) => {
  return { posting: false, url: event.url.toJSON() };
});
