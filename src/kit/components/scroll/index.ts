/**
 * The scroll library.
 *
 * Two components and one token function cover every scrolling surface:
 *
 *   ScrollPanel     caps its height and scrolls a list inside it
 *   ScrollArea      fills its flex parent and scrolls to that height
 *   scrollbarSx()   the bar styling, when you must scroll something yourself
 *
 * Never hand-write `::-webkit-scrollbar` rules in a page or component — that
 * is how a project ends up with four different scrollbars.
 */
export { ScrollPanel } from './ScrollPanel';
export type { ScrollPanelProps } from './ScrollPanel';
export { ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';
export { scrollbarSx, stickyHeaderSx, momentumScrollSx } from './scrollbarTokens';
export type { ScrollbarVariant } from './scrollbarTokens';
