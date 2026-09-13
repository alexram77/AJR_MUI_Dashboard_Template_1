/**
 * Small numeric helpers shared by the meters and charts.
 *
 * Kept separate from `format.ts`: these produce numbers for geometry, not
 * strings for display.
 */

/** Constrain a value to `[min, max]`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Position of `value` within `[min, max]`, as a fraction in `[0, 1]`.
 * A zero-width range yields 0 rather than NaN.
 */
export function fraction(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/** Linear interpolation between `a` and `b`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Sum-of-numerators over sum-of-denominators.
 *
 * Use this rather than averaging per-row ratios: the mean of a ratio is
 * dominated by rows whose denominator is near zero, and reports a number that
 * describes none of the data.
 */
export function pooledRatio(numerators: number[], denominators: number[]): number | null {
  const den = denominators.reduce((sum, value) => sum + value, 0);
  if (den === 0) return null;
  return numerators.reduce((sum, value) => sum + value, 0) / den;
}

/** Median — the honest centre for a skewed distribution. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
