/** Public surface of the theme layer. */
export { AppTheme, CSS_VAR_PREFIX } from './AppTheme';
export {
  COLOR_MODE_STORAGE_KEY,
  DEFAULT_COLOR_SCHEME,
  colorSchemeInitScript,
  applyStoredColorScheme,
} from './initColorScheme';
export type { ColorScheme } from './initColorScheme';
export type { AppThemeProps } from './AppTheme';
export { ColorModeToggle } from './ColorModeToggle';
export type { ColorModeToggleProps } from './ColorModeToggle';
export { useChartTokens, seriesColor } from './chartTokens';
export type { ChartTokens } from './chartTokens';
export * from './styleTokens';
export {
  brand,
  gray,
  warm,
  green,
  amber,
  red,
  statusColors,
  colorSchemes,
  typography,
  shape,
  shadows,
  fontFamily,
  monoFontFamily,
} from './themePrimitives';
export { SMALL_CONTROL_HEIGHT, TAB_HEIGHT, TOUCH_TARGET } from './customizations';
