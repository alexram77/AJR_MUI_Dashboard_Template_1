/**
 * Smoke test: visit every demo route in both colour schemes, capture a
 * screenshot, and fail on any page exception or app-level console error.
 * Also exercises the two interactive pages — the terminal must answer a typed
 * command, and the block canvas must render its nodes.
 *
 * Usage:
 *   npm run build && npx vite preview --port 4173 &
 *   npm run test:smoke
 *
 * Network failures for web fonts and the favicon are filtered: they are a
 * property of whatever sandbox this runs in, not of the app.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';
const OUT = process.argv[3] ?? '.screenshots';
const ROUTES = [
  '/overview', '/blocks', '/charts', '/meters', '/tables',
  '/controls', '/status', '/split', '/sensors', '/builder', '/terminal', '/theme',
];

/** Network noise this sandbox always produces — not app faults. */
const IGNORE = [/ERR_CONNECTION_RESET/, /404 \(Not Found\)/, /fonts\.g/, /favicon/];
const isNoise = (text) => IGNORE.some((re) => re.test(text));

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
const problems = [];

for (const scheme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript((mode) => {
    try { localStorage.setItem('ajr-color-scheme', mode); } catch { /* ignore */ }
  }, scheme);

  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isNoise(msg.text())) problems.push(`[${scheme}] console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`[${scheme}] pageerror: ${err.message}`));

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    // Lazy pages and the live sensor loop both need a beat to settle.
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${scheme}-${route.slice(1)}.png` });
    const text = await page.locator('body').innerText();
    if (text.trim().length < 40) problems.push(`[${scheme}] ${route}: rendered nearly empty`);
  }
  await context.close();
}

// Interaction checks on the two pages that are more than static markup.
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', (err) => problems.push(`[interact] pageerror: ${err.message}`));

// Terminal: the local shell must actually respond to typed input.
await page.goto(`${BASE}/terminal`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
// xterm routes keystrokes through a hidden textarea; the visible screen layer
// sits under an overlay, so focus the textarea directly rather than clicking.
await page.locator('.xterm-helper-textarea').focus();
await page.keyboard.type('status');
await page.keyboard.press('Enter');
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/interact-terminal.png` });
const termText = await page.locator('.xterm').innerText();
if (!/ingest-gateway/.test(termText)) problems.push('[interact] terminal: typed command produced no output');

// Flow builder: the canvas must render nodes.
await page.goto(`${BASE}/builder`, { waitUntil: 'load' });
await page.waitForTimeout(1400);
const nodeCount = await page.locator('.react-flow__node').count();
if (nodeCount < 5) problems.push(`[interact] builder: only ${nodeCount} nodes rendered`);
await page.locator('.react-flow__node').first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/interact-builder.png` });

await context.close();

// Mobile pass.
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mobile.newPage();
mpage.on('pageerror', (err) => problems.push(`[mobile] pageerror: ${err.message}`));
await mpage.goto(`${BASE}/sensors`, { waitUntil: 'load' });
await mpage.waitForTimeout(1400);
await mpage.screenshot({ path: `${OUT}/mobile-sensors.png` });
await mobile.close();

await browser.close();

if (problems.length) {
  console.error('PROBLEMS FOUND:');
  for (const p of problems) console.error(' -', p);
  process.exit(1);
}
console.log(`OK: ${ROUTES.length * 2 + 3} screenshots, no page errors, interactions verified.`);
