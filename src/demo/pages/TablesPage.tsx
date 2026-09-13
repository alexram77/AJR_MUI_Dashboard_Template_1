/**
 * DataTable and KeyValueList — the two ways the kit shows structured records.
 */
import { useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import { DataTable, KeyValueList } from '@kit/components/data';
import type { DataColumn } from '@kit/components/data';
import { SegmentedControl } from '@kit/components/buttons';
import { SearchField } from '@kit/components/controls';
import { FreshnessChip, TrendChip } from '@kit/components/status';
import { fmtCompact, fmtDateTime, fmtNumber, fmtPercent, toneToColor } from '@kit/utils';
import { GRADE_TONE, SERVICE_ROWS } from '@demo/data/tableRows';
import type { ServiceRow } from '@demo/data/tableRows';
import { minutesAgo } from '@demo/data/timestamps';

/** Filter options for the state showcase, including the deliberate empty case. */
const FILTERS = [
  { value: 'all' as const, label: 'All' },
  { value: 'healthy' as const, label: 'Healthy' },
  { value: 'problem' as const, label: 'Problems' },
  { value: 'none' as const, label: 'Empty result' },
];

const COLUMNS: DataColumn<ServiceRow>[] = [
  { id: 'id', label: 'ID', width: 84, render: (row) => row.id, sortValue: (row) => row.id },
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
  {
    id: 'deploy',
    label: 'Last deploy',
    render: (row) => fmtDateTime(row.lastDeploy),
    sortValue: (row) => row.lastDeploy,
  },
];

export default function TablesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all');
  const [selected, setSelected] = useState<ServiceRow>(SERVICE_ROWS[0]);

  const rows = useMemo(() => {
    if (filter === 'none') return [];

    return SERVICE_ROWS.filter((row) => {
      const matchesQuery =
        query === '' ||
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.region.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'healthy' && row.grade === 'healthy') ||
        (filter === 'problem' && row.grade !== 'healthy');

      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <PageContainer
      wide
      header={
        <PageHeader
          title="Tables & Detail"
          subtitle="DataTable is column-driven and generic over the row type, so `render` receives a fully typed row. Click a row to load it into the detail panel."
          actions={
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <SearchField value={query} onChange={setQuery} placeholder="Filter services…" />
              <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} ariaLabel="Health filter" />
            </Stack>
          }
        />
      }
    >
      <SectionCard
        title="DataTable"
        subtitle="Sortable headers, a pinned head row, and the loading / error / empty states handled internally."
        headerExtra={<FreshnessChip asof={minutesAgo(6)} budgetSeconds={900} label="inventory" />}
      >
        <DataTable
          rows={rows}
          columns={COLUMNS}
          rowKey={(row) => row.id}
          defaultSortBy="rpm"
          defaultSortDir="desc"
          onRowClick={setSelected}
          emptyMessage="No service matches this filter. Try 'All'."
        />
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title={`Detail — ${selected.name}`}
            subtitle="KeyValueList renders string values in monospace so ids and numbers stay column-aligned."
          >
            <KeyValueList
              entries={[
                { label: 'Service id', value: selected.id },
                { label: 'Region', value: selected.region },
                { label: 'Requests / min', value: fmtCompact(selected.requestsPerMin) },
                { label: 'p95 latency', value: `${fmtNumber(selected.p95Ms, 0)} ms` },
                { label: 'Error rate', value: fmtPercent(selected.errorRate, 3) },
                { label: 'Last deploy', value: fmtDateTime(selected.lastDeploy) },
                {
                  label: 'Health',
                  value: (
                    <Chip
                      size="small"
                      variant="outlined"
                      color={toneToColor(GRADE_TONE[selected.grade])}
                      label={selected.grade}
                    />
                  ),
                },
                { label: 'Week over week', value: <TrendChip label="+4.1%" trend="up" variant="outlined" /> },
              ]}
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Single column"
            subtitle="Same component, `columns={1}` and prose values for a narrow rail."
          >
            <KeyValueList
              columns={1}
              proseValues
              entries={[
                { label: 'Owner', value: 'Platform team' },
                { label: 'Runbook', value: 'Restart the relay, then drain the retry queue.' },
                { label: 'On call', value: 'Rotation B' },
                { label: 'Escalation', value: 'Page after two consecutive failed health checks.' },
              ]}
            />
          </SectionCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
