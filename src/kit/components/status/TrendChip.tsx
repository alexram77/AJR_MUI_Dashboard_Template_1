/**
 * Signed change badge — green up, red down, neutral flat.
 *
 * Takes a pre-formatted string so the caller decides whether the number is a
 * percentage, points, or an absolute delta.
 */
import Chip from '@mui/material/Chip';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

export interface TrendChipProps {
  /** Pre-formatted change, e.g. "+4.2%". */
  label: string;
  /** Direction. Derive it from the raw number at the call site. */
  trend: 'up' | 'down' | 'flat';
  /**
   * Flip the colour mapping for metrics where down is good — error rate,
   * latency, cost. Without this a 40% latency drop renders red.
   */
  invertColors?: boolean;
  variant?: 'filled' | 'outlined';
}

export function TrendChip({ label, trend, invertColors = false, variant = 'filled' }: TrendChipProps) {
  const good = invertColors ? trend === 'down' : trend === 'up';
  const bad = invertColors ? trend === 'up' : trend === 'down';
  const color = trend === 'flat' ? 'default' : good ? 'success' : bad ? 'error' : 'default';

  const Icon =
    trend === 'up' ? ArrowDropUpRoundedIcon : trend === 'down' ? ArrowDropDownRoundedIcon : RemoveRoundedIcon;

  return (
    <Chip
      size="small"
      variant={variant}
      color={color}
      icon={<Icon sx={{ fontSize: '1rem' }} />}
      label={label}
      sx={{ '& .MuiChip-icon': { ml: 0.25, mr: -0.5 } }}
    />
  );
}
