/**
 * Service health indicator — a coloured dot with an optional label.
 *
 * `checking` is a distinct state from `down`: a check that has not completed
 * must not be drawn as a failure.
 */
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { monoFamily } from '../../theme/styleTokens';
import { BADGE_SIZING, DOT_SIZE } from '../../theme/sizing';
import { shouldGlow, stateColor } from './indicatorTokens';
import type { IndicatorState } from './indicatorTokens';

/** Alias kept for readability at call sites that talk about services. */
export type ServiceState = IndicatorState;

export interface StatusDotProps {
  /** Service name — shown as the label and in the tooltip. */
  name: string;
  state: ServiceState;
  /** Extra tooltip detail: latency, last error, endpoint. */
  detail?: string;
  /** Hide the text label (useful in tight top bars). */
  hideLabel?: boolean;
}

export function StatusDot({ name, state, detail, hideLabel = false }: StatusDotProps) {
  const theme = useTheme();

  // Colour and glow both come from the shared indicator tokens, so this dot
  // can never disagree with a chip or badge reporting the same state.
  const color = stateColor(theme, state);
  const glow = shouldGlow(state);

  return (
    <Tooltip title={`${name}${detail ? `: ${detail}` : ''}`} placement="bottom">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
        <Box
          sx={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: color,
            // Reporting states glow in their own colour; `checking` and
            // `disabled` stay flat, which is what makes them read as inert.
            boxShadow: glow ? `0 0 6px ${color}` : 'none',
            transition: 'background-color 0.3s, box-shadow 0.3s',
          }}
        />
        {!hideLabel && (
          <Typography
            variant="caption"
            sx={{
              ...monoFamily,
              fontSize: BADGE_SIZING.fontSize,
              // A healthy service names itself quietly; anything else is worth
              // reading, so it takes the state's colour and more weight.
              color: state === 'ok' ? 'text.secondary' : color,
              fontWeight: state === 'ok' ? 400 : 600,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            {name}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}
