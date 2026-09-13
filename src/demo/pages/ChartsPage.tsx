/**
 * Every chart the kit ships, against the same themed token set.
 */
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import { AreaSeriesChart, BarSeriesChart, LineSeriesChart, Sparkline } from '@kit/components/charts';
import { SegmentedControl } from '@kit/components/buttons';
import { bodyMuted, captionMuted } from '@kit/theme';
import { fmtCompact, fmtCurrency } from '@kit/utils';
import {
  costSeries,
  errorSeries,
  latencySeries,
  performanceRows,
  sourceMixRows,
  throughputSeries,
} from '@demo/data/series';

/** Window options for the range selector. Value is a row count. */
const RANGES = [
  { value: 7, label: '7D' },
  { value: 14, label: '14D' },
  { value: 30, label: '30D' },
];

export default function ChartsPage() {
  const [range, setRange] = useState(30);
  const [stacked, setStacked] = useState<'stacked' | 'grouped'>('stacked');

  // Slicing from the end keeps the most recent window, which is what a range
  // selector means everywhere else in the product.
  const windowed = performanceRows.slice(-range);

  return (
    <PageContainer
      wide
      header={
        <PageHeader
          title="Charts"
          subtitle="Thin wrappers over Recharts. Colours, axes, grid and tooltips all resolve from the live theme, so charts restyle with the app."
          actions={
            <SegmentedControl
              options={RANGES}
              value={range}
              onChange={setRange}
              ariaLabel="Chart window"
            />
          }
        />
      }
    >
      <SectionCard
        title="AreaSeriesChart"
        subtitle="The default for a quantity over time. A dashed series marks a benchmark or projection."
      >
        <AreaSeriesChart
          rows={windowed}
          xKey="day"
          series={[
            { key: 'strategy', label: 'Strategy' },
            { key: 'benchmark', label: 'Benchmark', dashed: true },
          ]}
          yFormat={(value) => fmtCurrency(value)}
          height={300}
        />
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title="LineSeriesChart"
            subtitle="Prefer lines when series must be compared — overlapping fills hide crossings."
          >
            <LineSeriesChart
              rows={windowed}
              xKey="day"
              series={[
                { key: 'strategy', label: 'Strategy' },
                { key: 'benchmark', label: 'Benchmark' },
              ]}
              yFormat={(value) => fmtCompact(value)}
              height={260}
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title="BarSeriesChart"
            subtitle="Categorical comparisons and counts. Stack for composition, group for comparison."
            headerExtra={
              <SegmentedControl
                options={[
                  { value: 'stacked' as const, label: 'Stacked' },
                  { value: 'grouped' as const, label: 'Grouped' },
                ]}
                value={stacked}
                onChange={setStacked}
                ariaLabel="Bar layout"
              />
            }
          >
            <BarSeriesChart
              rows={sourceMixRows}
              xKey="day"
              stacked={stacked === 'stacked'}
              series={[
                { key: 'api', label: 'API' },
                { key: 'batch', label: 'Batch' },
                { key: 'stream', label: 'Stream' },
              ]}
              yFormat={(value) => fmtCompact(value, 0)}
              height={260}
            />
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="Sparkline"
        subtitle="Shape only — no axes, no tooltip. Read the number beside it, never a value off the line."
      >
        <Grid container spacing={2.5}>
          {[
            { label: 'Throughput', data: throughputSeries, trend: 'up' as const },
            { label: 'Latency', data: latencySeries, trend: 'down' as const },
            { label: 'Errors', data: errorSeries, trend: 'down' as const },
            { label: 'Spend', data: costSeries, trend: 'flat' as const },
          ].map((item) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.label}>
              <Stack spacing={0.5}>
                <Typography sx={captionMuted}>{item.label}</Typography>
                <Sparkline data={item.data} trend={item.trend} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard title="Empty and loading states" subtitle="Every chart handles both, so a page never has to.">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ ...bodyMuted, mb: 1 }}>loading</Typography>
            <LineSeriesChart rows={[]} xKey="day" series={[]} loading height={180} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ ...bodyMuted, mb: 1 }}>empty</Typography>
            <LineSeriesChart
              rows={[]}
              xKey="day"
              series={[]}
              height={180}
              emptyMessage="No marks recorded in this window."
            />
          </Grid>
        </Grid>
      </SectionCard>
    </PageContainer>
  );
}
