/**
 * The three non-content states a panel can be in: loading, failed, empty.
 *
 * Centralised because they are where dashboards most often lie. An empty
 * result and a failed request look identical if both render "no data", and
 * that costs an afternoon of debugging the wrong layer — so the error state
 * always shows the error text, and the empty state says what is absent.
 */
import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { flexCenter } from '../../theme/styleTokens';

export interface StateBlockProps {
  loading?: boolean;
  /** Error message, shown verbatim. Never swallow it. */
  error?: string | null;
  /** True when the request succeeded and returned nothing. */
  empty?: boolean;
  /** What is missing and why, e.g. "No runs recorded since the last deploy." */
  emptyMessage?: string;
  /** Optional call to action for the empty state. */
  emptyAction?: ReactNode;
  /** Rendered when none of the three states apply. */
  children?: ReactNode;
}

export function StateBlock({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'Nothing here yet.',
  emptyAction,
  children = null,
}: StateBlockProps) {
  if (loading) return <LinearProgress />;

  if (error) {
    return (
      <Alert severity="error" variant="outlined">
        {error}
      </Alert>
    );
  }

  if (empty) {
    return (
      <Box sx={{ ...flexCenter, flexDirection: 'column', gap: 1.5, py: 4, px: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
        {emptyAction}
      </Box>
    );
  }

  return <>{children}</>;
}
