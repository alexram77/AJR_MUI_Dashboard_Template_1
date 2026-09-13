/**
 * Grouped or stacked bar chart, for categorical comparisons and counts.
 */
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTokens, seriesColor } from '../../theme/chartTokens';
import { CHART_MARGIN, axisProps, gridProps, tooltipProps } from './chartDefaults';
import { ChartFrame } from './ChartFrame';
import type { SeriesChartProps } from './types';

export interface BarSeriesChartProps extends SeriesChartProps {
  /** Stack the bars instead of grouping them side by side. */
  stacked?: boolean;
  /** Horizontal bars — better when category labels are long. */
  horizontal?: boolean;
}

export function BarSeriesChart({
  rows,
  xKey,
  series,
  height = 280,
  loading = false,
  yFormat,
  xFormat,
  showLegend,
  stacked = false,
  horizontal = false,
  emptyMessage,
}: BarSeriesChartProps) {
  const tokens = useChartTokens();
  const legend = showLegend ?? series.length > 1;

  return (
    <ChartFrame height={height} loading={loading} empty={rows.length === 0} emptyMessage={emptyMessage}>
      <BarChart data={rows} margin={CHART_MARGIN} layout={horizontal ? 'vertical' : 'horizontal'}>
        <CartesianGrid {...gridProps(tokens)} vertical={horizontal} horizontal={!horizontal} />

        {horizontal ? (
          <>
            <XAxis type="number" {...axisProps(tokens)} tickFormatter={yFormat} />
            <YAxis type="category" dataKey={xKey} {...axisProps(tokens)} width={110} tickFormatter={xFormat} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps(tokens)} interval="preserveStartEnd" tickFormatter={xFormat} />
            <YAxis {...axisProps(tokens)} width={64} tickFormatter={yFormat} />
          </>
        )}

        <Tooltip {...tooltipProps(tokens)} cursor={{ fill: tokens.grid, fillOpacity: 0.3 }} />
        {legend && <Legend wrapperStyle={{ fontSize: 11, color: tokens.axis }} />}

        {series.map((spec, index) => (
          <Bar
            key={spec.key}
            dataKey={spec.key}
            name={spec.label ?? spec.key}
            fill={spec.color ?? seriesColor(index)}
            stackId={stacked ? 'stack' : undefined}
            radius={stacked ? 0 : [3, 3, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartFrame>
  );
}
