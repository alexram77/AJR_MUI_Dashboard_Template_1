# Instructions for coding agents

**Read this before writing a single line in this repository, or in any project that uses this kit.**

This repo exists because the same dashboard kept getting rebuilt from scratch. Every component you are about
to need already exists here. Your job is to **use it**, not to write your own version that looks
almost the same.

---

## The one rule

> **Never build a UI primitive that already exists in `src/kit/`. Import it.**

If you catch yourself writing a styled `<Button>`, a coloured status dot, a `::-webkit-scrollbar`
rule, a card with a title and a divider, or a `<Stack direction="row" spacing={1}>` of actions —
stop. It is in the kit. Find it below.

A near-duplicate is worse than no component at all: it looks right in isolation and wrong next to
the real one, and nobody notices until a designer opens two pages side by side.

---

## Where everything is

| You need… | Import from | Do **not** |
|---|---|---|
| Any button, icon button, menu button, button row | `@kit/components/buttons` | import MUI `Button`/`IconButton` in a page |
| A segmented / exclusive choice | `@kit/components/buttons` (`SegmentedControl`) | build a ToggleButtonGroup by hand |
| Any scrolling region | `@kit/components/scroll` | write `::-webkit-scrollbar` rules |
| Health, freshness, trend, capacity, liveness, counts | `@kit/components/status` | invent a coloured dot or chip |
| A page frame, header, tabs, split view | `@kit/components/page` | write layout CSS in a page |
| A content card, metric, stat | `@kit/components/cards` | style a bare `<Card>` |
| A dialog, empty state, loading/error state | `@kit/components/feedback` | render three ad-hoc branches |
| A table or a detail list | `@kit/components/data` | hand-roll `<Table>` chrome |
| A chart | `@kit/components/charts` | call Recharts directly |
| An instrument meter | `@kit/components/meters` | draw your own SVG |
| A live sensor / metric channel | `@kit/components/sensors` | build a bespoke reading card |
| A terminal | `@kit/components/terminal` | wire xterm yourself |
| A node/block graph editor | `@kit/components/flow` | wire React Flow yourself |
| The app shell, sidebar, top bar | `@kit/layout` | build another shell |
| A colour, font, radius, spacing token | `@kit/theme` | write a hex literal |
| Formatting a number, byte count, date, age | `@kit/utils` | call `.toFixed()` inline |

Every group has an `index.ts` barrel. `src/kit/index.ts` re-exports everything.

---

## The three libraries that exist specifically to stop drift

### Buttons — `@kit/components/buttons`

Buttons take an **intent**, not a variant and a colour:

```tsx
<ActionButton intent="danger" startIcon={<DeleteIcon />}>Delete</ActionButton>
```

Intents: `primary` · `secondary` · `danger` · `warning` · `success` · `ghost`. The mapping lives in
`buttonTokens.ts` and is the only place appearance is decided.

- **Never** pass `variant` or `color` to `ActionButton`. If the look you want is not an intent, add
  an intent — do not special-case one button.
- Use `ToolbarButton` / `ToolbarIconButton` inside a page header or toolbar row; they pin the dense
  30px height that keeps mixed rows aligned.
- Wrap any row of actions in `ButtonRow`. It supplies the spacing **and** the mobile behaviour
  (stacks and goes full width below `sm`). A hand-rolled `Stack` will not.

### Scrolling — `@kit/components/scroll`

Two components and one token function cover every case:

- `ScrollPanel` — caps its own height, scrolls a list inside it.
- `ScrollArea` — fills its flex parent, scrolls to that height. Supports fade edges.
- `scrollbarSx(variant)` — the bar styling itself, for the rare container you must scroll yourself.

The theme applies the `thin` variant globally, so most surfaces need nothing at all. **Never write
`::-webkit-scrollbar` rules in a component.** Firefox needs `scrollbar-width` too and you will
forget it.

### Indicators — `@kit/components/status`

Every indicator resolves its colour through `indicatorTokens.ts`. States map to tones; tones map to
palette colours. Add states freely; add tones almost never.

Available: `StatusDot` · `IndicatorBadge` · `AlertChip` · `ConnectionChip` · `TrendChip` ·
`FreshnessChip` · `LiveIndicator` · `CountBadge` · `QuotaBar` · `StorageMeterRow` · `StatusBar`.

---

## Conventions you must not quietly break

These each came out of something going wrong in a real deployment.

1. **Missing data renders as `—`, never `0` or `NaN`.** Use the `fmt*` helpers in `@kit/utils`.
   A reader must be able to tell "no reading" from "a reading of zero".
2. **Loading, error and empty are three different states.** Use `StateBlock`. An empty result that
   renders identically to a failed request costs an afternoon debugging the wrong layer. Show the
   error text verbatim.
3. **`checking` is not `down`.** A health check in flight must never be drawn red.
4. **An unknown age is not a fresh one.** `FreshnessChip` renders a neutral dash for a missing
   timestamp rather than colouring it green.
5. **Down is not always bad.** Pass `invertColors` / `invertTrendColors` for latency, error rate and
   cost, or a 40% latency improvement renders red.
6. **Simulated data is amber, never green.** `ConnectionChip simulated` and `LiveIndicator` exist
   for this. Fake data that looks live is the most expensive thing a dashboard can imply.
7. **Never headline the mean of a ratio.** Use `pooledRatio` (`sum(num)/sum(den)`) or `median` from
   `@kit/utils`. Averaging per-row ratios is dominated by near-zero denominators and describes none
   of the data.
8. **Only a live stream animates.** Reserve pulsing for conditions wanting attention now. A page
   where three things pulse has taught the operator to ignore all three.
9. **Dark is the default scheme, and it applies from the first painted frame.** Do not make the
   default follow the OS preference, and do not remove the inline init script or critical CSS from
   `index.html` — without them a dark app flashes white for the length of the bundle download. The
   script is generated by `colorSchemeInitScript()`; if you change the storage key or the default,
   change both.
10. **Scrolling happens inside the page card, not on the document.** The shell pins itself to
   `100dvh`; `PageContainer` owns the scroll region. This is why nothing uses `position: fixed`.

---

## Mobile

The kit is responsive already. When you add something:

- **Never introduce a fixed pixel width larger than 320px** without a breakpoint guard.
- Put any mobile fix **inside an `xs`/`sm` breakpoint** so `md` and up are untouched. Desktop layout
  is considered frozen; a change that alters it needs to be deliberate and called out.
- Tap targets are **44px minimum** on touch. The theme enforces this under
  `@media (pointer: coarse)`, which is keyed on pointer type rather than viewport width — so a
  desktop user with a narrow window keeps the dense controls, and desktop can never be affected.
  `ActionButton size="touch"` gives you the same minimum explicitly.
- **At most five `primary: true` nav items.** The bottom bar is hard-capped at five because eight
  destinations across a 320px screen leaves each one 40px wide.
- A meter, chart or canvas with a fixed pixel size needs a **breakpoint-scoped** cap
  (`maxWidth: { xs: '100%', md: 'none' }`), not an unconditional one — an unconditional cap binds on
  desktop too wherever the container is tight, and that is a desktop change.
- Run the mobile test suite before you finish (see below). It asserts no horizontal overflow at
  320/360/390/414/768px, in portrait and landscape.

---

## Before you say you are done

```bash
npm run verify                        # typecheck + lint + build, all must be clean

npm run build
npx vite preview --port 4173 &        # the browser tests need a served build
npm run test:smoke                    # every route, both schemes, + interactions
npm run test:mobile                   # overflow + tap targets at 6 viewports
```

If you changed anything that could affect layout, also prove desktop did not move:

```bash
node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./baseline   # before
# …make your changes, rebuild…
node tests/desktop-baseline.mjs http://127.0.0.1:4173 ./after
node tests/desktop-diff.mjs ./baseline ./after                     # must be clean
```

The demo app in `src/demo/` is the regression test for the kit. **If you add a component, add it to
the matching demo page.** A block with no demo is a block the next agent will not find, and will
rebuild.

---

## Adding to the kit

1. Pick the right group. If none fits, it probably belongs in your app, not the kit.
2. One component per file. Named exports, not default. A `<Name>Props` interface.
3. Write the header comment first — say what it is *for*, in two sentences. If you cannot, the API
   is not settled.
4. Colours from the palette, spacing in theme units, shared recipes from `styleTokens`. A hex
   literal in a component is a bug.
5. Re-export from the group barrel.
6. Add it to the demo.
7. Keep files under ~250 lines. Past that it is doing two jobs.

## Promoting from an app into the kit

A component earns its place when a **second** project needs it. Before that it lives in the app.
When you promote one, strip every trace of the original domain: no product nouns in type names, no
hardcoded id lists, no imports from app code. `StateMeter` is the worked example — it started as a
leak sensor and now takes its states as a prop.

## Never

- Fork a kit file into a consuming project. Use the escape hatches: `themeComponents` on `AppTheme`
  for theme additions, an optional slot prop for a component needing one more hook.
- Add a dependency without checking whether the kit already wraps that capability.
- Change desktop layout while fixing mobile.
- Delete or weaken a convention above because it is inconvenient in one place.
