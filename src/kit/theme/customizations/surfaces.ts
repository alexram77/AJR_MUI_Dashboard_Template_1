/**
 * Surface components — Card, Paper, Accordion, AppBar, Drawer.
 *
 * House rule: surfaces are defined by a 1px divider border, never by elevation
 * or a background gradient. `backgroundImage: 'none'` kills MUI's default dark
 * overlay so `background.paper` is the literal colour you see.
 */
import type { Components, Theme } from '@mui/material/styles';

export const surfacesCustomizations: Components<Theme> = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },

  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: (theme.vars || theme).palette.background.paper,
        borderColor: (theme.vars || theme).palette.divider,
      }),
    },
  },

  MuiCardContent: {
    styleOverrides: {
      // Uniform breathing room; the last-child override removes MUI's extra
      // 24px bottom pad that makes stacked cards look lopsided.
      root: {
        padding: 16,
        '&:last-child': { paddingBottom: 16 },
      },
    },
  },

  MuiCardHeader: {
    styleOverrides: {
      root: { padding: 16, paddingBottom: 0 },
    },
  },

  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'transparent' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: (theme.vars || theme).palette.background.paper,
        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        color: (theme.vars || theme).palette.text.primary,
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: (theme.vars || theme).palette.background.paper,
      }),
    },
  },

  MuiAccordion: {
    defaultProps: { elevation: 0, disableGutters: true },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: (theme.vars || theme).palette.background.paper,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        overflow: 'clip',
        '&::before': { display: 'none' },
        '&:not(:last-of-type)': { borderBottom: 'none' },
      }),
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 44,
        '&:hover': { backgroundColor: (theme.vars || theme).palette.action.hover },
      }),
    },
  },
};
