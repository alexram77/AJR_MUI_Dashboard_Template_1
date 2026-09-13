/**
 * Multi-series line chart.
 *
 * Prefer this over an area chart when several series must be compared against
 * each other — overlapping fills obscure crossings.
 */
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTokens, seriesColor } from '../../theme/chartTokens';
import { CHART_MARGIN, axisProps, gridProps, paddedDomain, tooltipProps } from './chartDefaults';
import { ChartFrame } from './ChartFrame';
import type { SeriesChartProps } from './types';

export function LineSeriesChart({
  rows,
  xKey,
  series,
  height = 280,
  loading = false,
  yFormat,
  xFormat,
  showLegend,
  emptyMessage,
}: SeriesChartProps) {
  const tokens = useChartTokens();
  const legend = showLegend ?? series.length > 1;

  const values = rows.flatMap((row) =>
    series.map((spec) => row[spec.key]).filter((value): value is number => typeof value === 'number'),
  );

  return (
    <ChartFrame height={height} loading={loading} empty={rows.length === 0} emptyMessage={emptyMessage}>
      <LineChart data={rows} margin={CHART_MARGIN}>
        <CartesianGrid {...gridProps(tokens)} />
        <XAxis dataKey={xKey} {...axisProps(tokens)} interval="preserveStartEnd" tickFormatter={xFormat} />
        <YAxis {...axisProps(tokens)} width={64} domain={paddedDomain(values)} tickFormatter={yFormat} />
        <Tooltip {...tooltipProps(tokens)} />
        {legend && <Legend wrapperStyle={{ fontSize: 11, color: tokens.axis }} />}

        {series.map((spec, index) => {
          const color = spec.color ?? seriesColor(index);
          return (
            <Line
              key={spec.key}
              type="monotone"
              dataKey={spec.key}
              name={spec.label ?? spec.key}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={spec.dashed ? '4 3' : undefined}
              dot={false}
              activeDot={{ r: 4, fill: color }}
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ChartFrame>
  );
}
