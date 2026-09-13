/**
 * How old the data behind a panel is.
 *
 * Green within budget, amber once past it. A missing timestamp renders a
 * neutral em dash — an unknown age is not a fresh one, and must not be
 * coloured as if it were.
 */
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { ageSeconds, fmtAge, fmtDateTime } from '../../utils/format';

export interface FreshnessChipProps {
  /** ISO timestamp the artefact was produced. */
  asof: string | null | undefined;
  /** Freshness budget in seconds; older than this turns the chip amber. */
  budgetSeconds: number;
  /** Prefix, e.g. "grades" renders "grades 3h". */
  label?: string;
}

export function FreshnessChip({ asof, budgetSeconds, label }: FreshnessChipProps) {
  const prefix = label ? `${label} ` : '';
  const age = ageSeconds(asof);

  if (age === null) {
    return <Chip size="small" variant="outlined" label={`${prefix}—`} />;
  }

  const stale = age > budgetSeconds;

  return (
    <Tooltip title={`as of ${fmtDateTime(asof)}`}>
      <Chip
        size="small"
        variant="outlined"
        color={stale ? 'warning' : 'success'}
        label={`${prefix}${fmtAge(age)}`}
      />
    </Tooltip>
  );
}
