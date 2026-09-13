/**
 * Page shells and content cards, with the tabs row wired up so the
 * `PageContainer tabs` slot is visible in its real position.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import ViewAgendaRoundedIcon from '@mui/icons-material/ViewAgendaRounded';
import { PageContainer, PageHeader, PageTabs } from '@kit/components/page';
import { ScrollArea, ScrollPanel, scrollbarSx } from '@kit/components/scroll';
import { MetricCard, SectionCard, SidebarCard, StatCard } from '@kit/components/cards';
import { FreshnessChip, TrendChip } from '@kit/components/status';
import { bodyMuted, captionMuted, insetPanel } from '@kit/theme';
import { fmtCompact, fmtCurrency, fmtPercent } from '@kit/utils';
import { throughputSeries } from '@demo/data/series';
import { hoursAgo, minutesAgo } from '@demo/data/timestamps';

type TabValue = 'cards' | 'shells' | 'scroll';

const TABS = [
  { value: 'cards' as const, label: 'Cards', icon: <GridViewRoundedIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'shells' as const, label: 'Shells', icon: <LayersRoundedIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'scroll' as const, label: 'Scroll panels', icon: <ViewAgendaRoundedIcon sx={{ fontSize: '0.9rem' }} /> },
];

/** Cards tab — every card variant side by side. */
function CardsTab() {
  return (
    <>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Open positions" value="24" helper="across 4 books" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Capture ratio"
            value={fmtPercent(0.271)}
            helper="sum(captured) / sum(available)"
            badge={<TrendChip label="+3.1pp" trend="up" variant="outlined" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Net asset value"
            value={fmtCurrency(1_284_400)}
            helper="marked to close"
            badge={<FreshnessChip asof={minutesAgo(21)} budgetSeconds={3600} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Requests"
            value={fmtCompact(throughputSeries.at(-1))}
            change="+12.4%"
            trend="up"
            interval="Last 30 days"
            data={throughputSeries}
          />
        </Grid>
      </Grid>

      <SectionCard title="SectionCard" subtitle="The default content container. Title, optional subtitle, arbitrary body.">
        <Typography sx={bodyMuted}>
          Most page bodies are a vertical stack of these. The PageContainer supplies the 2.5-unit gap
          between them, so a page never sets its own vertical rhythm.
        </Typography>
      </SectionCard>

      <SectionCard
        title="Collapsible, with a summary"
        subtitle="The summary stays visible when folded, so a collapsed section still carries its headline number."
        collapsible
        summary={<TrendChip label="+18.2%" trend="up" />}
        headerExtra={<FreshnessChip asof={hoursAgo(1)} budgetSeconds={7200} label="run" />}
      >
        <Typography sx={bodyMuted}>
          Body content is unmounted while collapsed, so an expensive chart inside a folded section
          costs nothing until it is opened.
        </Typography>
      </SectionCard>
    </>
  );
}

/** Shells tab — an explanation of the frame this very page is rendering in. */
function ShellsTab() {
  return (
    <>
      <SectionCard title="PageContainer" subtitle="The frame around this text.">
        <Typography sx={bodyMuted} component="div">
          One bordered card filling the area under the top bar, with three slots:
          <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
            <li><code>tabs</code> — the row above, flush with the card's top edge</li>
            <li><code>header</code> — the title band with its bottom divider</li>
            <li><code>children</code> — this body, which scrolls internally</li>
          </Box>
        </Typography>
      </SectionCard>

      <SectionCard title="AppShell" subtitle="Everything outside the card.">
        <Typography sx={bodyMuted}>
          Sidebar, top bar and mobile bottom bar. It pins itself to 100dvh and hides overflow, so
          scrolling happens inside the page card rather than on the document — which is what keeps
          the chrome fixed without any position: fixed.
        </Typography>
      </SectionCard>

      <SectionCard title="SidebarCard" subtitle="For a SplitPane rail. See the Split View page for it in context.">
        <Box sx={{ maxWidth: 300 }}>
          <SidebarCard label="Instruments">
            {['Pressure', 'Temperature', 'Flow rate'].map((name) => (
              <Box key={name} sx={{ px: 2, py: 0.75, fontSize: '0.85rem' }}>
                {name}
              </Box>
            ))}
          </SidebarCard>
        </Box>
      </SectionCard>
    </>
  );
}

/** Scroll tab — the two scrollers and the bar variants. */
function ScrollTab() {
  return (
    <>
      <SectionCard
        title="ScrollPanel"
        subtitle="Caps its own height and scrolls a list inside it, so the page chrome around it stays put. The default cap is shorter on xs — a 460px list on a phone swallows the viewport and hides that anything follows."
      >
        <ScrollPanel maxHeight={240}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 24 }, (_, index) => (
              <Box key={index} sx={insetPanel}>
                <Typography sx={{ fontSize: '0.8rem' }}>Row {index + 1}</Typography>
                <Typography sx={bodyMuted}>The panel caps its height; the page never grows.</Typography>
              </Box>
            ))}
          </Box>
        </ScrollPanel>
      </SectionCard>

      <SectionCard
        title="ScrollArea"
        subtitle="Fills its flex parent instead of capping itself. Fade edges are a quiet signal that a region scrolls — worth it on touch, where no scrollbar appears until the user already started."
      >
        <Box sx={{ height: 220, display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <ScrollArea fadeEdges padding={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Array.from({ length: 20 }, (_, index) => (
                <Typography key={index} sx={{ fontSize: '0.82rem' }}>
                  Line {index + 1} — scroll to see the fade appear at the top edge.
                </Typography>
              ))}
            </Box>
          </ScrollArea>
        </Box>
      </SectionCard>

      <SectionCard
        title="Scrollbar variants"
        subtitle="scrollbarSx() emits both the WebKit rules and the Firefox properties — writing one and forgetting the other is the usual failure. The theme applies `thin` globally, so most surfaces need nothing."
      >
        <Grid container spacing={2.5}>
          {(['thin', 'comfortable', 'overlay', 'hidden'] as const).map((variant) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={variant}>
              <Typography sx={{ ...captionMuted, mb: 0.75, display: 'block' }}>{variant}</Typography>
              <Box
                sx={{
                  height: 150,
                  p: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: variant === 'overlay' ? '#0b1220' : 'background.paper',
                  overflowY: 'auto',
                  ...scrollbarSx(variant),
                }}
              >
                {Array.from({ length: 14 }, (_, index) => (
                  <Typography
                    key={index}
                    sx={{ fontSize: '0.78rem', color: variant === 'overlay' ? '#d0dce8' : 'text.primary' }}
                  >
                    Row {index + 1}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

export default function BlocksPage() {
  const [tab, setTab] = useState<TabValue>('cards');

  return (
    <PageContainer
      tabs={<PageTabs tabs={TABS} value={tab} onChange={setTab} />}
      header={
        <PageHeader
          title="Cards & Shells"
          subtitle="The containers everything else renders inside. Every page in a kit app is one PageContainer wrapping a stack of cards."
        />
      }
    >
      {tab === 'cards' && <CardsTab />}
      {tab === 'shells' && <ShellsTab />}
      {tab === 'scroll' && <ScrollTab />}
    </PageContainer>
  );
}
