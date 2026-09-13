/**
 * Capture desktop screenshots of every route, in both colour schemes.
 *
 * Used as the before/after pair around responsive work: desktop layout is
 * frozen, and a pixel diff is the only way to prove that rather than assert it.
 *
 *   node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./baseline
 *   # …make changes, rebuild…
 *   node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./after
 *   node tests/desktop-diff.mjs ./baseline ./after
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';
const OUT = process.argv[3] ?? './baseline';

const ROUTES = [
  '/overview', '/blocks', '/charts', '/meters', '/tables',
  '/controls', '/status', '/split', '/sensors', '/builder', '/terminal', '/theme',
];

mkdirSync(OUT, { recursive: true });

/**
 * Playwright resolves its own browser by default. PLAYWRIGHT_CHROMIUM_PATH is
 * the escape hatch for a sandbox that ships Chromium at a fixed location and
 * blocks `playwright install` — hardcoding such a path breaks CI, where the
 * browser lives somewhere else entirely.
 */
const launchOptions = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
  : {};

const browser = await chromium.launch(launchOptions);

for (const scheme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript((mode) => {
    try { localStorage.setItem('ajr-color-scheme', mode); } catch { /* ignore */ }
  }, scheme);
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    // Long enough for lazy chunks, chart animation and the canvas fit to settle.
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${OUT}/${scheme}-${route.slice(1)}.png`,
      // Freeze CSS animations and transitions at their end state. Without
      // this a pulsing indicator or a spinner differs between runs by a few
      // hundred pixels, which either fails the diff or forces the threshold
      // so loose that a real layout shift slips through.
      animations: 'disabled',
    });
  }
  await context.close();
}

await browser.close();
console.log(`Captured ${ROUTES.length * 2} desktop screenshots into ${OUT}`);
