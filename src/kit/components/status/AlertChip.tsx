/**
 * Two-state safety chip — the thing that says "no leak" all day so that
 * "LEAK" is unmistakable when it appears.
 *
 * Both states are always rendered; the chip never disappears when clear. A
 * missing indicator reads as "not monitored", which is the opposite of the
 * reassurance it is there to give.
 */
import Chip from '@mui/material/Chip';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { alpha } from '@mui/material/styles';

export interface AlertChipProps {
  /** True when the condition being watched for has occurred. */
  active: boolean;
  /** Label while clear. */
  okLabel: string;
  /** Label while active. Shout here — this is the state that matters. */
  alertLabel: string;
  okTooltip?: string;
  alertTooltip?: string;
  /** Severity while active. `warning` for degraded, `error` for a fault. */
  severity?: 'warning' | 'error';
}

export function AlertChip({
  active,
  okLabel,
  alertLabel,
  okTooltip,
  alertTooltip,
  severity = 'error',
}: AlertChipProps) {
  return (
    <Chip
      icon={
        active ? (
          <WarningAmberRoundedIcon sx={{ fontSize: '0.85rem !important' }} />
        ) : (
          <CheckCircleRoundedIcon sx={{ fontSize: '0.85rem !important' }} />
        )
      }
      label={active ? alertLabel : okLabel}
      size="small"
      title={(active ? alertTooltip : okTooltip) ?? ''}
      sx={(theme) => {
        const color = active ? theme.palette[severity].main : theme.palette.success.main;
        return {
          fontWeight: 700,
          fontSize: '0.7rem',
          bgcolor: alpha(color, 0.12),
          color,
          border: '1px solid',
          borderColor: alpha(color, 0.31),
          '& .MuiChip-icon': { color },
          ...(active && {
            animation: 'alertChipPulse 1.5s ease-in-out infinite',
            '@keyframes alertChipPulse': {
              '0%,100%': { borderColor: alpha(color, 0.31) },
              '50%': { borderColor: alpha(color, 0.73) },
            },
          }),
        };
      }}
    />
  );
}
