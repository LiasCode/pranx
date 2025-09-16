const timeTags = new Map<string, number>();

/**
 * Measures the elapsed time (in milliseconds) since the last call with the same tag.
 * Uses the best available high-resolution timer.
 * @param tag A unique identifier for the timing session.
 * @returns The elapsed time in milliseconds, or undefined if this is the first call with the tag.
 */
export function measureTime(tag: string): number | undefined {
  const now = performance?.now ? performance.now() : Date.now();

  const last = timeTags.get(tag);
  timeTags.set(tag, now);

  return last !== undefined ? Math.trunc(now - last) : undefined;
}
