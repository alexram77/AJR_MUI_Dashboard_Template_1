/**
 * A labelled count that colours itself by whether the count is good news.
 *
 * The pattern behind every "7 healthy / 2 watch / 1 degraded" chip row. Zero
 * renders muted and outlined rather than hidden, because "0 failures" is
 * information and an absent chip is not.
 */
import Chip from '@mui/material/Chip';
import { toneToColor } from '../../utils/color';
import type { Tone } from '../../utils/color';

export interface CountBadgeProps {
  label: string;
  count: number;
  /** Semantic of a NON-ZERO count. Zero always renders neutral. */
  tone?: Tone;
  /**
   * Flip the emphasis: a count of zero is the good outcome (failures, alerts),
   * so a non-zero one fills in rather than staying outlined.
   */
  zeroIsGood?: boolean;
  onClick?: () => void;
}

export function CountBadge({
  label,
  count,
  tone = 'neutral',
  zeroIsGood = false,
  onClick,
}: CountBadgeProps) {
  const active = zeroIsGood ? count > 0 : count > 0;
  const color = count === 0 ? 'default' : toneToColor(tone);

  return (
    <Chip
      size="small"
      label={`${label} ${count}`}
      color={color}
      variant={active && count > 0 ? 'filled' : 'outlined'}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}
