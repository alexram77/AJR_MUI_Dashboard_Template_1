/**
 * The page-card shell style, on its own so anything that needs to be
 * pixel-identical to a PageContainer (a persistent terminal mount, a custom
 * full-bleed page) can reuse it without going through the component.
 */
import type { SxProps, Theme } from '@mui/material/styles';

export const PAGE_CARD_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  overflow: 'hidden',
};

/**
 * Common content max width. Every page centres its body at this width so
 * cards line up edge-to-edge from one page to the next on wide monitors.
 */
export const CONTENT_MAX_WIDTH = 1500;
