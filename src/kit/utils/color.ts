/**
 * Colour helpers for surfaces that cannot use MUI's `alpha()` on a palette
 * token — SVG attributes, inline gradients, CSS strings.
 */

/** Append an 8-bit alpha suffix to a 6-digit hex colour. `withAlpha('#00e676', 0.2)`. */
export function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const suffix = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${suffix}`;
}

/** Semantic tone shared by status chips, dots and meters. */
export type Tone = 'ok' | 'warn' | 'bad' | 'neutral';

/** Map a tone to the matching MUI palette colour name. */
export function toneToColor(tone: Tone): 'success' | 'warning' | 'error' | 'default' {
  switch (tone) {
    case 'ok':
      return 'success';
    case 'warn':
      return 'warning';
    case 'bad':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Tone for a value against warn/bad thresholds, e.g. a disk-usage percentage.
 * Thresholds are inclusive lower bounds.
 */
export function toneForThresholds(value: number, warnAt: number, badAt: number): Tone {
  if (value >= badAt) return 'bad';
  if (value >= warnAt) return 'warn';
  return 'ok';
}
