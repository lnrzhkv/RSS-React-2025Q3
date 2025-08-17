'use client';

import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  storageKey: string,
  fallbackState: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  let parsedValue: T;
  try {
    const item = localStorage.getItem(storageKey);
    parsedValue = item !== null ? JSON.parse(item) : fallbackState;
  } catch {
    parsedValue = fallbackState;
  }

  const correctValue =
    typeof parsedValue === 'object' && parsedValue !== null
      ? fallbackState
      : parsedValue;

  const [value, setValue] = useState<T>(correctValue as T);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}

export default useLocalStorage;
