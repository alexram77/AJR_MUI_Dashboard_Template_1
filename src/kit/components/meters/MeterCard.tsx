/**
 * Frame around a meter: label above, the meter itself, the numeric reading and
 * unit below.
 *
 * The meters draw only their own geometry, so this is what gives a row of
 * mixed gauge/level/thermometer tiles a consistent footprint.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { captionMuted, monoFamily } from '../../theme/styleTokens';
import { EMPTY } from '../../utils/format';

export interface MeterCardProps {
  label: string;
  /** The meter element. */
  children: ReactNode;
  /** Current reading. Omit for a meter whose value is self-evident. */
  value?: number | null;
  unit?: string;
  /** Decimal places for the reading. */
  decimals?: number;
}

export function MeterCard({ label, children, value, unit, decimals = 1 }: MeterCardProps) {
  const reading =
    value === null || value === undefined || Number.isNaN(value) ? EMPTY : value.toFixed(decimals);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        height: '100%',
      }}
    >
      <Typography sx={{ ...captionMuted, textAlign: 'center', letterSpacing: '0.04em' }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        {children}
      </Box>

      {value !== undefined && (
        <Typography sx={{ ...monoFamily, fontSize: '0.95rem', fontWeight: 700 }}>
          {reading}
          {unit && (
            <Typography component="span" sx={{ ...captionMuted, ml: 0.5, fontSize: '0.7rem' }}>
              {unit}
            </Typography>
          )}
        </Typography>
      )}
    </Box>
  );
}
