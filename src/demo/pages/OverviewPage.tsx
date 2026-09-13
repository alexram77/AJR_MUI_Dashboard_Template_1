/**
 * The canonical dashboard page: a stat row, a comparison chart, and a table.
 *
 * Read this first — it is the shape most real pages take, and it is entirely
 * composition. No layout CSS, no bespoke card, no colour literal.
 */
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard, StatCard } from '@kit/components/cards';
import { AreaSeriesChart, BarSeriesChart } from '@kit/components/charts';
import { DataTable } from '@kit/components/data';
import type { DataColumn } from '@kit/components/data';
import { FreshnessChip, StatusBar, StatusDot } from '@kit/components/status';
import { fmtCompact, fmtCurrency, fmtNumber, fmtPercent, toneToColor } from '@kit/utils';
import {
  costSeries,
  errorSeries,
  latencySeries,
  performanceRows,
  sourceMixRows,
  throughputSeries,
} from '@demo/data/series';
import { GRADE_TONE, SERVICE_ROWS } from '@demo/data/tableRows';
import type { ServiceRow } from '@demo/data/tableRows';
import { hoursAgo, minutesAgo } from '@demo/data/timestamps';

/** Columns for the service table. Declared outside the component so the array
 *  identity is stable across renders. */
const COLUMNS: DataColumn<ServiceRow>[] = [
  { id: 'name', label: 'Service', render: (row) => row.name, sortValue: (row) => row.name },
  { id: 'region', label: 'Region', render: (row) => row.region, sortValue: (row) => row.region },
  {
    id: 'grade',
    label: 'Health',
    render: (row) => (
      <Chip size="small" variant="outlined" color={toneToColor(GRADE_TONE[row.grade])} label={row.grade} />
    ),
    sortValue: (row) => row.grade,
  },
  {
    id: 'rpm',
    label: 'Req/min',
    align: 'right',
    render: (row) => fmtCompact(row.requestsPerMin),
    sortValue: (row) => row.requestsPerMin,
  },
  {
    id: 'p95',
    label: 'p95',
    align: 'right',
    render: (row) => `${fmtNumber(row.p95Ms, 0)} ms`,
    sortValue: (row) => row.p95Ms,
  },
  {
    id: 'errors',
    label: 'Error rate',
    align: 'right',
    render: (row) => fmtPercent(row.errorRate, 2),
    sortValue: (row) => row.errorRate,
  },
];

export default function OverviewPage() {
  return (
    <PageContainer
      header={
        <PageHeader
          title="Overview"
          subtitle="The standard dashboard page — a stat row, a comparison chart, a composition chart and a table, composed entirely from kit blocks."
          actions={<FreshnessChip asof={minutesAgo(12)} budgetSeconds={3600} label="metrics" />}
        />
      }
    >
      <StatusBar label="Services" right={<FreshnessChip asof={minutesAgo(4)} budgetSeconds={600} />}>
        <StatusDot name="ingest-gateway" state="ok" detail="84ms p95" />
        <StatusDot name="scoring-api" state="degraded" detail="318ms p95, 0.9% errors" />
        <StatusDot name="notify-relay" state="down" detail="4.7% error rate" />
        <StatusDot name="archive-writer" state="checking" />
      </StatusBar>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Throughput"
            value={fmtCompact(throughputSeries.at(-1))}
            change="+12.4%"
            trend="up"
            interval="Last 30 days"
            data={throughputSeries}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="p95 latency"
            value={`${fmtNumber(latencySeries.at(-1), 0)} ms`}
            change="-8.1%"
            trend="down"
            invertTrendColors
            interval="Last 30 days"
            data={latencySeries}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Error rate"
            value={`${fmtNumber(errorSeries.at(-1), 2)}%`}
            change="-31.0%"
            trend="down"
            invertTrendColors
            interval="Last 30 days"
            data={errorSeries}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Daily spend"
            value={fmtCurrency(costSeries.at(-1))}
            change="+2.2%"
            trend="up"
            invertTrendColors
            interval="Last 30 days"
            data={costSeries}
          />
        </Grid>
      </Grid>

      <SectionCard
        title="Strategy vs benchmark"
        subtitle="Two series on one scale. Benchmark-relative, because a raw return during a rising market is beta, not skill."
        headerExtra={<FreshnessChip asof={hoursAgo(3)} budgetSeconds={7200} label="marks" />}
      >
        <AreaSeriesChart
          rows={performanceRows}
          xKey="day"
          series={[
            { key: 'strategy', label: 'Strategy' },
            { key: 'benchmark', label: 'Benchmark', dashed: true },
          ]}
          yFormat={(value) => fmtCompact(value)}
          height={300}
        />
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard title="Ingest by source" subtitle="Stacked composition over the last twelve days.">
            <BarSeriesChart
              rows={sourceMixRows}
              xKey="day"
              stacked
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

        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Service inventory"
            subtitle="Sortable table. Click a column header to reorder."
            headerExtra={
              <Stack direction="row" spacing={1}>
                <Chip size="small" variant="outlined" color="success" label="7 healthy" />
                <Chip size="small" variant="outlined" color="warning" label="2 watch" />
                <Chip size="small" variant="outlined" color="error" label="1 degraded" />
              </Stack>
            }
          >
            <DataTable
              rows={SERVICE_ROWS}
              columns={COLUMNS}
              rowKey={(row) => row.id}
              defaultSortBy="rpm"
              defaultSortDir="desc"
              maxHeight={{ xs: 320, md: 300 }}
            />
          </SectionCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
