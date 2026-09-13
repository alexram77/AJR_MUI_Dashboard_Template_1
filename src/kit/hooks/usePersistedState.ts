/**
 * `useState` persisted to localStorage under a scoped key.
 *
 * The scope matters: a dashboard watching several devices, tenants or
 * environments must not carry one device's card layout onto another. Passing a
 * `scope` keys the storage per subject and reloads state when the subject
 * changes — which is the behaviour you want and almost never get by default.
 */
import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** Read a key, returning `fallback` on absence or any storage failure. */
function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export interface PersistedStateOptions {
  /**
   * Subject this state belongs to — a device id, a tenant, an environment.
   * The storage key becomes `${baseKey}:${scope}`; changing it reloads.
   */
  scope?: string | null;
}

export function usePersistedState<T>(
  baseKey: string,
  defaultValue: T,
  { scope }: PersistedStateOptions = {},
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = scope ? `${baseKey}:${scope}` : baseKey;
  const previousKey = useRef(storageKey);

  const [state, setState] = useState<T>(() => read(storageKey, defaultValue));

  // Write through on every change. A failure here (quota, private mode) must
  // not break the component — the in-memory state is still correct.
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [storageKey, state]);

  // Reload when the scope changes, so switching subjects swaps the state
  // rather than writing the old subject's values under the new key.
  useEffect(() => {
    if (previousKey.current === storageKey) return;
    previousKey.current = storageKey;
    setState(read(storageKey, defaultValue));
    // `defaultValue` is intentionally excluded: an inline object literal would
    // re-run this on every render and clobber state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [state, setState];
}
