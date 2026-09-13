/**
 * Horizontal status strip — an uppercase caption, a wrapping row of
 * indicators, and an optional right-aligned slot (a clock, a refresh button).
 *
 * Used for the "services / storage / connection" bars that sit above page
 * content.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sectionLabel } from '../../theme/styleTokens';

export interface StatusBarProps {
  label: string;
  children: ReactNode;
  right?: ReactNode;
  /** Gap between indicators, in theme spacing units. */
  gap?: number;
}

export function StatusBar({ label, children, right, gap = 2 }: StatusBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        // Wrap on a phone: a label plus four badges does not fit 320px in one
        // line. From sm up this is the single nowrap row it has always been.
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        rowGap: { xs: 1, sm: 0 },
        px: { xs: 1.5, sm: 2 },
        py: 1,
        minHeight: 64,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        sx={{
          ...sectionLabel,
          mr: 2,
          letterSpacing: 1,
          flexShrink: 0,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap, flex: 1, minWidth: 0 }}>
        {children}
      </Box>

      {right && <Box sx={{ pl: { xs: 0, sm: 2 }, flexShrink: 0 }}>{right}</Box>}
    </Box>
  );
}
