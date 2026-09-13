# The responsive contract

Desktop layout is **frozen**. Mobile is fixed by adding rules inside the `xs`/`sm` breakpoints, never
by changing what `md` and up already do.

This is not a stylistic preference. The two dashboards this kit came from are used on desktop all
day; a mobile fix that nudges desktop spacing is a regression nobody asked for and nobody notices
until it is shipped.

## The rule

> Any responsive change must be scoped to a breakpoint. If a value applies at every width, it is a
> desktop change and needs to be a deliberate one.

```tsx
// Wrong — changes desktop too
<Box sx={{ p: 1 }} />

// Right — mobile gets tighter, desktop is untouched
<Box sx={{ p: { xs: 1, md: 3 } }} />

// Right — the element only exists on one side of the breakpoint
<Box sx={{ display: { xs: 'none', md: 'flex' } }} />
```

## Breakpoints

MUI defaults, unchanged: `xs` 0 · `sm` 600 · `md` 900 · `lg` 1200 · `xl` 1536.

The kit treats `md` as the desktop cut-over — it is where the sidebar becomes permanent, the bottom
bar disappears, and `useIsMobile()` flips.

## What the kit already handles

| Concern | Where |
|---|---|
| Sidebar → overlay drawer | `AppShell` / `SideMenu` |
| Bottom navigation for primary routes | `BottomNav`, driven by `primary: true` in the nav config |
| Top bar indicators dropping out progressively | `TopBarSlots`, via `display` breakpoints |
| Page gutters tightening | `AppShell` main, `PageContainer` |
| Button rows stacking full width | `ButtonRow` |
| Split panes swapping instead of shrinking | `SplitPane` |
| Bounded lists getting shorter caps | `ScrollPanel` default `{ xs: 320, md: 460 }` |
| Momentum scrolling and overscroll containment on iOS | `scrollbarTokens` |
| Long unbroken strings not forcing a page scroll | theme `CssBaseline` |
| Safe-area inset under the bottom bar | `BottomNav` + `viewport-fit=cover` |

## Tap targets

44 × 44 px minimum for anything that navigates or mutates — WCAG 2.5.8, and what both the Apple and
Material guidelines ask for.

`ActionButton size="touch"` gives you exactly that. Dense data controls inside a scrollable region
(a table sort header, an inline filter chip) are exempt: they are legitimately small, and a mis-tap
there costs a scroll rather than an action.

## How it is enforced

`tests/mobile.mjs` runs every route at six viewports — 320, 360, 390, 414 portrait, 740 landscape,
768 tablet — and fails on:

1. the document scrolling horizontally at all;
2. any element wider than the viewport, unless it sits inside a container that scrolls horizontally
   on purpose (a table, a chart, a canvas);
3. a tap target under 44 px that is not on the exemption list;
4. the menu button, drawer or bottom bar being unreachable at phone widths.

```bash
npm run build
npx vite preview --port 4173 &
npm run test:mobile
```

Playwright resolves its own browser. In a sandbox that ships Chromium at a fixed path and blocks
`playwright install`, point at it with `PLAYWRIGHT_CHROMIUM_PATH`.

## Proving desktop did not change

Capture a baseline before the work and diff after:

```bash
node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./baseline
# …make mobile changes, rebuild…
node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./after
node tests/desktop-diff.mjs ./baseline ./after
```

`desktop-diff.mjs` compares the two sets at 1440 × 900 in both colour schemes and requires
byte-identity.

Byte-identity is only a usable bar because captures freeze CSS animation (`animations: 'disabled'`
on the screenshot). Without that, a pulsing live indicator or a button spinner moves a few hundred
pixels between runs, which either fails the diff or forces the threshold so loose that a real
layout shift slips through underneath it.

Routes whose *content* is genuinely time-derived — live simulated readings, absolute timestamps
computed from `Date.now()` — are listed in `VOLATILE` and reported rather than failed. Everything
else must match exactly.

A diff on a static page means a mobile change leaked into desktop. Find the unscoped rule: it is
usually a `maxWidth`, `p` or `fontSize` written as a bare value where it needed a breakpoint
object. This check has already caught one — an unconditional `maxWidth: '100%'` on the meter SVGs,
which bound on desktop too wherever a grid column was tight.
