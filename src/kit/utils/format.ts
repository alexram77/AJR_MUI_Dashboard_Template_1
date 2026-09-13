/**
 * Display formatters.
 *
 * House rule, learned the hard way: missing data renders as an em dash, never
 * as `0`, `NaN`, or a fabricated value. A reader must be able to tell "no
 * reading" from "a reading of zero" at a glance.
 */

/** The one placeholder for absent data. */
export const EMPTY = '—';

/** True when a value is absent or not a usable number. */
function isBlank(value: number | null | undefined): value is null | undefined {
  return value === null || value === undefined || Number.isNaN(value);
}

/** Fixed-decimal number, or the empty placeholder. */
export function fmtNumber(value: number | null | undefined, decimals = 2): string {
  if (isBlank(value)) return EMPTY;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Compact magnitude — 1.2K, 3.4M, 5.6B. */
export function fmtCompact(value: number | null | undefined, decimals = 1): string {
  if (isBlank(value)) return EMPTY;
  return Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: decimals,
  }).format(value);
}

/** A fraction (0.032) as a percentage string ("3.2%"). */
export function fmtPercent(value: number | null | undefined, decimals = 1): string {
  if (isBlank(value)) return EMPTY;
  return `${(value * 100).toFixed(decimals)}%`;
}

/** A fraction as a signed percentage ("+3.2%") — for deltas, where sign matters. */
export function fmtSignedPercent(value: number | null | undefined, decimals = 1): string {
  if (isBlank(value)) return EMPTY;
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(decimals)}%`;
}

/** A fraction as signed percentage points ("+1.2pp") — for differences of two rates. */
export function fmtPoints(value: number | null | undefined, decimals = 1): string {
  if (isBlank(value)) return EMPTY;
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(decimals)}pp`;
}

/** Currency, defaulting to USD with no cents above four figures. */
export function fmtCurrency(value: number | null | undefined, currency = 'USD'): string {
  if (isBlank(value)) return EMPTY;
  const decimals = Math.abs(value) >= 10000 ? 0 : 2;
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Byte count in decimal units — 512 MB, 1.4 GB, 2.30 TB. */
export function fmtBytes(value: number | null | undefined): string {
  if (isBlank(value)) return EMPTY;
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)} TB`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} GB`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)} MB`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)} KB`;
  return `${value} B`;
}

/** ISO timestamp as `YYYY-MM-DD`. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return EMPTY;
  return date.toISOString().slice(0, 10);
}

/** ISO timestamp as a locale date and time. */
export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return EMPTY;
  return date.toLocaleString();
}

/** Wall-clock time only — `14:32:07`. */
export function fmtTime(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return EMPTY;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Compact age from a duration in seconds — `45s`, `3m`, `2h`, `3d`. */
export function fmtAge(seconds: number | null | undefined): string {
  if (isBlank(seconds)) return EMPTY;
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

/** Age of an ISO timestamp, in seconds. Null when unparseable. */
export function ageSeconds(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return null;
  return (Date.now() - ts) / 1000;
}

/** Truncate with an ellipsis, without breaking on short strings. */
export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}
