/**
 * Pill badge: icon, label, and a tinted border in the colour of whatever it is
 * reporting.
 *
 * The denser cousin of `StatusDot` — use it where the state needs a word, not
 * just a colour ("Connected · 24 ms", "Demo mode", "LEAK DETECTED"). A badge
 * can pulse its border, which is reserved for conditions that want attention
 * now; a page with three pulsing badges has taught the operator to ignore all
 * three.
 */
import type { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export interface IndicatorBadgeProps {
  icon: ReactElement;
  label: string;
  /** Any CSS colour — a palette value, a device colour, a status constant. */
  color: string;
  tooltip?: string;
  /** Animate the border. Reserve for live alarms. */
  pulse?: boolean;
  /** Shrink for a top bar. */
  dense?: boolean;
}

export function IndicatorBadge({
  icon,
  label,
  color,
  tooltip,
  pulse = false,
  dense = false,
}: IndicatorBadgeProps) {
  const badge = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dense ? 0.5 : 0.75,
        px: dense ? 1 : 1.5,
        py: dense ? 0.25 : 0.5,
        borderRadius: 5,
        flexShrink: 0,
        bgcolor: alpha(color, 0.1),
        border: '1px solid',
        borderColor: alpha(color, 0.27),
        ...(pulse && {
          animation: 'indicatorPulse 1.5s ease-in-out infinite',
          '@keyframes indicatorPulse': {
            '0%,100%': { borderColor: alpha(color, 0.27) },
            '50%': { borderColor: alpha(color, 0.73) },
          },
        }),
      }}
    >
      <Box sx={{ color, display: 'flex', alignItems: 'center', fontSize: dense ? '0.85rem' : '0.95rem' }}>
        {icon}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color,
          fontWeight: pulse ? 700 : 600,
          fontSize: dense ? '0.66rem' : '0.72rem',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      <span style={{ display: 'inline-flex' }}>{badge}</span>
    </Tooltip>
  ) : (
    badge
  );
}
