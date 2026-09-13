/**
 * Scrollbar appearance, in one place.
 *
 * Browsers style scrollbars two incompatible ways: `::-webkit-scrollbar` rules
 * (Chrome, Safari, Edge) and the `scrollbar-*` standard properties (Firefox).
 * Every scrollable surface needs both, and hand-writing them is how a project
 * ends up with four different scrollbars. Build them from here instead.
 *
 * The theme's CssBaseline applies `thin` globally, so most surfaces need
 * nothing. Reach for these only when a specific container wants `overlay`
 * (a dark panel), `hidden` (a carousel), or a custom thumb colour.
 */
import type { SxProps, Theme } from '@mui/material/styles';

export type ScrollbarVariant =
  /** The app default — narrow, divider-coloured, always present. */
  | 'thin'
  /** Wider and higher contrast. For long dense lists where aim matters. */
  | 'comfortable'
  /** Light-on-dark, for terminal and code surfaces. */
  | 'overlay'
  /** Scrollable but no visible bar. Only where another affordance exists. */
  | 'hidden';

/** Track and thumb sizes per variant, in px. */
const SIZES: Record<ScrollbarVariant, number> = {
  thin: 8,
  comfortable: 12,
  overlay: 6,
  hidden: 0,
};

/**
 * `sx` fragment styling a container's own scrollbar.
 *
 * Spread it into an `sx`, e.g.
 *   <Box sx={{ overflowY: 'auto', ...scrollbarSx('comfortable') }} />
 */
export function scrollbarSx(variant: ScrollbarVariant = 'thin'): SxProps<Theme> {
  if (variant === 'hidden') {
    return {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    };
  }

  const size = SIZES[variant];
  const isOverlay = variant === 'overlay';

  return {
    scrollbarWidth: variant === 'comfortable' ? 'auto' : 'thin',
    '&::-webkit-scrollbar': { width: size, height: size },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: isOverlay ? 'rgba(255,255,255,0.18)' : 'divider',
      borderRadius: size / 2,
      // An inset border keeps the thumb from touching the container edge,
      // which is what makes a 12px bar look deliberate rather than chunky.
      border: variant === 'comfortable' ? '3px solid transparent' : undefined,
      backgroundClip: variant === 'comfortable' ? 'content-box' : undefined,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: isOverlay ? 'rgba(255,255,255,0.3)' : 'text.disabled',
    },
    '&::-webkit-scrollbar-corner': { background: 'transparent' },
  };
}

/**
 * Sticky-header rules for a `<Table stickyHeader>` inside a scroller.
 *
 * The sticky cell needs an opaque background of its own or rows show through
 * as they pass underneath.
 */
export const stickyHeaderSx: SxProps<Theme> = {
  '& thead th': {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    bgcolor: 'background.paper',
  },
};

/**
 * Momentum scrolling on iOS.
 *
 * Without this an overflow container on an iPhone scrolls in stiff jumps
 * rather than gliding. Applied by every kit scroller.
 */
export const momentumScrollSx: SxProps<Theme> = {
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
};
