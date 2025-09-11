import { defineHandler } from "pranx/server";

export const GET = defineHandler(() => {
  return { getting: true };
});

export const POST = defineHandler(() => {
  return { posting: false };
});

export const PUT = defineHandler(() => {
  return { puttin: true };
});

export const DELETE = defineHandler(() => {
  return { deleting: true };
});
