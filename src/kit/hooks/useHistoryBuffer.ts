/**
 * Fixed-length ring buffer of recent values, keyed by channel.
 *
 * Feeding sparklines and trend arrows needs a short window of history, and
 * keeping it unbounded is how a dashboard left open overnight ends up holding
 * a million points. This caps every series at `capacity` and drops the oldest.
 *
 * Deliberately not persisted: history is a view of the live stream, and a
 * reload should show the live stream, not last week's.
 */
import { useCallback, useRef, useState } from 'react';
import type { HistoryPoint } from '../components/sensors/types';

export interface HistoryBuffer {
  /** channel id → points, oldest first. */
  history: Record<string, HistoryPoint[]>;
  /** Append one reading per channel from a snapshot. */
  push: (values: Record<string, number | null | undefined>, timestamp?: number) => void;
  /** Drop everything, or one channel. */
  clear: (channelId?: string) => void;
}

export function useHistoryBuffer(capacity = 60): HistoryBuffer {
  const [history, setHistory] = useState<Record<string, HistoryPoint[]>>({});

  // Capacity is read inside the callback but must not re-create it.
  const capacityRef = useRef(capacity);
  capacityRef.current = capacity;

  const push = useCallback((values: Record<string, number | null | undefined>, timestamp = Date.now()) => {
    setHistory((previous) => {
      const next: Record<string, HistoryPoint[]> = { ...previous };
      const limit = capacityRef.current;

      for (const [channelId, value] of Object.entries(values)) {
        // A null reading is a gap, not a zero — skip it rather than plotting a
        // drop to the floor that never happened.
        if (value === null || value === undefined || Number.isNaN(value)) continue;

        const series = next[channelId] ?? [];
        const appended = [...series, { time: timestamp, value }];
        next[channelId] = appended.length > limit ? appended.slice(appended.length - limit) : appended;
      }
      return next;
    });
  }, []);

  const clear = useCallback((channelId?: string) => {
    setHistory((previous) => {
      if (!channelId) return {};
      const next = { ...previous };
      delete next[channelId];
      return next;
    });
  }, []);

  return { history, push, clear };
}
