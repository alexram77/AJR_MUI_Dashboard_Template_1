/**
 * Shared Recharts configuration.
 *
 * Charts in the kit are thin wrappers over Recharts. Everything that should
 * look the same across every chart — axis styling, grid, tooltip surface,
 * margins — lives here rather than being repeated per chart component.
 */
import type { ChartTokens } from '../../theme/chartTokens';

/** Default plot margins. Left is 0 because the Y axis supplies its own width. */
export const CHART_MARGIN = { top: 8, right: 16, left: 0, bottom: 0 } as const;

/** Axis tick props, derived from the live theme. */
export function axisProps(tokens: ChartTokens) {
  return {
    tick: { fontSize: tokens.tickFontSize, fill: tokens.axis },
    tickLine: false,
    axisLine: false,
  } as const;
}

/** Grid props — horizontal rules only; vertical ones add noise without information. */
export function gridProps(tokens: ChartTokens) {
  return {
    strokeDasharray: '3 3',
    stroke: tokens.grid,
    vertical: false,
  } as const;
}

/** Tooltip surface styling that matches the app's cards. */
export function tooltipProps(tokens: ChartTokens) {
  return {
    contentStyle: {
      background: tokens.tooltipBg,
      border: `1px solid ${tokens.tooltipBorder}`,
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: tokens.axis, fontSize: 11 },
    cursor: { stroke: tokens.grid, strokeWidth: 1 },
  } as const;
}

/** Pad a numeric domain by a percentage so the line never touches the frame. */
export function paddedDomain(values: number[], padPct = 0.05): [number, number] | undefined {
  if (values.length === 0) return undefined;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * padPct || Math.abs(max) * padPct || 1;
  return [min - pad, max + pad];
}
