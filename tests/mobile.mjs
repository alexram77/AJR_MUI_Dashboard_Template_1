/**
 * Mobile compatibility suite.
 *
 * Asserts, on every route and at every phone/tablet width:
 *   1. no horizontal overflow of the document
 *   2. no individual element wider than the viewport
 *   3. tap targets meet the 44px minimum on touch viewports
 *   4. the shell chrome (menu button, bottom bar) is reachable
 *
 * Run against a built preview:
 *   npm run build && npx vite preview --port 4173 &
 *   node tests/mobile.mjs http://127.0.0.1:4173
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';

const ROUTES = [
  '/overview', '/blocks', '/charts', '/meters', '/tables',
  '/controls', '/status', '/split', '/sensors', '/builder', '/terminal', '/theme',
];

/** Real device widths, smallest first. 320 is an iPhone SE in portrait. */
const VIEWPORTS = [
  { name: '320-portrait', width: 320, height: 568, touch: true },
  { name: '360-portrait', width: 360, height: 740, touch: true },
  { name: '390-portrait', width: 390, height: 844, touch: true },
  { name: '414-portrait', width: 414, height: 896, touch: true },
  { name: '740-landscape', width: 740, height: 360, touch: true },
  { name: '768-tablet', width: 768, height: 1024, touch: true },
];

/** Tap-target minimum, per WCAG 2.5.8 / the Apple and Material guidelines. */
const MIN_TAP = 44;

/**
 * Elements exempt from the tap-target rule.
 *
 * Dense data controls (a table sort header, an inline chip) are legitimately
 * small and sit inside a scrollable region where a mis-tap costs nothing.
 * Everything that navigates or mutates must meet the minimum.
 */
const TAP_EXEMPT = [
  '.MuiTableSortLabel-root',
  '.MuiChip-root',
  '.react-flow__controls-button',
  '.MuiSlider-root',
  '.xterm-helper-textarea',
];

const problems = [];

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

/** One viewport's full pass. Viewports run concurrently in the same browser. */
async function auditViewport(viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    deviceScaleFactor: 2,
  });
  await context.addInitScript(() => {
    try { localStorage.setItem('ajr-color-scheme', 'dark'); } catch { /* ignore */ }
  });
  const page = await context.newPage();
  page.on('pageerror', (err) => problems.push(`[${viewport.name}] pageerror: ${err.message}`));

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(900);

    // ── 1 + 2. Horizontal overflow ────────────────────────────────────────
    const overflow = await page.evaluate((vw) => {
      const doc = document.documentElement;
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        // Right edge past the viewport, or the element itself wider than it.
        if (rect.right > vw + 1 || rect.width > vw + 1) {
          // Ignore anything inside a container that scrolls horizontally on
          // purpose — a table, a chart, a canvas.
          let node = el.parentElement;
          let intentional = false;
          while (node && node !== document.body) {
            const style = getComputedStyle(node);
            if (style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden') {
              intentional = true;
              break;
            }
            node = node.parentElement;
          }
          if (!intentional) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className?.toString?.() ?? '').slice(0, 70),
              width: Math.round(rect.width),
              right: Math.round(rect.right),
            });
          }
        }
      }
      return {
        docScroll: doc.scrollWidth,
        docClient: doc.clientWidth,
        bodyScroll: document.body.scrollWidth,
        offenders: offenders.slice(0, 5),
      };
    }, viewport.width);

    if (overflow.docScroll > overflow.docClient + 1) {
      problems.push(
        `[${viewport.name}] ${route}: document scrolls horizontally ` +
          `(${overflow.docScroll} > ${overflow.docClient})`,
      );
    }
    for (const o of overflow.offenders) {
      problems.push(
        `[${viewport.name}] ${route}: <${o.tag} class="${o.cls}"> is ${o.width}px wide ` +
          `(right edge ${o.right}, viewport ${viewport.width})`,
      );
    }

    // ── 3. Tap targets ────────────────────────────────────────────────────
    if (viewport.touch) {
      const small = await page.evaluate(
        ({ min, exempt }) => {
          const out = [];
          const selector = 'button, a[href], [role="button"], .MuiListItemButton-root, .MuiTab-root';
          for (const el of document.querySelectorAll(selector)) {
            if (exempt.some((sel) => el.matches(sel) || el.closest(sel))) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            if (getComputedStyle(el).visibility === 'hidden') continue;
            if (rect.height < min - 0.5 || rect.width < min - 0.5) {
              out.push({
                label: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 34),
                cls: (el.className?.toString?.() ?? '').slice(0, 50),
                w: Math.round(rect.width),
                h: Math.round(rect.height),
              });
            }
          }
          return out.slice(0, 6);
        },
        { min: MIN_TAP, exempt: TAP_EXEMPT },
      );
      for (const t of small) {
        problems.push(
          `[${viewport.name}] ${route}: tap target "${t.label}" is ${t.w}x${t.h} ` +
            `(min ${MIN_TAP}) class="${t.cls}"`,
        );
      }
    }
  }

  // ── 4. Shell chrome reachable on phone widths ───────────────────────────
  if (viewport.width < 900) {
    await page.goto(`${BASE}/overview`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const menu = page.getByLabel('Open navigation');
    if ((await menu.count()) === 0) {
      problems.push(`[${viewport.name}] overview: no menu button on a narrow viewport`);
    } else {
      await menu.click();
      await page.waitForTimeout(400);
      const drawerLinks = await page.locator('.MuiDrawer-root .MuiListItemButton-root').count();
      if (drawerLinks < 5) {
        problems.push(`[${viewport.name}] drawer opened with only ${drawerLinks} entries`);
      }
      await page.keyboard.press('Escape');
    }

    const bottomNav = await page.locator('.MuiBottomNavigation-root').count();
    if (viewport.width < 900 && bottomNav === 0) {
      problems.push(`[${viewport.name}] overview: bottom navigation missing`);
    }
  }

  await context.close();
}

await Promise.all(VIEWPORTS.map((viewport) => auditViewport(viewport)));

await browser.close();

if (problems.length > 0) {
  console.error(`MOBILE SUITE FAILED — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  -', p);
  process.exit(1);
}
console.log(`Mobile suite passed: ${ROUTES.length} routes x ${VIEWPORTS.length} viewports.`);
