/**
 * Runs an async function and tracks loading/data/error.
 *
 * Deliberately minimal — it covers the "fetch once, show a spinner, show an
 * error" case that most dashboard panels need, without pulling in a data
 * layer. Reach for a real query library when you need caching or mutations.
 *
 * Stale responses are discarded: if `deps` change mid-flight, the in-flight
 * result is ignored rather than overwriting the newer one.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-run the task. Safe to call from an event handler. */
  refresh: () => void;
}

export function useAsync<T>(task: () => Promise<T>, deps: DependencyList = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Monotonic id — only the newest run is allowed to write state.
  const runIdRef = useRef(0);

  useEffect(() => {
    const runId = ++runIdRef.current;
    let cancelled = false;

    setLoading(true);
    setError(null);

    task()
      .then((result) => {
        if (cancelled || runId !== runIdRef.current) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled || runId !== runIdRef.current) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (cancelled || runId !== runIdRef.current) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, refresh };
}
