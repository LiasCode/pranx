export const convertHumanReadable = (ms: number): string => {
  const result = ms / 1000;

  if (Math.trunc(result)) {
    return `${result} seg`;
  }

  return `${result} ms`;
};
