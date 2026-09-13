/**
 * A scroller that fills its parent.
 *
 * The counterpart to `ScrollPanel`: where that one caps its height and scrolls
 * a list inside it, this takes whatever height its flex parent gives it. Use
 * it for the body of a pane, a drawer, or a page region that should scroll to
 * the bottom of the viewport and no further.
 *
 * Handles the three things a raw `overflow: auto` misses: the scrollbar
 * styling, iOS momentum and overscroll containment, and optional fade edges
 * that signal there is more content.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { momentumScrollSx, scrollbarSx, stickyHeaderSx } from './scrollbarTokens';
import type { ScrollbarVariant } from './scrollbarTokens';

export interface ScrollAreaProps {
  children: ReactNode;
  /** Which axes scroll. Default vertical. */
  axis?: 'vertical' | 'horizontal' | 'both';
  variant?: ScrollbarVariant;
  /** Pin a `<Table stickyHeader>`'s head row. */
  stickyHeader?: boolean;
  /**
   * Fade the edge where there is more content. A quiet affordance that a
   * region scrolls — worth it on touch, where no scrollbar is visible until
   * the user already started scrolling.
   */
  fadeEdges?: boolean;
  /** Inner padding, in theme units. */
  padding?: number | Record<string, number>;
  sx?: SxProps<Theme>;
}

export function ScrollArea({
  children,
  axis = 'vertical',
  variant = 'thin',
  stickyHeader = false,
  fadeEdges = false,
  padding,
  sx,
}: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  // Track whether content extends past either edge, so the fades only appear
  // when they mean something.
  useEffect(() => {
    if (!fadeEdges) return;
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const vertical = axis !== 'horizontal';
      const scroll = vertical ? element.scrollTop : element.scrollLeft;
      const size = vertical ? element.clientHeight : element.clientWidth;
      const total = vertical ? element.scrollHeight : element.scrollWidth;
      setEdges({ start: scroll > 2, end: scroll + size < total - 2 });
    };

    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [fadeEdges, axis, children]);

  const overflow = {
    vertical: { overflowY: 'auto', overflowX: 'hidden' },
    horizontal: { overflowX: 'auto', overflowY: 'hidden' },
    both: { overflow: 'auto' },
  }[axis];

  const scroller = (
    <Box
      ref={ref}
      sx={[
        { flex: 1, minHeight: 0, minWidth: 0, p: padding },
        overflow as SxProps<Theme>,
        momentumScrollSx,
        scrollbarSx(variant),
        stickyHeader ? stickyHeaderSx : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as SxProps<Theme>}
    >
      {children}
    </Box>
  );

  if (!fadeEdges) return scroller;

  const isVertical = axis !== 'horizontal';
  const fade = (side: 'start' | 'end') => ({
    content: '""',
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
    zIndex: 1,
    ...(isVertical
      ? {
          left: 0,
          right: 0,
          height: 24,
          [side === 'start' ? 'top' : 'bottom']: 0,
          background: `linear-gradient(to ${side === 'start' ? 'bottom' : 'top'}, var(--ajr-palette-background-paper, transparent), transparent)`,
        }
      : {
          top: 0,
          bottom: 0,
          width: 24,
          [side === 'start' ? 'left' : 'right']: 0,
          background: `linear-gradient(to ${side === 'start' ? 'right' : 'left'}, var(--ajr-palette-background-paper, transparent), transparent)`,
        }),
  });

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        ...(edges.start && { '&::before': fade('start') }),
        ...(edges.end && { '&::after': fade('end') }),
      }}
    >
      {scroller}
    </Box>
  );
}
