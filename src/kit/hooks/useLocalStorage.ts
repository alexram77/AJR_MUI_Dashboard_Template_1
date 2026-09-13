/**
 * State backed by localStorage.
 *
 * Every access is guarded: private browsing, blocked site data and quota
 * exhaustion all throw, and none of them should take the page down. A failed
 * read falls back to the initial value; a failed write is dropped silently and
 * the in-memory state still updates.
 */
import { useCallback, useState } from 'react';

/** Read and parse a key, returning `fallback` on any failure. */
function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialise and write a key. Failures are intentionally swallowed. */
function writeKey<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full — in-memory state is still correct */
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readKey(key, initialValue));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        writeKey(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, set, reset] as const;
}
