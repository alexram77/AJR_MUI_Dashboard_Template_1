/**
 * Standalone empty state with an icon, a headline and an optional action.
 *
 * Use for a whole page or panel that has no content at all; `StateBlock`
 * covers the inline "this list is empty" case.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { flexCenter } from '../../theme/styleTokens';

export interface EmptyStateProps {
  title: string;
  /** What the user can do about it. */
  description?: string;
  /** Defaults to an inbox glyph. */
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Box sx={{ ...flexCenter, flexDirection: 'column', gap: 1.5, py: 6, px: 3, textAlign: 'center' }}>
      <Box sx={{ color: 'text.disabled', display: 'flex' }}>
        {icon ?? <InboxRoundedIcon sx={{ fontSize: '2.5rem' }} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440 }}>
          {description}
        </Typography>
      )}

      {action}
    </Box>
  );
}
