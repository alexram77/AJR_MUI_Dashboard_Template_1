/**
 * Control and badge sizing — the numbers that make a row of mixed controls
 * line up instead of looking hand-placed.
 *
 * These live in the theme rather than beside the components because the theme
 * is what applies them: `customizations/` turns each value into a global MUI
 * override, so a plain `<Chip>` or `<Button>` is already the right size and no
 * component needs to restate it. A per-component `fontSize` is how six
 * different chip sizes appeared on one page.
 *
 * Change a number here and every control follows.
 */

/** Buttons and other interactive controls. */
export const CONTROL_SIZING = {
  /** Toolbar / dense height. */
  heightSm: 30,
  /** Comfortable height, for forms and dialogs. */
  heightMd: 36,
  /** Minimum a fingertip needs (WCAG 2.5.8). Applied on coarse pointers. */
  heightTouch: 44,
  /** Icon inside a labelled button, at any size. */
  buttonIcon: '1rem',
  /** Icon inside an icon-only button — slightly larger, since it is the whole
   *  content rather than an accent beside a label. */
  iconButtonIcon: '1.15rem',
} as const;

/**
 * Chips, badges and pills.
 *
 * `iconSize` is deliberately a little larger than `fontSize`: an icon's drawn
 * mass sits inside its em box, so matching the numbers exactly makes the glyph
 * read as too small next to the text.
 */
export const BADGE_SIZING = {
  height: 22,
  fontSize: '0.68rem',
  iconSize: '0.85rem',
  /** Border width, so the inner height can be derived. */
  borderWidth: 1,
  /** Compact variant, for a crowded top bar. */
  denseHeight: 20,
  denseFontSize: '0.64rem',
  denseIconSize: '0.8rem',
} as const;

/**
 * Line height that makes a badge's text sit optically centred.
 *
 * The naive `line-height: 1` is what makes a pill look wrong: the text box is
 * exactly one em tall, but glyphs are not centred within their em box — the
 * unused descender room sits below the baseline, so flexbox centres the *box*
 * and the visible letters land high. Every measurement says "centred" while
 * the eye says otherwise.
 *
 * Setting the line box to the pill's full inner height fixes it properly:
 * half-leading then distributes evenly above and below, which puts the
 * baseline exactly where MUI's own Chip puts it. This is why Chips have always
 * looked right and a hand-rolled pill does not.
 */
export function badgeLineHeight(dense = false): string {
  const outer = dense ? BADGE_SIZING.denseHeight : BADGE_SIZING.height;
  return `${outer - BADGE_SIZING.borderWidth * 2}px`;
}

/** Status dot diameter. */
export const DOT_SIZE = 8;
