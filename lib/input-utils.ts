// lib/input-utils.ts

export const cleanupInputState = <T extends Record<string, any>>(
  setState: (fn: (prev: T) => T) => void,
  itemId: string
) => {
  setState((prev) => {
    const copy = { ...prev };
    delete copy[itemId];
    return copy;
  });
};
