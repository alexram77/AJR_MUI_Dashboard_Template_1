/**
 * Controls row for `<PageContainer toolbar={...}>` — filters, status chips and
 * actions for the page as a whole.
 *
 * Deliberately carries no title or description: those live in the top bar,
 * resolved from the nav declaration. A page that restates its own name inside
 * its card spends a band of vertical space saying what the bar already says.
 */
import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import { ActionButton } from '../buttons';

export interface PageToolbarProps {
  /** The controls themselves — buttons, chips, switches, filters. */
  children?: ReactNode;
  /** Shorthand for a single primary button; rendered after `children`. */
  actionLabel?: string;
  onAction?: () => void;
}

export function PageToolbar({ children, actionLabel, onAction }: PageToolbarProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      // Left on mobile, where the row is the only thing on its line; right on
      // desktop, where it reads as the card's controls rather than its content.
      justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
      flexWrap="wrap"
      useFlexGap
    >
      {children}
      {actionLabel && (
        <ActionButton intent="primary" onClick={onAction}>
          {actionLabel}
        </ActionButton>
      )}
    </Stack>
  );
}
