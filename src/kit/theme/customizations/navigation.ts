/**
 * Navigation components — Tabs, BottomNavigation, Link, Breadcrumbs, Menu.
 *
 * Tabs are compact (40px) because they sit inside page cards, not above them.
 */
import type { Components, Theme } from '@mui/material/styles';

/** Canonical in-card tab bar height. Shared by PageTabs and the theme. */
export const TAB_HEIGHT = 40;

/** Tap-target minimum on touch. See `customizations/inputs.ts` for why this is
 *  keyed on pointer type rather than viewport width. */
const TOUCH_TARGET = 44;

export const navigationCustomizations: Components<Theme> = {
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: TAB_HEIGHT,
        '@media (pointer: coarse)': { minHeight: TOUCH_TARGET },
      },
      indicator: { height: 2 },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontSize: '0.8rem',
        fontWeight: 500,
        minHeight: TAB_HEIGHT,
        padding: '6px 12px',
        '@media (pointer: coarse)': { minHeight: TOUCH_TARGET, padding: '10px 14px' },
      },
    },
  },

  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 56,
        backgroundColor: (theme.vars || theme).palette.background.paper,
      }),
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        paddingInline: 4,
        color: (theme.vars || theme).palette.text.secondary,
      }),
      label: {
        fontSize: '0.65rem',
        '&.Mui-selected': { fontSize: '0.65rem' },
      },
    },
  },

  MuiLink: {
    defaultProps: { underline: 'hover' },
    styleOverrides: {
      root: { fontWeight: 500 },
    },
  },

  MuiBreadcrumbs: {
    styleOverrides: {
      root: { fontSize: '0.8rem' },
      separator: { marginInline: 6 },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: { fontSize: '0.85rem', minHeight: 34 },
    },
  },
};
