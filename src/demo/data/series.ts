/**
 * Deterministic mock time series for the demo.
 *
 * Seeded rather than `Math.random()` so screenshots, visual diffs and repeated
 * loads show the identical chart. A demo that reshuffles on every refresh
 * makes it impossible to tell a styling regression from noise.
 */

/** Small deterministic PRNG (mulberry32). Same seed, same sequence, always. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random walk with drift, rounded to two decimals. */
export function randomWalk(options: {
  seed: number;
  length: number;
  start: number;
  drift?: number;
  volatility?: number;
  floor?: number;
}): number[] {
  const { seed, length, start, drift = 0.004, volatility = 0.03, floor = 0 } = options;
  const random = makeRandom(seed);
  const out: number[] = [];
  let value = start;

  for (let i = 0; i < length; i += 1) {
    value = value * (1 + drift + (random() - 0.5) * volatility);
    out.push(Math.round(Math.max(value, floor) * 100) / 100);
  }
  return out;
}

/** `count` day labels ending today, as `MMM D`. */
export function dayLabels(count: number): string[] {
  const out: string[] = [];
  const today = new Date('2026-09-11T00:00:00Z');

  for (let i = count - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - i);
    out.push(day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }));
  }
  return out;
}

/** Zip parallel series into the row shape the chart components expect. */
export function toRows(
  labels: string[],
  series: Record<string, number[]>,
): Array<Record<string, string | number>> {
  return labels.map((label, index) => {
    const row: Record<string, string | number> = { day: label };
    for (const [key, values] of Object.entries(series)) {
      row[key] = values[index];
    }
    return row;
  });
}

// ── Pre-built demo datasets ──────────────────────────────────────────────────

export const DAYS_30 = dayLabels(30);
export const DAYS_12 = dayLabels(12);

export const throughputSeries = randomWalk({ seed: 11, length: 30, start: 1420, volatility: 0.09 });
export const latencySeries = randomWalk({ seed: 27, length: 30, start: 186, drift: -0.002, volatility: 0.07 });
export const errorSeries = randomWalk({ seed: 43, length: 30, start: 2.4, drift: -0.006, volatility: 0.22 });
export const costSeries = randomWalk({ seed: 61, length: 30, start: 318, drift: 0.002, volatility: 0.05 });

/** Two-series comparison rows — a portfolio against its benchmark. */
export const performanceRows = toRows(DAYS_30, {
  strategy: randomWalk({ seed: 7, length: 30, start: 100_000, drift: 0.006, volatility: 0.022 }),
  benchmark: randomWalk({ seed: 19, length: 30, start: 100_000, drift: 0.004, volatility: 0.016 }),
});

/** Stacked composition rows — where ingested volume came from. */
export const sourceMixRows = toRows(DAYS_12, {
  api: randomWalk({ seed: 71, length: 12, start: 540, volatility: 0.12 }),
  batch: randomWalk({ seed: 83, length: 12, start: 310, volatility: 0.14 }),
  stream: randomWalk({ seed: 97, length: 12, start: 180, volatility: 0.2 }),
});
