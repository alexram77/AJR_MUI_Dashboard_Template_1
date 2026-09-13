/**
 * One storage volume: label, free space, a usage bar, and the raw totals.
 *
 * Headlines *free* space rather than used, because that is the number that
 * decides whether the next capture fits. A volume with no quota shows an
 * empty track and says "unlimited" instead of drawing a misleading full bar.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ellipsis } from '../../theme/styleTokens';
import { fmtBytes } from '../../utils/format';
import { toneForThresholds, toneToColor } from '../../utils/color';

export interface StorageMeterRowProps {
  label: string;
  used: number;
  /** Null when the volume has no quota. */
  total?: number | null;
  /** Overrides `total - used` when the source reports free space directly. */
  free?: number | null;
  icon?: ReactNode;
  /** Extra qualifier appended to the label, e.g. 'data', 'archive'. */
  tag?: string;
  /** Percentages at which the bar turns amber / red. */
  warnAtPct?: number;
  criticalAtPct?: number;
}

export function StorageMeterRow({
  label,
  used,
  total = null,
  free = null,
  icon,
  tag,
  warnAtPct = 75,
  criticalAtPct = 90,
}: StorageMeterRowProps) {
  const pct = total !== null && total > 0 ? Math.min(100, (used / total) * 100) : null;
  const freeBytes = free ?? (total !== null ? total - used : null);

  const tone = pct !== null ? toneForThresholds(pct, warnAtPct, criticalAtPct) : 'ok';
  const color = toneToColor(tone);
  const barColor = color === 'default' ? 'success' : color;

  const tooltip =
    total !== null
      ? `${fmtBytes(used)} of ${fmtBytes(total)} used (${pct!.toFixed(0)}%)`
      : `${fmtBytes(used)} used — no quota`;

  return (
    <Box sx={{ flex: '1 1 180px', minWidth: 160, maxWidth: 300 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
        {icon && <Box sx={{ display: 'flex', color: 'text.secondary', fontSize: '0.95rem' }}>{icon}</Box>}

        <Typography sx={{ ...ellipsis, fontSize: '0.72rem', fontWeight: 600, flex: 1 }}>
          {label}
          {tag ? ` · ${tag}` : ''}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.66rem',
            flexShrink: 0,
            color: tone === 'bad' ? 'error.main' : 'text.secondary',
          }}
        >
          {freeBytes !== null ? `${fmtBytes(freeBytes)} free` : `${fmtBytes(used)} used`}
        </Typography>
      </Box>

      <Tooltip title={tooltip}>
        <LinearProgress
          variant="determinate"
          value={pct ?? 0}
          color={barColor}
          sx={{
            height: 6,
            borderRadius: 1,
            bgcolor: 'action.hover',
            // No quota means no meaningful fill — hide the bar rather than
            // draw a zero that reads as "empty disk".
            ...(pct === null && { '& .MuiLinearProgress-bar': { display: 'none' } }),
          }}
        />
      </Tooltip>

      <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', mt: 0.25 }}>
        {total !== null ? `${fmtBytes(used)} / ${fmtBytes(total)}` : 'unlimited'}
      </Typography>
    </Box>
  );
}
