/**
 * Stacked-or-overlaid area chart with a gradient fill.
 *
 * The default for "a quantity over time" — the fill carries magnitude in a way
 * a bare line does not.
 */
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTokens, seriesColor } from '../../theme/chartTokens';
import { CHART_MARGIN, axisProps, gridProps, paddedDomain, tooltipProps } from './chartDefaults';
import { ChartFrame } from './ChartFrame';
import type { SeriesChartProps } from './types';

export interface AreaSeriesChartProps extends SeriesChartProps {
  /** Stack the areas instead of overlaying them. */
  stacked?: boolean;
}

export function AreaSeriesChart({
  rows,
  xKey,
  series,
  height = 280,
  loading = false,
  yFormat,
  xFormat,
  showLegend,
  stacked = false,
  emptyMessage,
}: AreaSeriesChartProps) {
  const tokens = useChartTokens();
  const legend = showLegend ?? series.length > 1;

  // Domain is computed across every plotted series so overlaid lines share a scale.
  const values = rows.flatMap((row) =>
    series.map((spec) => row[spec.key]).filter((value): value is number => typeof value === 'number'),
  );

  return (
    <ChartFrame
      height={height}
      loading={loading}
      empty={rows.length === 0}
      emptyMessage={emptyMessage}
    >
      <AreaChart data={rows} margin={CHART_MARGIN}>
        <defs>
          {series.map((spec, index) => {
            const color = spec.color ?? seriesColor(index);
            return (
              <linearGradient key={spec.key} id={`area-${spec.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>

        <CartesianGrid {...gridProps(tokens)} />
        <XAxis dataKey={xKey} {...axisProps(tokens)} interval="preserveStartEnd" tickFormatter={xFormat} />
        <YAxis
          {...axisProps(tokens)}
          width={64}
          domain={stacked ? undefined : paddedDomain(values)}
          tickFormatter={yFormat}
        />
        <Tooltip {...tooltipProps(tokens)} />
        {legend && <Legend wrapperStyle={{ fontSize: 11, color: tokens.axis }} />}

        {series.map((spec, index) => {
          const color = spec.color ?? seriesColor(index);
          return (
            <Area
              key={spec.key}
              type="monotone"
              dataKey={spec.key}
              name={spec.label ?? spec.key}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={spec.dashed ? '4 3' : undefined}
              fill={`url(#area-${spec.key})`}
              stackId={stacked ? 'stack' : undefined}
              dot={false}
              activeDot={{ r: 4, fill: color }}
              isAnimationActive={false}
            />
          );
        })}
      </AreaChart>
    </ChartFrame>
  );
}
