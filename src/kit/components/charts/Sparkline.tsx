/**
 * Inline trend line with no axes, grid or tooltip.
 *
 * Sized to sit inside a StatCard. It shows shape only — never read a value off
 * a sparkline; that is what the headline number beside it is for.
 */
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import { useChartTokens } from '../../theme/chartTokens';

export interface SparklineProps {
  data: number[];
  /** Direction of travel, which picks the colour. */
  trend?: 'up' | 'down' | 'flat';
  /** Explicit colour, overriding `trend`. */
  color?: string;
  height?: number;
}

export function Sparkline({ data, trend = 'flat', color, height = 48 }: SparklineProps) {
  const tokens = useChartTokens();

  const trendColor =
    color ?? (trend === 'up' ? tokens.positive : trend === 'down' ? tokens.negative : tokens.neutral);

  // Recharts needs objects; a bare number[] is the friendlier caller API.
  const rows = data.map((value, index) => ({ index, value }));
  // Gradient ids must be unique per colour, or the first one wins page-wide.
  const gradientId = `spark-${trendColor.replace(/[^a-z0-9]/gi, '')}`;

  if (rows.length === 0) return <Box sx={{ height }} />;

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
