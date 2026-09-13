/**
 * Sized, responsive wrapper every chart renders into.
 *
 * Recharts' ResponsiveContainer needs a parent with a resolved height; this
 * supplies one and handles the two states a chart must never fake — no data,
 * and still loading.
 */
import type { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { ResponsiveContainer } from 'recharts';
import { flexCenter } from '../../theme/styleTokens';

export interface ChartFrameProps {
  /** Height in px, or a responsive object. */
  height?: number | Record<string, number>;
  loading?: boolean;
  /** True when there is genuinely nothing to plot. */
  empty?: boolean;
  /** Message for the empty state. Say what is missing, not "no data". */
  emptyMessage?: string;
  children: ReactElement;
}

export function ChartFrame({
  height = 280,
  loading = false,
  empty = false,
  emptyMessage = 'Nothing to plot for this selection.',
  children,
}: ChartFrameProps) {
  if (loading) {
    return <Skeleton variant="rounded" sx={{ height, width: '100%' }} />;
  }

  if (empty) {
    return (
      <Box sx={{ ...flexCenter, height, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </Box>
  );
}
