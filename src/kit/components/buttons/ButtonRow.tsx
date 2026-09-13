/**
 * A row of buttons with the house spacing and wrapping behaviour.
 *
 * Exists because every page otherwise grows its own
 * `<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>`, and they
 * drift. It also solves the mobile case in one place: below `sm` the row
 * stacks and the buttons go full width, which is what makes a three-action
 * toolbar usable on a phone without touching the desktop layout.
 */
import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ButtonRowProps {
  children: ReactNode;
  /** Gap in theme units. */
  gap?: number;
  /** Push the row to the right. */
  align?: 'start' | 'end' | 'center' | 'between';
  /**
   * Stack vertically and stretch to full width below `sm`. Default true —
   * turn it off only for a row of two or three icon buttons that already fit.
   */
  stackOnMobile?: boolean;
  sx?: SxProps<Theme>;
}

const JUSTIFY = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
} as const;

export function ButtonRow({
  children,
  gap = 1,
  align = 'start',
  stackOnMobile = true,
  sx,
}: ButtonRowProps) {
  return (
    <Stack
      direction={stackOnMobile ? { xs: 'column', sm: 'row' } : 'row'}
      spacing={gap}
      useFlexGap
      flexWrap="wrap"
      alignItems={stackOnMobile ? { xs: 'stretch', sm: 'center' } : 'center'}
      justifyContent={JUSTIFY[align]}
      sx={[
        stackOnMobile
          ? {
              // Full-width children on a phone only; from `sm` up the row is
              // exactly what it was before this rule existed.
              '& > *': { width: { xs: '100%', sm: 'auto' } },
            }
          : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as SxProps<Theme>}
    >
      {children}
    </Stack>
  );
}
