/**
 * Headline metric with a trend badge and a sparkline.
 *
 * The dashboard-overview card: current value, how it moved, and the shape of
 * how it got there. When there is no history to plot, use `MetricCard` — an
 * empty sparkline slot looks like a rendering failure.
 */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Sparkline } from '../charts/Sparkline';
import { TrendChip } from '../status/TrendChip';

export interface StatCardProps {
  title: string;
  /** Pre-formatted headline value. */
  value: string;
  /** Pre-formatted change, e.g. "+12.4%". Omit to hide the badge. */
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  /** Flip the trend colours for metrics where down is good. */
  invertTrendColors?: boolean;
  /** What window the value covers, e.g. "Last 30 days". */
  interval?: string;
  /** History behind the value. Omit to render without a sparkline. */
  data?: number[];
}

export function StatCard({
  title,
  value,
  change,
  trend = 'flat',
  invertTrendColors = false,
  interval,
  data,
}: StatCardProps) {
  // Invert the direction the sparkline colours by, not the direction itself,
  // so an improving latency reads green in both the chip and the line.
  const sparklineTrend =
    invertTrendColors && trend !== 'flat' ? (trend === 'up' ? 'down' : 'up') : trend;

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Typography component="h3" variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h4" component="p" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            {value}
          </Typography>
          {change && <TrendChip label={change} trend={trend} invertColors={invertTrendColors} />}
        </Stack>

        {interval && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {interval}
          </Typography>
        )}

        {data && data.length > 0 && (
          <Stack sx={{ mt: 'auto', pt: 1 }}>
            {/* The line carries the same good/bad reading as the chip. Passing
                the raw direction here would paint a green chip beside a red
                line on an inverted metric. */}
            <Sparkline data={data} trend={sparklineTrend} />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
