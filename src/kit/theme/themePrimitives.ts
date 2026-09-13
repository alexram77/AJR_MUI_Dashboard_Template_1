/**
 * Design primitives — the single source of truth for colour, type and shape.
 *
 * Structure mirrors the MUI "shared-theme" templates (themePrimitives.ts):
 * raw colour ramps first, then the derived `colorSchemes`, `typography`,
 * `shape` and `shadows` that `AppTheme` feeds into `createTheme`.
 *
 * Retheming an entire app is a one-file edit: change the ramps below, change
 * nothing else. Never hardcode a hex value in a component — reach for a
 * palette token, a ramp export, or `chartTokens`.
 */
import { alpha, createTheme } from '@mui/material/styles';
import type { CssVarsThemeOptions, Shadows, TypographyVariantsOptions } from '@mui/material/styles';

const defaultTheme = createTheme();

// ── Colour ramps ─────────────────────────────────────────────────────────────

/** Brand ramp — teal. The app's primary colour in both schemes is `brand[400]`. */
export const brand = {
  50: 'hsl(187, 100%, 95%)',
  100: 'hsl(187, 100%, 90%)',
  200: 'hsl(187, 100%, 80%)',
  300: 'hsl(187, 95%, 65%)',
  400: 'hsl(187, 98%, 42%)',
  500: 'hsl(187, 98%, 35%)',
  600: 'hsl(187, 98%, 28%)',
  700: 'hsl(187, 100%, 22%)',
  800: 'hsl(187, 100%, 14%)',
  900: 'hsl(187, 100%, 9%)',
} as const;

/** Neutral ramp — cool grey, used for light-scheme surfaces and text. */
export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 12%)',
  900: 'hsl(220, 35%, 8%)',
} as const;

/**
 * Warm neutrals for the dark scheme. The dark theme deliberately avoids the
 * blue-tinted greys most dashboards use — near-black surfaces with ivory text
 * read calmer over long sessions.
 */
export const warm = {
  bg: '#0E0E0E',
  paper: '#191919',
  paperRaised: '#1F1F1F',
  text: '#F9F6EE',
  textMuted: '#8A8480',
} as const;

/** Semantic ramps. Only the shades actually referenced are defined. */
export const green = {
  300: '#69ff9a',
  400: '#00e676',
  500: '#00c853',
  600: '#00b248',
  700: '#009624',
} as const;

export const amber = {
  300: '#ffe57f',
  400: '#ffd740',
  500: '#ffca28',
  600: '#c7a500',
  700: '#c79a00',
} as const;

export const red = {
  300: '#ff616f',
  400: '#ff1744',
  500: '#e0103a',
  600: '#c4001d',
  700: '#a00018',
} as const;

/**
 * Flat status colours for non-MUI surfaces (SVG meters, canvas charts,
 * anything that cannot read a palette token).
 */
export const statusColors = {
  success: green[400],
  warning: amber[400],
  error: red[400],
  info: brand[300],
  neutral: '#94a3b8',
} as const;

// ── Shadows ──────────────────────────────────────────────────────────────────

/**
 * The app uses borders rather than elevation almost everywhere; only the first
 * custom level is overridden, for the few surfaces that genuinely float
 * (menus, popovers).
 */
function buildShadows(mode: 'light' | 'dark'): Shadows {
  const shadows = [...defaultTheme.shadows] as Shadows;
  shadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';
  return shadows;
}

export const shadows = buildShadows('light');
export const darkShadows = buildShadows('dark');

// ── Shape + typography ───────────────────────────────────────────────────────

export const shape = { borderRadius: 8 } as const;

export const fontFamily = '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif';
export const monoFontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const typography: TypographyVariantsOptions = {
  fontFamily,
  h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
  h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em' },
  h3: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
  h4: { fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
  h5: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
  subtitle1: { fontSize: '0.95rem', fontWeight: 500 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
  body1: { fontSize: '0.9rem' },
  body2: { fontSize: '0.85rem' },
  caption: { fontSize: '0.75rem' },
  overline: { fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em' },
  button: { textTransform: 'none', fontWeight: 600 },
};

// ── Colour schemes ───────────────────────────────────────────────────────────

/**
 * Light + dark palettes. Consumed by `createTheme({ colorSchemes })`, which is
 * what lets the whole app switch modes through a single CSS variable flip
 * rather than a React re-render of the theme object.
 */
export const colorSchemes: CssVarsThemeOptions['colorSchemes'] = {
  light: {
    palette: {
      primary: { light: brand[200], main: brand[400], dark: brand[700], contrastText: '#ffffff' },
      secondary: { main: '#5a6ee0', light: '#8fa8ff', dark: '#3c4ba8', contrastText: '#ffffff' },
      info: { main: brand[500], light: brand[200], dark: brand[700], contrastText: '#ffffff' },
      success: { main: green[500], light: green[300], dark: green[700], contrastText: '#000000' },
      warning: { main: amber[500], light: amber[300], dark: amber[700], contrastText: '#000000' },
      error: { main: red[400], light: red[300], dark: red[600], contrastText: '#ffffff' },
      background: { default: gray[50], paper: '#ffffff' },
      text: { primary: gray[800], secondary: gray[600], disabled: gray[400] },
      divider: alpha(gray[300], 0.4),
      action: { hover: alpha(gray[200], 0.3), selected: alpha(gray[200], 0.5) },
    },
  },
  dark: {
    palette: {
      primary: { light: brand[300], main: brand[400], dark: brand[700], contrastText: '#ffffff' },
      secondary: { main: '#8fa8ff', light: '#b9c7ff', dark: '#5a6ee0', contrastText: '#000000' },
      info: { main: brand[300], light: brand[200], dark: brand[600], contrastText: '#000000' },
      success: { main: green[400], light: green[300], dark: green[600], contrastText: '#000000' },
      warning: { main: amber[400], light: amber[300], dark: amber[600], contrastText: '#000000' },
      error: { main: red[400], light: red[300], dark: red[600], contrastText: '#ffffff' },
      background: { default: warm.bg, paper: warm.paper },
      text: { primary: warm.text, secondary: warm.textMuted, disabled: '#5C5853' },
      divider: 'rgba(255,255,255,0.07)',
      action: { hover: 'rgba(255,255,255,0.06)', selected: 'rgba(255,255,255,0.10)' },
    },
  },
};
