/**
 * A single headline number with its label and optional supporting line.
 *
 * The plainest card in the kit — no chart, no trend. Use it in a Grid row for
 * the "four numbers at the top of the page" pattern.
 */
import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface MetricCardProps {
  label: string;
  /** Pre-formatted — the card does no formatting of its own. */
  value: string;
  /** Supporting line beneath the value: a comparison, a window, a caveat. */
  helper?: string;
  /** Right-aligned badge beside the label — a TrendChip, a FreshnessChip. */
  badge?: ReactNode;
}

export function MetricCard({ label, value, helper, badge }: MetricCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
            {badge}
          </Stack>

          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            {value}
          </Typography>

          {helper && (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
