/**
 * Input components — Button, IconButton, ToggleButton, TextField, Select.
 *
 * The `sizeSmall` overrides are load-bearing: every toolbar action in the app
 * uses `size="small"`, so pinning height + font size here is what keeps button
 * rows uniform across pages without per-component sx.
 */
import type { Components, Theme } from '@mui/material/styles';

/** Canonical small-control height. Shared by buttons, toggles and toolbar icons. */
export const SMALL_CONTROL_HEIGHT = 30;

/**
 * Tap-target minimum for touch input (WCAG 2.5.8, and what both the Apple and
 * Material guidelines ask for).
 *
 * Applied under `@media (pointer: coarse)` rather than at a width breakpoint.
 * That distinction matters: a mouse has fine-grained pointing regardless of
 * window size, so a desktop user dragging their browser narrow keeps the dense
 * controls, and a desktop layout can never be affected by these rules at all.
 */
export const TOUCH_TARGET = 44;

/** Applies a minimum hit area only where the pointer is imprecise. */
const coarsePointer = (styles: Record<string, unknown>) => ({
  '@media (pointer: coarse)': styles,
});

export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: { disableRipple: false },
  },

  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      sizeSmall: {
        fontSize: '0.72rem',
        minHeight: SMALL_CONTROL_HEIGHT,
        paddingInline: 10,
        ...coarsePointer({ minHeight: TOUCH_TARGET, paddingInline: 14 }),
      },
      sizeMedium: { fontSize: '0.82rem', minHeight: 36, ...coarsePointer({ minHeight: TOUCH_TARGET }) },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      sizeSmall: {
        width: SMALL_CONTROL_HEIGHT,
        height: SMALL_CONTROL_HEIGHT,
        ...coarsePointer({ width: TOUCH_TARGET, height: TOUCH_TARGET }),
      },
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600 },
      sizeSmall: {
        fontSize: '0.72rem',
        minHeight: SMALL_CONTROL_HEIGHT,
        paddingInline: 10,
        // Width too: a two-character option ("All", "1M") is otherwise under
        // the minimum however tall it is.
        ...coarsePointer({ minHeight: TOUCH_TARGET, minWidth: TOUCH_TARGET, paddingInline: 14 }),
      },
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: (theme.vars || theme).palette.background.paper,
      }),
    },
  },

  MuiTextField: {
    defaultProps: { size: 'small', variant: 'outlined' },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: { fontSize: '0.85rem' },
      input: { fontSize: '0.85rem' },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: { fontSize: '0.85rem' },
    },
  },

  MuiSelect: {
    defaultProps: { size: 'small' },
    styleOverrides: {
      select: { fontSize: '0.85rem' },
    },
  },

  MuiCheckbox: {
    defaultProps: { size: 'small' },
  },

  MuiSwitch: {
    defaultProps: { size: 'small' },
  },
};
