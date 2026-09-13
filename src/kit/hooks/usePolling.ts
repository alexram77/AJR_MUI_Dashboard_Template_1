/**
 * Calls `fn` on an interval, and once immediately.
 *
 * Pauses while the tab is hidden — a dashboard left open in a background tab
 * should not keep hammering an API. Resuming fires immediately so the view is
 * fresh the moment the user comes back.
 */
import { useEffect, useRef } from 'react';

export interface PollingOptions {
  /** Interval in ms. */
  intervalMs: number;
  /** Set false to suspend polling (e.g. while a dialog is open). */
  enabled?: boolean;
  /** Keep polling while the tab is hidden. Default false. */
  pollWhenHidden?: boolean;
}

export function usePolling(fn: () => void, { intervalMs, enabled = true, pollWhenHidden = false }: PollingOptions) {
  // Hold the latest callback in a ref so changing it does not restart the timer.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      fnRef.current();
      timer = setInterval(() => fnRef.current(), intervalMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    if (pollWhenHidden || !document.hidden) start();
    if (!pollWhenHidden) document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      if (!pollWhenHidden) document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [intervalMs, enabled, pollWhenHidden]);
}
