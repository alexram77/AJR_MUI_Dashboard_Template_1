/**
 * Bounded scroller: caps its own height and scrolls the content inside.
 *
 * The list case. Wrap any table or list that can grow long so it scrolls
 * within its box and the page chrome around it — headers, controls, metric
 * cards — stays put. For a region that should instead fill whatever height its
 * parent gives it, use `ScrollArea`.
 *
 * The default cap is deliberately shorter on `xs`: a 460px list on a phone
 * swallows the whole viewport and hides the fact that anything follows it.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { momentumScrollSx, scrollbarSx, stickyHeaderSx } from './scrollbarTokens';
import type { ScrollbarVariant } from './scrollbarTokens';

type MaxHeight = number | string | Record<string, number | string>;

export interface ScrollPanelProps {
  children: ReactNode;
  /** px, a CSS length, or a responsive object like `{ xs: 320, md: 460 }`. */
  maxHeight?: MaxHeight;
  /** Pin a `<Table stickyHeader>`'s head row while the body scrolls. */
  stickyHeader?: boolean;
  variant?: ScrollbarVariant;
  sx?: SxProps<Theme>;
}

export function ScrollPanel({
  children,
  maxHeight = { xs: 320, md: 460 },
  stickyHeader = false,
  variant = 'thin',
  sx,
}: ScrollPanelProps) {
  return (
    <Box
      sx={[
        {
          maxHeight,
          overflowY: 'auto',
          overflowX: 'auto',
          minHeight: 0,
        },
        momentumScrollSx,
        scrollbarSx(variant),
        stickyHeader ? stickyHeaderSx : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as SxProps<Theme>}
    >
      {children}
    </Box>
  );
}
