/**
 * The single theme provider for an app built on this kit.
 *
 * Composes `themePrimitives` with every customization category. Mirrors the
 * MUI template's `AppTheme`, with one addition: `themeComponents` lets a
 * consuming app bolt on component overrides the kit does not know about
 * (MUI X charts/data-grid/date-pickers, a project-specific component) without
 * forking the kit.
 *
 * Usage:
 *   <AppTheme themeComponents={{ ...dataGridCustomizations }}>
 *     <App />
 *   </AppTheme>
 */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { colorSchemes, shadows, shape, typography } from './themePrimitives';
import { COLOR_MODE_STORAGE_KEY, DEFAULT_COLOR_SCHEME } from './initColorScheme';
import {
  baselineCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  inputsCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
} from './customizations';

export interface AppThemeProps {
  children: ReactNode;
  /** Extra component overrides merged last, so they win over the kit's. */
  themeComponents?: ThemeOptions['components'];
  /**
   * Scheme applied before the user has chosen one. Defaults to dark, and the
   * OS preference is deliberately not consulted — see `initColorScheme.ts`.
   * Pass `'system'` only if a project genuinely wants to follow the OS.
   */
  defaultMode?: 'light' | 'dark' | 'system';
}

/** CSS variable prefix — `var(--ajr-palette-primary-main)` in raw CSS/SVG. */
export const CSS_VAR_PREFIX = 'ajr';

export function AppTheme({
  children,
  themeComponents,
  defaultMode = DEFAULT_COLOR_SCHEME,
}: AppThemeProps) {
  const theme = useMemo(
    () =>
      createTheme({
        // CSS variables let the scheme switch without re-rendering the tree,
        // and expose every token to non-MUI code (SVG meters, chart libs).
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: CSS_VAR_PREFIX,
        },
        colorSchemes,
        // The scheme whose variables land on bare `:root`. Keeping this dark
        // means a document with no scheme attribute still resolves to dark.
        defaultColorScheme: defaultMode === 'system' ? DEFAULT_COLOR_SCHEME : defaultMode,
        typography,
        shadows,
        shape,
        components: {
          ...baselineCustomizations,
          ...surfacesCustomizations,
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...themeComponents,
        },
      }),
    [themeComponents, defaultMode],
  );

  return (
    <ThemeProvider
      theme={theme}
      defaultMode={defaultMode}
      modeStorageKey={COLOR_MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
