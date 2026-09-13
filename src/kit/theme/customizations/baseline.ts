/**
 * CssBaseline overrides — global element styles and the app-wide scrollbar.
 *
 * Kept separate from the component categories because it is the only
 * customization that reaches outside MUI components.
 *
 * The scrollbar rules here and `components/scroll/scrollbarTokens` are the
 * same values by construction: this applies the `thin` variant globally so
 * most surfaces need no styling at all, and a container that wants a different
 * bar calls `scrollbarSx()` for it.
 */
import type { Components, Theme } from '@mui/material/styles';

/** Global scrollbar size, matching the `thin` variant in the scroll library. */
const SCROLLBAR_SIZE = 8;

export const baselineCustomizations: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      '*': { boxSizing: 'border-box', scrollbarWidth: 'thin' },
      'html, body, #root': { height: '100%', margin: 0, padding: 0 },
      body: {
        // Opt out of the double scrollbar a 100dvh shell would otherwise get.
        overflow: 'hidden',
        // Stop iOS Safari inflating font sizes in landscape.
        WebkitTextSizeAdjust: '100%',
      },
      // Never let a long unbroken string (an id, a URL, a hash) force the
      // whole page to scroll sideways on a narrow screen.
      'p, span, div, td, th, li': { overflowWrap: 'anywhere' },

      '*::-webkit-scrollbar': { width: SCROLLBAR_SIZE, height: SCROLLBAR_SIZE },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: (theme.vars || theme).palette.divider,
        borderRadius: SCROLLBAR_SIZE / 2,
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: (theme.vars || theme).palette.text.disabled,
      },
      '*::-webkit-scrollbar-corner': { background: 'transparent' },
    }),
  },
};
