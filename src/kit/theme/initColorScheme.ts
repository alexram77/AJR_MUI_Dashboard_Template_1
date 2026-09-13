/**
 * Making dark the default from the *first paint*, not from React's first
 * render.
 *
 * MUI sets `data-mui-color-scheme` on `<html>` when the provider mounts. Until
 * then the document has no scheme attribute, so the browser paints its own
 * white canvas — a white flash on a dark app, for however long the bundle
 * takes to download and parse. On a cold cache that is very visible.
 *
 * The fix has to run before the bundle: an inline `<script>` in `<head>` that
 * reads the stored preference (or falls back to dark) and stamps the attribute
 * itself. `colorSchemeInitScript()` generates it; `index.html` inlines it.
 */

/** localStorage key MUI uses to remember the chosen scheme. */
export const COLOR_MODE_STORAGE_KEY = 'ajr-color-scheme';

/**
 * The scheme an app starts in when the user has never chosen.
 *
 * Dark, deliberately and unconditionally — the OS preference is not consulted.
 * These dashboards are looked at for hours in rooms that are not bright, and a
 * light default because someone's laptop said so is the wrong call more often
 * than it is right. The toggle is still there for anyone who wants light.
 */
export const DEFAULT_COLOR_SCHEME = 'dark' as const;

export type ColorScheme = 'light' | 'dark';

/**
 * The inline script, as a string.
 *
 * Kept deliberately tiny and dependency-free — it runs before anything else on
 * the page, and it must never throw: a `localStorage` access can fail outright
 * in a private window or with site data blocked, and a broken init script
 * would take the whole page down before React ever loads.
 */
export function colorSchemeInitScript(defaultScheme: ColorScheme = DEFAULT_COLOR_SCHEME): string {
  return `(function(){try{var m=localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');if(m!=='light'&&m!=='dark')m='${defaultScheme}';document.documentElement.setAttribute('data-mui-color-scheme',m);document.documentElement.style.colorScheme=m;}catch(e){document.documentElement.setAttribute('data-mui-color-scheme','${defaultScheme}');}})();`;
}

/**
 * Apply the stored scheme immediately, for an app that cannot edit its
 * `index.html`.
 *
 * Call it at the top of your entry module. This still beats React's first
 * render, but not the bundle download — prefer the inline script when you can
 * add one.
 */
export function applyStoredColorScheme(defaultScheme: ColorScheme = DEFAULT_COLOR_SCHEME): void {
  let scheme: ColorScheme = defaultScheme;
  try {
    const stored = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') scheme = stored;
  } catch {
    /* storage unavailable — the default stands */
  }
  document.documentElement.setAttribute('data-mui-color-scheme', scheme);
  document.documentElement.style.colorScheme = scheme;
}
