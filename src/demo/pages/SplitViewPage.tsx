/**
 * SplitPane — the two-column page with a collapsible rail.
 *
 * Collapse it with the narrow chevron column on desktop; on a phone the rail
 * and the main area swap via the round button below the card.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SplitPane } from '@kit/components/page';
import { SidebarCard } from '@kit/components/cards';
import { KeyValueList } from '@kit/components/data';
import { AreaSeriesChart } from '@kit/components/charts';
import { FreshnessChip, StatusDot } from '@kit/components/status';
import { ToolbarButton } from '@kit/components/buttons';
import { bodyMuted, captionMuted } from '@kit/theme';
import { fmtCompact, fmtDateTime, fmtNumber, fmtPercent, toneToColor } from '@kit/utils';
import { GRADE_TONE, SERVICE_ROWS } from '@demo/data/tableRows';
import { performanceRows } from '@demo/data/series';

export default function SplitViewPage() {
  const [selectedId, setSelectedId] = useState(SERVICE_ROWS[0].id);
  const selected = SERVICE_ROWS.find((row) => row.id === selectedId) ?? SERVICE_ROWS[0];

  // ── Left rail: a selectable list of records ───────────────────────────────
  const rail = (
    <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
      <SidebarCard label="Services" sx={{ flex: 1 }}>
        <List dense disablePadding>
          {SERVICE_ROWS.map((row) => (
            <ListItemButton
              key={row.id}
              selected={row.id === selectedId}
              onClick={() => setSelectedId(row.id)}
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemText
                primary={row.name}
                secondary={row.region}
                slotProps={{
                  primary: { fontSize: '0.82rem', fontWeight: row.id === selectedId ? 600 : 400 },
                  secondary: { fontSize: '0.7rem' },
                }}
              />
              <StatusDot
                name={row.grade}
                state={row.grade === 'healthy' ? 'ok' : row.grade === 'watch' ? 'degraded' : 'down'}
                hideLabel
              />
            </ListItemButton>
          ))}
        </List>
      </SidebarCard>
    </Box>
  );

  // ── Main area: detail for whatever the rail selected ──────────────────────
  return (
    <SplitPane rail={rail} railWidth={280}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap" useFlexGap>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selected.name}
            </Typography>
            <Chip size="small" variant="outlined" color={toneToColor(GRADE_TONE[selected.grade])} label={selected.grade} />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <FreshnessChip asof={selected.lastDeploy} budgetSeconds={48 * 3600} label="deploy" />
            <ToolbarButton variant="outlined">Restart</ToolbarButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: { xs: 2, md: 3 }, display: 'grid', gap: 2.5 }}>
        <Typography sx={bodyMuted}>
          The rail and the main area both stay mounted when hidden, so selection and scroll position
          survive a collapse or a mobile swap.
        </Typography>

        <KeyValueList
          entries={[
            { label: 'Service id', value: selected.id },
            { label: 'Region', value: selected.region },
            { label: 'Requests / min', value: fmtCompact(selected.requestsPerMin) },
            { label: 'p95 latency', value: `${fmtNumber(selected.p95Ms, 0)} ms` },
            { label: 'Error rate', value: fmtPercent(selected.errorRate, 3) },
            { label: 'Last deploy', value: fmtDateTime(selected.lastDeploy) },
          ]}
        />

        <Divider />

        <Box>
          <Typography sx={{ ...captionMuted, mb: 1 }}>Throughput, last 30 days</Typography>
          <AreaSeriesChart
            rows={performanceRows}
            xKey="day"
            series={[{ key: 'strategy', label: selected.name }]}
            yFormat={(value) => fmtCompact(value)}
            height={240}
          />
        </Box>
      </Box>
    </SplitPane>
  );
}
