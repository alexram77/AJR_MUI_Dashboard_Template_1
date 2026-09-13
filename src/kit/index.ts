/**
 * AJR MUI dashboard kit — the whole public surface.
 *
 * A consuming app should need exactly these four layers:
 *   theme      — AppTheme provider, palette ramps, sx tokens
 *   layout     — AppShell and its parts, driven by a NavConfig
 *   components — the plug-and-play blocks
 *   hooks/utils— shared behaviour and formatters
 *
 * Nothing in here knows anything about a specific product. If a change would
 * make it know something, it belongs in that product, not in the kit.
 */
export * from './theme';
export * from './layout';
export * from './components';
export * from './hooks';
export * from './utils';
