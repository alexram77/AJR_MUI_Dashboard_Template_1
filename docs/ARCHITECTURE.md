# Architecture

How the kit is organised, why, and the rules that keep it from turning into a pile of one-off
components.

## The four layers

Dependencies point downward only. A layer may import from layers below it, never above.

```
demo / your app          ← knows about your product
──────────────────────────────────────────────────
components               ← the blocks
layout                   ← the app frame
theme                    ← palette, type, component overrides
hooks · utils            ← shared behaviour and formatters
```

Concretely:

- `utils` and `hooks` import nothing from the kit except each other.
- `theme` imports `utils`.
- `components` import `theme`, `hooks`, `utils`.
- `layout` imports `theme` and `components`.
- **Nothing in `kit/` imports from `demo/`.** That is the rule that makes the kit portable — the
  `@kit` / `@demo` aliases exist so a violation is visible in the import line.

## No god files

Every component is one file. Every file has a header comment saying what the component is *for*,
not what it is. Groups get a barrel (`index.ts`) that re-exports the public names.

Current shape: ~110 files in `src/kit/`, none over ~250 lines. If a file is heading past ~250 lines,
it is doing two jobs — split it. `SplitPane`'s geometry constants, `DataTable`'s sorting and the
meters' trigonometry are all extracted for exactly this reason.

## The three anti-drift libraries

Three groups exist specifically because they are what drifts first when several people (or several
agents) work on a dashboard. Each one is a closed vocabulary with a single token file behind it.

### `components/buttons` — buttonTokens.ts

Buttons take an **intent**, not a variant and a colour. `BUTTON_INTENTS` maps the six intents onto
MUI variant + palette colour, and that is the only place button appearance is decided. Passing
`variant`/`color` to `ActionButton` is not possible by design — the props are omitted from the type.

`BUTTON_HEIGHTS` pins three heights: `sm` (30px, the toolbar height the theme's
`MuiButton.sizeSmall` override also sets), `md` (36px) and `touch` (44px, the finger minimum).

### `components/scroll` — scrollbarTokens.ts

`scrollbarSx(variant)` emits both the `::-webkit-scrollbar` rules and the Firefox `scrollbar-*`
properties, because writing one and forgetting the other is the usual failure. The theme's
`CssBaseline` applies the same `thin` values globally, so most surfaces style nothing at all.

`ScrollPanel` caps its own height; `ScrollArea` fills its flex parent. Both apply momentum
scrolling and overscroll containment, which is what stops an iOS overflow container scrolling in
stiff jumps and rubber-banding the page behind it.

### `components/status` — indicatorTokens.ts

Two layers: `IndicatorState` is the operational vocabulary a service reports (`ok`, `degraded`,
`down`, `checking`, `disabled`, `simulated`); `Tone` is the semantic (`ok`, `warn`, `bad`,
`neutral`). States map to tones, tones map to palette colours. Add states freely; add tones almost
never.

`shouldGlow()` centralises the rule that only a healthy state glows — a red glow reads as an active
alarm rather than a reported state.

## Where a thing belongs

| It is… | It goes in |
|---|---|
| a colour, a font, a radius | `theme/themePrimitives.ts` |
| an override for a MUI component | `theme/customizations/<category>.ts` |
| an sx fragment used in 3+ files | `theme/styleTokens.ts` |
| a colour a chart or SVG needs | `theme/chartTokens.ts` |
| a button of any kind | `components/buttons/` |
| a scrolling region | `components/scroll/` |
| anything that reports state | `components/status/` |
| any other reusable visual block | `components/<group>/` |
| reusable stateful behaviour | `hooks/` |
| a pure function over data | `utils/` |
| anything that names your product | your app, **not** the kit |

The theme customizations are split by MUI component category — `inputs`, `surfaces`,
`dataDisplay`, `feedback`, `navigation`, `baseline` — following the official MUI template layout.
Adding a category means dropping a file next to them and re-exporting it from
`customizations/index.ts`; `AppTheme` spreads every export in order and nothing else changes.

## Adding a block

1. Pick the group (`page`, `cards`, `controls`, `feedback`, `status`, `data`, `meters`, `charts`).
   No group fits? That is usually a sign it belongs in your app instead.
2. Create `<Name>.tsx`. Export a named function and a `<Name>Props` interface — no default
   exports in the kit, so the barrel re-exports read clearly.
3. Write the header comment first. If you cannot say what the block is *for* in two sentences,
   the API is not settled yet.
4. Take colours from the palette, spacing from theme units, and shared recipes from
   `styleTokens`. A hex literal in a block is a bug.
5. Re-export from the group barrel.
6. Add it to the matching demo page. A block with no demo is a block nobody will find.

## Conventions that carry real weight

Each of these came out of something going wrong in a real deployment:

- **Missing data renders as `—`, never `0` or `NaN`.** A reader must be able to tell "no reading"
  from "a reading of zero". `utils/format.ts` enforces this; use those helpers rather than
  `.toFixed()`.
- **Loading, error and empty are three different states.** `StateBlock` keeps them apart — an
  empty result that renders identically to a failed request costs an afternoon debugging the
  wrong layer. The error text is always shown verbatim.
- **`checking` is not `down`.** A health check that has not finished must not be drawn as a
  failure (`StatusDot`).
- **An unknown age is not a fresh one.** `FreshnessChip` renders a neutral dash for a missing
  timestamp rather than colouring it.
- **Down is not always bad.** `TrendChip` and `StatCard` take `invertColors` / `invertTrendColors`
  for latency, error rate and cost. Without it a 40% latency drop renders red.
- **Never headline the mean of a ratio.** `utils/number.ts` exports `pooledRatio`
  (`sum(num)/sum(den)`) and `median` because averaging per-row ratios is dominated by rows whose
  denominator is near zero, and reports a number that describes none of the data.
- **Scrolling happens inside the page card, not on the document.** The shell pins itself to
  `100dvh` and hides overflow; `PageContainer` owns the scroll region. This is why the sidebar and
  top bar stay put with no `position: fixed` anywhere.
- **Small controls share one height** (30px, from the theme's `MuiButton.sizeSmall` override).
  That single override is what keeps mixed rows of buttons and icon buttons aligned without
  per-call `sx`.

## Charts

The chart components are thin wrappers over Recharts. Everything shared — axis styling, grid,
tooltip surface, margins, the categorical ramp — lives in `charts/chartDefaults.ts` and
`theme/chartTokens.ts`.

`chartTokens` is the stable contract between the theme and whatever renders. Swapping charting
libraries (to MUI X Charts, say) means rewriting `components/charts/*` and nothing else; no page
and no theme file changes.

## Meters

The meters are hand-drawn SVG rather than a chart library, because they need exact control over
concentric arcs, tick placement and optimal-range brackets. `meters/meterGeometry.ts` holds the
maths so each meter's drawing code stays short enough to read in one pass.

`StateMeter` takes its states as a prop rather than hardcoding them, which is what lets one
component serve a leak sensor, a power source and a deploy gate.

## Escape hatches

You should not need to fork the kit:

- **Extra MUI component overrides** → `<AppTheme themeComponents={{ … }}>`. This is how a project
  brings in MUI X DataGrid, charts or date pickers.
- **A block that needs one more slot** → add an optional `ReactNode` prop, the way `TopBar` takes
  `status` and `actions`. The alternative — a branch on which app is rendering — is what the slot
  pattern exists to prevent.
- **A genuinely product-specific component** → keep it in your app. Promote it to the kit only
  once a second project needs it.
