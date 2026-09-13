/**
 * Shared `sx` fragments.
 *
 * These exist so the same three-line flex/typography recipe is not retyped on
 * every page. Import and use directly, or spread and extend:
 *
 *   <Typography sx={captionMuted}>…</Typography>
 *   <Box sx={{ ...flexCenter, width: 40 }}>…</Box>
 *
 * Rule of thumb: if an sx fragment appears in three or more files, it belongs
 * here. If it encodes a *colour*, it belongs in themePrimitives instead.
 */
import type { SxProps, Theme } from '@mui/material/styles';
import { monoFontFamily } from './themePrimitives';

// ── Layout ───────────────────────────────────────────────────────────────────

/** Centre children on both axes. */
export const flexCenter: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Horizontal row, vertically centred. Add `gap` at the call site. */
export const flexRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
};

/** Row that pushes its last child to the far edge. */
export const flexBetween: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/** Vertical stack with the standard 2-unit gap. */
export const flexColGap2: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

/** Flex child that truncates instead of overflowing its row. */
export const truncateFlex: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

/** Single-line ellipsis. Pair with `truncateFlex` on the parent. */
export const ellipsis: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** Fills its flex parent and allows an inner scroll region. */
export const fillFlex: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
};

// ── Text ─────────────────────────────────────────────────────────────────────

/** Muted caption — labels, timestamps, helper text. */
export const captionMuted: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.7rem',
};

/** Muted body copy — empty states, secondary descriptions. */
export const bodyMuted: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.8rem',
};

/** Uppercase micro-label — section headers inside cards. */
export const sectionLabel: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

/** Tab label that does not shout. */
export const tabLabel = { fontSize: '0.8rem', textTransform: 'none' } as const;

/** Monospace inline value — ids, prices, hashes. */
export const mono: SxProps<Theme> = {
  fontFamily: monoFontFamily,
  fontSize: '0.8rem',
};

/** Just the family, for when the size is set elsewhere. */
export const monoFamily = { fontFamily: monoFontFamily } as const;

// ── Surfaces ─────────────────────────────────────────────────────────────────

/** Bordered inset panel — the "card inside a card" treatment. */
export const insetPanel: SxProps<Theme> = {
  p: 1.5,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: 'background.paper',
};
