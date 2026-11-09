export const DECK_STACKED_QUERY = "screen and (max-width: 767px) and (orientation: portrait)";

export function deckIndexFromHash(hash: string, total: number): number {
  const value = Number(hash.replace(/^#/, ""));
  return Number.isInteger(value) && value > 0 ? Math.min(value, total) - 1 : 0;
}

// Hidden desktop slides share identical bounds; only measure the mobile stack.
export function stackedDeckIndex(
  bounds: { top: number; bottom: number }[],
  readingLine: number,
): number | undefined {
  const index = bounds.findIndex((rect) => rect.top <= readingLine && rect.bottom > readingLine);
  return index >= 0 ? index : undefined;
}
