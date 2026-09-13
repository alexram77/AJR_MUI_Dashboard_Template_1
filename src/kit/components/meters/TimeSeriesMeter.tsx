/**
 * Recent-history plot sized to sit in a meter slot.
 *
 * The `chart` meter type. Unlike `Sparkline` it takes timestamped points and
 * honours the channel's fixed scale, so switching a card between a gauge and a
 * chart does not silently rescale the reading.
 */
import Box from '@mui/material/Box';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { useTheme } from '@mui/material/styles';

export interface TimeSeriesMeterProps {
  /** Oldest first. */
  data: Array<{ time: number; value: number }>;
  /** Fixed scale. Omit either bound to let the data set it. */
  min?: number;
  max?: number;
  width?: number | string;
  height?: number;
  color?: string;
}

export function TimeSeriesMeter({
  data,
  min,
  max,
  width = 160,
  height = 90,
  color,
}: TimeSeriesMeterProps) {
  const theme = useTheme();
  const stroke = color ?? theme.palette.primary.main;

  if (data.length === 0) return <Box sx={{ width, height }} />;

  // Gradient ids must be unique per colour or the first definition on the page
  // wins for every chart that references the same id.
  const gradientId = `tsm-${stroke.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <Box sx={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[min ?? 'dataMin', max ?? 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
