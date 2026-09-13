/**
 * Feedback components — Alert, LinearProgress, CircularProgress, Dialog,
 * Skeleton, Snackbar.
 */
import type { Components, Theme } from '@mui/material/styles';

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: '0.82rem',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        alignItems: 'center',
      }),
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: { height: 6, borderRadius: 4 },
      bar: { borderRadius: 4 },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundImage: 'none',
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
      }),
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: { fontWeight: 700, fontSize: '1rem' },
    },
  },

  MuiDialogActions: {
    styleOverrides: {
      root: { paddingInline: 24, paddingBottom: 16 },
    },
  },

  MuiSkeleton: {
    defaultProps: { animation: 'wave' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: (theme.vars || theme).palette.action.hover,
      }),
    },
  },
};
