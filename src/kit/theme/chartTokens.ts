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
 */
import { useTheme } from '@mui/material/styles';
import { brand, statusColors } from './themePrimitives';

export interface ChartTokens {
  /** Ordered categorical series colours — index 0 is the primary series. */
  series: string[];
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
 * Categorical ramp. Ordered so adjacent series stay distinguishable in both
 * schemes and for the common forms of colour blindness: teal, indigo, amber,
 * green, red, violet, cyan, slate.
 */
const CATEGORICAL = [
  brand[400],
  '#5a6ee0',
  statusColors.warning,
  statusColors.success,
  statusColors.error,
  '#a855f7',
  brand[200],
  statusColors.neutral,
] as const;

/** Resolve the current theme into chart-ready values. */
export function useChartTokens(): ChartTokens {
  const theme = useTheme();
  return {
    series: [...CATEGORICAL],
    axis: theme.palette.text.secondary,
    grid: theme.palette.divider,
    tooltipBg: theme.palette.background.paper,
    tooltipBorder: theme.palette.divider,
    positive: theme.palette.success.main,
    negative: theme.palette.error.main,
    neutral: statusColors.neutral,
    tickFontSize: 11,
  };
}

/** Pick a series colour by index, wrapping around the ramp. */
export function seriesColor(index: number): string {
  return CATEGORICAL[index % CATEGORICAL.length];
}
