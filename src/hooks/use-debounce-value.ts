"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(initial: T, delayMs: number) {
  const [value, setValue] = useState<T>(initial);
  const [debounced, setDebounced] = useState<T>(initial);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return [debounced, setValue] as const;
}
