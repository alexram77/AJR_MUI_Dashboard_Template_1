/**
 * Usage-against-capacity bar — disk, tokens, API budget, seats.
 *
 * Colour steps at the warn and critical thresholds so a full bar is visible
 * peripherally without reading the number.
 */
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { monoFamily } from '../../theme/styleTokens';
import { BADGE_SIZING } from '../../theme/sizing';
import { toneForThresholds, toneToColor } from '../../utils/color';

export interface QuotaBarProps {
  used: number;
  total: number;
  /** Formats both numbers for the label — `fmtBytes`, `fmtCompact`, etc. */
  format?: (value: number) => string;
  /** Leading caption, e.g. "STORAGE". */
  label?: string;
  /** Multi-line tooltip breakdown, e.g. per-bucket usage. */
  breakdown?: Array<[string, number]>;
  /** Percentages at which the bar turns amber / red. */
  warnAtPct?: number;
  criticalAtPct?: number;
  /** Compact inline form for a top bar, rather than a full-width banner. */
  dense?: boolean;
}

export function QuotaBar({
  used,
  total,
  format = (value) => String(value),
  label,
  breakdown,
  warnAtPct = 75,
  criticalAtPct = 90,
  dense = false,
}: QuotaBarProps) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = toneToColor(toneForThresholds(pct, warnAtPct, criticalAtPct));
  // `default` is not a LinearProgress colour; map it to the success track.
  const barColor = color === 'default' ? 'success' : color;

  const tooltip = breakdown?.length
    ? breakdown
        .slice()
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => `${name}: ${format(value)}`)
        .join('\n')
    : `${format(used)} of ${format(total)} (${pct.toFixed(0)}%)`;

  return (
    <Tooltip title={<span style={{ whiteSpace: 'pre' }}>{tooltip}</span>} placement="bottom">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: dense ? 0.75 : 2,
          width: '100%',
          cursor: 'default',
        }}
      >
        {label && (
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {label}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1, minWidth: dense ? 48 : 120 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(pct, 100)}
            color={barColor}
            sx={{ height: dense ? 5 : 6, borderRadius: 3 }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            ...monoFamily,
            fontSize: dense ? BADGE_SIZING.denseFontSize : BADGE_SIZING.fontSize,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {format(used)} / {format(total)}
        </Typography>
      </Box>
    </Tooltip>
  );
}
