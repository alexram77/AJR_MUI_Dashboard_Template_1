/**
 * Data-display components — Chip, Table, Tooltip, Divider, Avatar, List.
 *
 * Table heads get the uppercase micro-caption treatment app-wide so a raw
 * `<TableHead>` already looks right with no extra styling at the call site.
 */
import type { Components, Theme } from '@mui/material/styles';
import { monoFontFamily } from '../themePrimitives';

export const dataDisplayCustomizations: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 600 },
      sizeSmall: { height: 22, fontSize: '0.68rem' },
      label: { paddingInline: 8 },
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: { fontSize: '0.72rem', fontWeight: 500, maxWidth: 320 },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: (theme.vars || theme).palette.divider }),
    },
  },

  MuiTable: {
    defaultProps: { size: 'small' },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: (theme.vars || theme).palette.divider,
        fontSize: '0.8rem',
      }),
      head: ({ theme }) => ({
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: (theme.vars || theme).palette.text.secondary,
        whiteSpace: 'nowrap',
      }),
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&:hover': { backgroundColor: (theme.vars || theme).palette.action.hover },
        '&:last-child td': { borderBottom: 0 },
      }),
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        // Sidebar and command-rail rows are the most-tapped targets in the
        // app. Coarse pointers only — a mouse keeps the dense row height.
        '@media (pointer: coarse)': { minHeight: 44 },
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: { minWidth: 36 },
    },
  },

  MuiTypography: {
    styleOverrides: {
      // Opt-in monospace without a custom variant declaration:
      // <Typography className="mono">…</Typography>
      root: { '&.mono': { fontFamily: monoFontFamily } },
    },
  },
};
