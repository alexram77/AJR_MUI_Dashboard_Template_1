/**
 * Chart data contracts.
 *
 * Charts take plain rows plus a declaration of which keys to plot. Keeping the
 * shape this generic is what lets one chart component serve every page instead
 * of each page growing its own.
 */

/** One row of chart data. `x` is the category/time axis value. */
export type ChartRow = Record<string, string | number | null | undefined>;

/** One plotted series. */
export interface SeriesSpec {
  /** Key into each row. */
  key: string;
  /** Legend and tooltip label. Defaults to `key`. */
  label?: string;
  /** Override the ramp colour for this series. */
  color?: string;
  /** Dashed stroke, for benchmarks and projections. */
  dashed?: boolean;
}

/** Shared props for every series chart in the kit. */
export interface SeriesChartProps {
  rows: ChartRow[];
  /** Row key holding the x-axis value. */
  xKey: string;
  series: SeriesSpec[];
  height?: number | Record<string, number>;
  loading?: boolean;
  /** Y-axis tick formatter — pass one of the `fmt*` helpers. */
  yFormat?: (value: number) => string;
  /** X-axis tick formatter. */
  xFormat?: (value: string | number) => string;
  /** Show the legend. Defaults to true when there is more than one series. */
  showLegend?: boolean;
  emptyMessage?: string;
}
