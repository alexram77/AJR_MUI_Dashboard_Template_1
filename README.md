# AJR MUI Dashboard Template

**Live demo → https://alexram77.github.io/AJR_MUI_Dashboard_Template_1/**

A shared MUI dashboard kit — theme, app shell and plug-and-play blocks — so a new dashboard starts
from a settled house style instead of rebuilding one.

The repo is two things at once:

| | What it is | Where it lives |
|---|---|---|
| **The kit** | The reusable library. Zero product knowledge. | `src/kit/` |
| **The demo** | A showcase app that exercises every block. Deployable to Netlify. | `src/demo/` |

The split is the point: the kit never imports from the demo, so you can copy `src/kit/` into a
project and nothing comes with it.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle into dist/
npm run preview    # serve the built bundle
npm run lint
npm run typecheck
npm run verify     # typecheck + lint + build, in one

# Browser tests — need a preview server running on the port you pass
npx vite preview --port 4173 &
npm run test:smoke    # every route, both schemes, plus terminal + canvas interaction
npm run test:mobile   # overflow and tap targets at 320/360/390/414/740/768px
```

## Viewing it

Locally, that is all it takes:

```bash
npm install
npm run dev        # http://localhost:5173
```

## Publishing the demo

The build is a static SPA, so any static host works. Three that need no work beyond pointing them
at the repo:

### GitHub Pages — no account beyond GitHub  ← this repo uses this

Published at **https://alexram77.github.io/AJR_MUI_Dashboard_Template_1/**.

> **Pages needs a public repository, unless you are on GitHub Pro/Team/Enterprise.** On a Free
> account a private repo cannot serve Pages at all — the workflow will build fine and then fail at
> `configure-pages` with *"Get Pages site failed: Not Found"*. If the repo must stay private, use
> Netlify or Vercel below; both serve a public site from a private repo on their free tiers.

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) is committed and runs on
every push to `main`, so the site above tracks `main` with nothing to do by hand.

If you fork this, **one setting has to be flipped by hand, once**:

> **Settings → Pages → Source → "GitHub Actions"**

Then re-run the latest deploy from the **Actions** tab (or push anything to `main`). That step
cannot be automated away: the Pages site has to exist before an Actions deploy can target it, and
creating it over the API needs a token allowed to administer the repo, which the Actions token is
not — it gets *"Resource not accessible by integration"* and the run fails there with the build
already green.

You get `https://<owner>.github.io/<repo>/`. The workflow sets `BASE_PATH` so assets resolve under
the sub-path, and copies `index.html` to `404.html` — Pages has no rewrite rules, so that is what
stops a deep link like `/charts` returning a 404.

### Netlify — works from a private repo, nicest URLs, deploy previews per PR

[`netlify.toml`](netlify.toml) is committed and needs no dashboard configuration: build command,
publish directory, Node version and the SPA redirect (`/* → /index.html`, 200) are all in it.
Connect the repo and it builds as-is. Free tier is fine for this, **including from a private
repository** — which is what makes it the right answer when the code should stay closed but the
demo should not.

### Vercel — no config file needed

Import the repo; it detects Vite, and its SPA fallback is automatic. Also serves a public site from
a private repo on the free tier.

### Any other host

```bash
npm run build                                  # → dist/
BASE_PATH=/sub/path/ npm run build             # if not served from the root
```

Serve `dist/` and rewrite unknown paths to `index.html`. Both modes are tested: the router takes
its basename from Vite's `BASE_URL`, so deep links resolve either way.

## Showing it off

- **Link to it.** The demo is self-contained and needs no backend — the terminal runs a shell in
  the browser, and every number is seeded mock data, so it renders identically on every load.
- **Embed it.** `<iframe src="https://…" style="width:100%;aspect-ratio:16/10;border:0"></iframe>`.
  It is responsive down to 320px, so it survives a narrow column.
- **Deep-link a page.** `/sensors`, `/builder` and `/terminal` are the ones worth opening cold;
  `/theme` doubles as the palette reference.
- Add the URL to the repo's **About → Website** field so it appears beside the description.

---

## What's in the kit

```
src/kit/
├── theme/              Palette, typography, and every MUI component override
│   ├── themePrimitives.ts       colour ramps, colorSchemes, typography, shape
│   ├── customizations/          overrides split by component category
│   ├── AppTheme.tsx             the one provider
│   ├── styleTokens.ts           shared sx fragments
│   └── chartTokens.ts           theme → chart-library colour bridge
│
├── layout/             The app frame, driven entirely by a NavConfig object
│   ├── AppShell.tsx             sidebar + top bar + main + mobile bottom bar
│   ├── SideMenu / TopBar / BottomNav
│   └── types.ts                 NavItem, NavSection, NavConfig, BrandConfig
│
├── components/         The blocks
│   ├── buttons/    ★   ActionButton (intents), ToolbarButton, ToolbarIconButton,
│   │                   MenuButton, SegmentedControl, ButtonRow, buttonTokens
│   ├── scroll/     ★   ScrollPanel (bounded), ScrollArea (fills), scrollbarSx tokens
│   ├── status/     ★   StatusDot, IndicatorBadge, AlertChip, ConnectionChip, TrendChip,
│   │                   FreshnessChip, LiveIndicator, CountBadge, QuotaBar,
│   │                   StorageMeterRow, StatusBar, indicatorTokens
│   ├── page/           PageContainer, PageHeader, PageTabs, SplitPane
│   ├── cards/          SectionCard, MetricCard, StatCard, SidebarCard
│   ├── controls/       SearchField
│   ├── feedback/       ConfirmDialog, FullScreenDialog, StateBlock, EmptyState
│   ├── data/           DataTable, KeyValueList
│   ├── meters/         GaugeMeter, LevelMeter, ThermometerMeter, StateMeter,
│   │                   TimeSeriesMeter, MeterCard
│   ├── charts/         AreaSeriesChart, LineSeriesChart, BarSeriesChart, Sparkline
│   ├── sensors/        ChannelCard, ChannelSection, MeterRenderer, channel status logic
│   ├── terminal/       TerminalPanel, CommandSidebar, ttyd + local transports
│   └── flow/           FlowEditor, FlowCanvas, BlockPalette, BlockNode, BlockInspector
│
├── hooks/              useIsMobile, useLocalStorage, usePersistedState, useAsync,
│                       usePolling, useDisclosure, useHistoryBuffer
└── utils/              format (fmtBytes, fmtPercent, fmtAge…), number, color
```

★ The three libraries that exist specifically to stop visual drift. Use them; never hand-roll a
button, a scrollbar rule, or a coloured status dot — see [Contributing](#contributing-and-a-note-for-ai-assistants).

Every folder has an `index.ts` barrel, and `src/kit/index.ts` re-exports the lot. Import at
whatever granularity suits you:

```tsx
import { SectionCard } from '@kit/components/cards';   // narrow
import { SectionCard, DataTable } from '@kit/components';
import { SectionCard } from '@kit';                    // everything
```

---

## Using it in a new project

**1. Copy `src/kit/` in**, and add the alias to `vite.config.ts` and `tsconfig.app.json`:

```ts
// vite.config.ts
resolve: { alias: { '@kit': fileURLToPath(new URL('./src/kit', import.meta.url)) } }
```
```json
// tsconfig.app.json
"paths": { "@kit/*": ["src/kit/*"] }
```

**2. Wrap the app in `AppTheme`:**

```tsx
import { AppTheme } from '@kit/theme';

createRoot(el).render(
  <AppTheme defaultMode="dark">
    <BrowserRouter><App /></BrowserRouter>
  </AppTheme>,
);
```

**3. Declare your navigation** — one object, and the sidebar, page titles and mobile bottom bar
all follow:

```tsx
export const NAV: NavConfig = {
  sections: [
    { items: [{ label: 'Overview', href: '/overview', icon: <DashboardIcon fontSize="small" />, primary: true }] },
    { label: 'Data', items: [{ label: 'Lake', href: '/lake', icon: <WaterIcon fontSize="small" /> }] },
  ],
  extraTitles: { '/catalog/search': 'Search Universe' },
};
```

**4. Mount the shell as a layout route:**

```tsx
<Routes>
  <Route element={<AppShell nav={NAV} brand={BRAND} topBarStatus={<MyStatus />} />}>
    <Route path="/overview" element={<OverviewPage />} />
  </Route>
</Routes>
```

**5. Write pages as composition:**

```tsx
export default function OverviewPage() {
  return (
    <PageContainer header={<PageHeader title="Overview" subtitle="…" />}>
      <SectionCard title="Throughput">
        <AreaSeriesChart rows={rows} xKey="day" series={[{ key: 'value' }]} />
      </SectionCard>
    </PageContainer>
  );
}
```

A page should contain no layout CSS, no bespoke card, and no colour literal. If you find yourself
writing one, that is the signal a block is missing — see
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how to add it.

---

## Contributing (and a note for AI assistants)

**Use the components in `src/kit` — don't write new ones that do the same thing.** That is the
whole point of the kit, and a near-duplicate is worse than no component: it looks right on its own
and wrong beside the real one.

Three groups exist specifically to stop that drift, each with one token file behind it:

| Need | Import from | Instead of |
|---|---|---|
| Any button, icon button, menu, button row | `@kit/components/buttons` | MUI `Button`/`IconButton` in a page |
| Any scrolling region | `@kit/components/scroll` | writing `::-webkit-scrollbar` rules |
| Anything reporting state — health, freshness, trend, capacity, liveness, counts | `@kit/components/status` | a bespoke coloured dot or chip |

Buttons take an **intent** (`primary`, `danger`, `ghost`…), not a variant and colour. Sizes and
icon scales come from `src/kit/theme/sizing.ts` and are applied as global MUI overrides — so never
set `fontSize` on a chip or a button icon in a component. That is exactly how six different chip
sizes ended up on one page.

Everything else: page shells in `components/page`, cards in `components/cards`, dialogs and
loading/error/empty states in `components/feedback`, tables in `components/data`, charts in
`components/charts`, meters in `components/meters`. Colours and spacing come from `@kit/theme`; a
hex literal in a component is a bug.

Conventions worth keeping (each came out of a real deployment going wrong): missing data renders as
`—`, never `0`; loading, error and empty are three distinct states; a health check in flight is not
a failure; simulated data is amber, never green. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) has
the rest, plus how to add a block.

Before opening a PR: `npm run verify`, then `npm run test:smoke` and `npm run test:mobile` against
a served build.

## Colour scheme

**Dark is the default, always.** The OS preference is deliberately not consulted: these dashboards
get looked at for hours in rooms that are not bright, and defaulting to light because someone's
laptop said so is the wrong call more often than it is right. The toggle is still there for anyone
who wants light, and their choice persists.

Dark applies from the **first painted frame**, not from React's first render. MUI only stamps
`data-mui-color-scheme` when its provider mounts, so without help the browser paints a white canvas
for as long as the bundle takes to arrive — a white flash on a dark app. The inline script and
critical CSS in [`index.html`](index.html) close that gap; the script itself is generated by
`colorSchemeInitScript()` in
[`src/kit/theme/initColorScheme.ts`](src/kit/theme/initColorScheme.ts).

Copying the kit into another project? Copy that `<head>` block too, or call
`applyStoredColorScheme()` at the top of your entry module if you cannot edit the HTML — it beats
React's render, though not the bundle download.

To follow the OS instead, pass `<AppTheme defaultMode="system">`. To force dark and drop light
entirely, pass `defaultMode="dark"` and leave `ColorModeToggle` out of your top bar.

## Retheming

Change the ramps in [`src/kit/theme/themePrimitives.ts`](src/kit/theme/themePrimitives.ts) and
nothing else. The default is a teal brand (`hsl(187 …)`) on a warm near-black dark scheme — the
palette both existing dashboards already share. The demo's **Theme Tokens** page renders straight
from those exports, so it shows the new values immediately.

## Stack

React 19 · MUI 7 (CSS variables + `colorSchemes`) · TypeScript 5.9 · Vite 7 · Recharts 3 ·
react-router 7 · xterm 6 · React Flow 12 · Playwright (tests only).

xterm and React Flow are only pulled in by the terminal and flow groups, and the demo lazy-loads
both — a page that does not use them does not pay for them.

MUI X (DataGrid, charts, date pickers) is deliberately *not* a dependency. When a project needs
it, register its theme customizations through the escape hatch rather than forking the kit:

```tsx
<AppTheme themeComponents={{ ...dataGridCustomizations }}>
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layer rules, conventions, adding a block
- [`docs/MOBILE.md`](docs/MOBILE.md) — the responsive contract and how it is enforced
