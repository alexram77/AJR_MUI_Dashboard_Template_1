/**
 * The standard page shell: one bordered card filling the area beneath the top
 * bar, with an optional tabs row, an optional toolbar row, and a body that
 * scrolls internally.
 *
 * The card carries no title — the top bar already names the page, from the
 * nav declaration.
 *
 * Pages own their content and nothing else — frame, padding, alignment and
 * scrolling are standardised here. Never re-style this per page; if a page
 * needs a different frame, it needs a different component.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { CONTENT_MAX_WIDTH, PAGE_CARD_SX } from './pageCardSx';

export interface PageContainerProps {
  /** Controls row for the whole page — normally a `<PageToolbar/>`. */
  toolbar?: ReactNode;
  /** Tabs row, rendered as the card's first line — normally a `<PageTabs/>`. */
  tabs?: ReactNode;
  /** Body content, laid out as a vertical grid with the standard gap. */
  children: ReactNode;
  /** Let the body span the card's full width (charts, tables, maps). */
  wide?: boolean;
  /**
   * Hand the body's own scrolling to the child instead of this container.
   * Use for a page that is a single full-height widget (terminal, canvas).
   */
  disableBodyScroll?: boolean;
}

export function PageContainer({
  toolbar,
  tabs,
  children,
  wide = false,
  disableBodyScroll = false,
}: PageContainerProps) {
  return (
    <Box sx={PAGE_CARD_SX}>
      {tabs && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, flexShrink: 0 }}>{tabs}</Box>
      )}

      {toolbar && (
        <Box
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 1, md: 1.25 },
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          {toolbar}
        </Box>
      )}

      {/* Scrolling body. A plain block box, deliberately: making this a flex
          container lets its child shrink below its content height and clips
          tall sections instead of scrolling them. The `disableBodyScroll`
          branch is the one case that does want a filling flex child. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: disableBodyScroll ? 'hidden' : 'auto',
          display: disableBodyScroll ? 'flex' : 'block',
        }}
      >
        <Box
          sx={{
            // 1.5 units at 320px buys back 8px of content width on each side
            // without changing anything from sm up.
            p: { xs: 1.5, sm: 2, md: 3 },
            display: disableBodyScroll ? 'flex' : 'grid',
            flexDirection: disableBodyScroll ? 'column' : undefined,
            flex: disableBodyScroll ? 1 : undefined,
            minHeight: disableBodyScroll ? 0 : undefined,
            gap: 2.5,
            width: '100%',
            minWidth: 0,
            ...(wide ? {} : { maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
