/**
 * Barrel for the theme customizations.
 *
 * Add a new category by dropping a `<category>.ts` file next to these and
 * re-exporting it here; `AppTheme` spreads every export in order, so nothing
 * else has to change.
 */
export { baselineCustomizations } from './baseline';
export { surfacesCustomizations } from './surfaces';
export { inputsCustomizations, SMALL_CONTROL_HEIGHT, TOUCH_TARGET } from './inputs';
export { dataDisplayCustomizations } from './dataDisplay';
export { feedbackCustomizations } from './feedback';
export { navigationCustomizations, TAB_HEIGHT } from './navigation';
