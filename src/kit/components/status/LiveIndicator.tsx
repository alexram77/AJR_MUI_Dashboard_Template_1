/**
 * "Is this updating?" — a pulsing dot with a label.
 *
 * A streaming dashboard's most common support question is whether the numbers
 * on screen are current. This answers it without the user having to watch for
 * a value to change, and says plainly when the stream is paused or stale
 * rather than leaving a frozen page looking live.
 */
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { monoFamily } from '../../theme/styleTokens';
import { fmtAge } from '../../utils/format';

export type LiveState = 'live' | 'paused' | 'stale';

export interface LiveIndicatorProps {
  state: LiveState;
  /** Seconds since the last update, shown beside the label. */
  ageSeconds?: number | null;
  /** Override the label. Defaults to the state word. */
  label?: string;
  /** Hide the text and render the dot alone, for a tight top bar. */
  dotOnly?: boolean;
}

export function LiveIndicator({ state, ageSeconds, label, dotOnly = false }: LiveIndicatorProps) {
  const theme = useTheme();

  const color = {
    live: theme.palette.success.main,
    paused: theme.palette.text.disabled,
    stale: theme.palette.warning.main,
  }[state];

  const text = label ?? { live: 'LIVE', paused: 'PAUSED', stale: 'STALE' }[state];
  const tooltip = {
    live: 'Receiving updates',
    paused: 'Updates suspended — values are frozen at the last reading',
    stale: 'No update received within the expected interval',
  }[state];

  return (
    <Tooltip title={ageSeconds != null ? `${tooltip} · last ${fmtAge(ageSeconds)} ago` : tooltip}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, cursor: 'default' }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: color,
            // Only a live stream animates. A paused dot that pulses is a lie.
            ...(state === 'live' && {
              animation: 'livePulse 1.8s ease-in-out infinite',
              '@keyframes livePulse': {
                '0%,100%': { boxShadow: `0 0 0 0 ${color}`, opacity: 1 },
                '50%': { boxShadow: `0 0 0 4px ${color}00`, opacity: 0.65 },
              },
            }),
          }}
        />
        {!dotOnly && (
          <Typography
            variant="caption"
            sx={{ ...monoFamily, fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.6, color }}
          >
            {text}
            {ageSeconds != null && state !== 'live' && ` · ${fmtAge(ageSeconds)}`}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}
