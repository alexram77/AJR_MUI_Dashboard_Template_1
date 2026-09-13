/**
 * Discrete-state readout — the tile that says OK / ACTIVE / FAULT rather than
 * plotting a number.
 *
 * States are declared by the caller, so this stays domain-agnostic: a leak
 * sensor, a queue status and a deploy gate all use the same component with
 * different state maps. A `bad` state pulses, because a fault that looks like
 * every other tile is a fault nobody sees.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import { withAlpha } from '../../utils/color';
import type { Tone } from '../../utils/color';

export interface MeterState {
  label: string;
  tone: Tone;
  /** Override the tone's default icon. */
  icon?: SvgIconComponent;
}

export interface StateMeterProps {
  /** Numeric or string key into `states`. */
  value: string | number;
  /** All states this meter can show, keyed by value. */
  states: Record<string | number, MeterState>;
  /** Shown when `value` matches no declared state — never invent a label. */
  unknownLabel?: string;
  /** Minimum tile height in px. */
  size?: number;
}

/** Default glyph per tone, when a state does not name one. */
const TONE_ICON: Record<Tone, SvgIconComponent> = {
  ok: CheckCircleRoundedIcon,
  warn: WarningAmberRoundedIcon,
  bad: WarningAmberRoundedIcon,
  neutral: RadioButtonUncheckedRoundedIcon,
};

export function StateMeter({ value, states, unknownLabel = 'UNKNOWN', size = 110 }: StateMeterProps) {
  const theme = useTheme();

  const state = states[value];
  const tone: Tone = state?.tone ?? 'neutral';
  const label = state?.label ?? unknownLabel;

  const color = {
    ok: theme.palette.success.main,
    warn: theme.palette.warning.main,
    bad: theme.palette.error.main,
    neutral: theme.palette.text.disabled,
  }[tone];

  const Icon = state?.icon ?? (state ? TONE_ICON[tone] : RadioButtonCheckedRoundedIcon);
  const pulsing = tone === 'bad';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: size,
        borderRadius: 2,
        border: '2px solid',
        borderColor: withAlpha(color, 0.33),
        bgcolor: withAlpha(color, 0.08),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        py: 1.5,
        transition: 'background-color 0.3s, border-color 0.3s',
        ...(pulsing && {
          animation: 'stateMeterPulse 1.4s ease-in-out infinite',
          '@keyframes stateMeterPulse': {
            '0%,100%': { borderColor: withAlpha(color, 0.27), bgcolor: withAlpha(color, 0.05) },
            '50%': { borderColor: withAlpha(color, 0.8), bgcolor: withAlpha(color, 0.13) },
          },
        }),
      }}
    >
      <Icon sx={{ fontSize: '1.8rem', color }} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color,
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.2,
          px: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
