/**
 * Chart colour + geometry tokens.
 *
 * Charting libraries cannot read MUI palette tokens, so this hook resolves the
 * live theme into plain values a chart can consume. Every chart in the kit
 * pulls its colours from here — which is what keeps a Recharts area, an SVG
 * meter and a MUI Chip the same shade of teal in both schemes.
 *
 * Swapping charting libraries means rewriting `components/charts/*` only;
 * this file is the stable contract between the theme and whatever renders.
 *
 * The values follow the active colour scheme. With CSS variables on,
 * `theme.palette` always holds the default (dark) scheme, so the scheme comes
 * from `useColorScheme()` and the colours from `theme.colorSchemes[scheme]`.
 */
import { useColorScheme, useTheme } from '@mui/material/styles';
import { statusColors } from './themePrimitives';

export type ChartScheme = 'light' | 'dark';

export interface ChartTokens {
  /** Ordered categorical series colours — index 0 is the primary series. */
  series: readonly string[];
  /** Axis tick labels and legend text. */
  axis: string;
  /** Grid lines and axis rules. */
  grid: string;
  /** Tooltip surface. */
  tooltipBg: string;
  tooltipBorder: string;
  /** Directional colours for gains/losses. */
  positive: string;
  negative: string;
  neutral: string;
  /** Standard tick font size, in px. */
  tickFontSize: number;
}

/**
 * Categorical series colours, one step per scheme.
 *
 * Validated with the dataviz palette checks (OKLCH lightness band and chroma
 * floor, adjacent-pair colour-blind separation under protan/deutan
 * simulation, a normal-vision floor, contrast) against the kit's surfaces,
 * #ffffff light and #191919 dark:
 *   light  worst adjacent CVD ΔE 16.3, normal 19.6; slots 4 and 5 (amber,
 *          magenta) are under 3:1 on white, so a chart using them must name
 *          its series in a legend or labels (every kit chart does).
 *   dark   worst adjacent CVD ΔE 13.0, normal 19.3; all 8 ≥ 3:1.
 *   The first three slots also pass with every pair compared (charts where
 *   any two series can touch, such as x/y/z traces).
 *
 * Order matters: it is what keeps neighbours apart for colour-blind readers,
 * so assign series in order and never skip or cycle a slot. Slot 1 is the
 * brand teal. Status hues (red, green, amber) sit late, so a chart's first
 * series never reads as an alarm. The earlier ramp reused the status colours
 * and failed the checks in both schemes (green next to amber, ΔE 5.0).
 */
export const CHART_SERIES: Record<ChartScheme, readonly string[]> = {
  //       teal       orange     indigo     amber      magenta    green      blue       red
  light: ['#029cb1', '#eb6834', '#6250d6', '#eda100', '#e87ba4', '#008300', '#2a78d6', '#e34948'],
  dark:  ['#029cb1', '#d95926', '#9085e9', '#c98500', '#d55181', '#008300', '#3987e5', '#e66767'],
};

/** The active colour scheme, resolved (never 'system'). */
export function useChartScheme(): ChartScheme {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  return colorScheme ?? theme.palette.mode;
}

/** Resolve the current theme into chart-ready values. */
export function useChartTokens(): ChartTokens {
  const theme = useTheme();
  const scheme = useChartScheme();
  // `colorSchemes` exists at runtime on a CSS-variables theme; MUI's base
  // `Theme` type doesn't declare it.
  const schemes = (theme as typeof theme & {
    colorSchemes?: Partial<Record<ChartScheme, { palette: typeof theme.palette }>>;
  }).colorSchemes;
  const palette = schemes?.[scheme]?.palette ?? theme.palette;
  return {
    series: CHART_SERIES[scheme],
    axis: palette.text.secondary,
    grid: palette.divider,
    tooltipBg: palette.background.paper,
    tooltipBorder: palette.divider,
    positive: palette.success.main,
    negative: palette.error.main,
    neutral: statusColors.neutral,
    tickFontSize: 11,
  };
}

/** Pick a series colour by index. Past the last slot it wraps; prefer folding
 *  extra series into "Other" over relying on that. */
export function seriesColor(index: number, scheme: ChartScheme = 'dark'): string {
  const ramp = CHART_SERIES[scheme];
  return ramp[index % ramp.length];
}
