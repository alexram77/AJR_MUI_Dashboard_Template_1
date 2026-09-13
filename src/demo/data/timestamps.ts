/**
 * Relative timestamps for the demo.
 *
 * The freshness and deploy badges are meant to demonstrate the green/amber
 * split. Hardcoded dates stop doing that the day after they are written — by
 * the next morning every chip is amber and the component looks broken. These
 * helpers keep the demo honest whenever it is opened.
 */

const MINUTE = 60_000;

/** ISO timestamp `n` minutes before now. */
export function minutesAgo(n: number): string {
  return new Date(Date.now() - n * MINUTE).toISOString();
}

/** ISO timestamp `n` hours before now. */
export function hoursAgo(n: number): string {
  return minutesAgo(n * 60);
}

/** ISO timestamp `n` days before now. */
export function daysAgo(n: number): string {
  return hoursAgo(n * 24);
}
