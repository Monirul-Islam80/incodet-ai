/** Returns only items that are finished: not marked todo and with every required field filled. */
export function visible<T extends { todo?: boolean }>(
  items: readonly T[],
  required: (keyof T)[],
): T[] {
  return items.filter((it) => {
    if (it.todo) return false;
    return required.every((k) => {
      const v = it[k];
      if (v === undefined || v === null) return false;
      if (typeof v === "string") return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    });
  });
}
