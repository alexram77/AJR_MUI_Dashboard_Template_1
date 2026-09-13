/**
 * Live channel monitoring — the sensor dashboard pattern.
 *
 * Everything on this page updates from one simulated snapshot loop, so it
 * exercises the parts a static showcase cannot: trend arrows resolving,
 * history filling the chart meters, and the alarm path lighting up end to end.
 */
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import { PageContainer, PageHeader } from '@kit/components/page';
import { ChannelCard, ChannelSection, trendFromHistory } from '@kit/components/sensors';
import type { MeterType } from '@kit/components/sensors';
import { AlertChip, IndicatorBadge, StatusBar } from '@kit/components/status';
import { AreaSeriesChart } from '@kit/components/charts';
import { useHistoryBuffer, usePersistedState, usePolling } from '@kit/hooks';
import { captionMuted } from '@kit/theme';
import { fmtNumber } from '@kit/utils';
import {
  CHANNELS,
  CHANNELS_BY_ID,
  CHANNEL_COLORS,
  SECTION_COLORS,
  SECTION_ORDER,
  SECTION_TITLES,
  simulateSnapshot,
} from '@demo/data/channels';

/** How often the simulated rig reports. */
const POLL_MS = 1000;

export default function SensorsPage() {
  const [phase, setPhase] = useState(0);
  const [faulted, setFaulted] = useState(false);
  const { history, push } = useHistoryBuffer(60);

  // Per-card meter overrides survive a reload — the same persistence a real
  // dashboard needs for a user's chosen layout.
  const [meterOverrides, setMeterOverrides] = usePersistedState<Record<string, MeterType>>(
    'demo:channel-meters',
    {},
  );
  const [aliases, setAliases] = usePersistedState<Record<string, string>>('demo:channel-aliases', {});

  const snapshot = useMemo(() => simulateSnapshot(phase, faulted), [phase, faulted]);

  usePolling(
    () => {
      setPhase((value) => value + 1);
      // Feed the buffer from the snapshot the next render will show.
      const next = simulateSnapshot(phase + 1, faulted);
      push(Object.fromEntries(Object.entries(next.readings).map(([id, r]) => [id, r.value])));
    },
    { intervalMs: POLL_MS },
  );

  const leaked = (snapshot.readings['safety.leak']?.value ?? 0) > 0.5;

  /** Rows for the combined plot beneath a section. */
  const plotRows = useMemo(() => {
    const ids = ['host.cpu_temp', 'host.cpu_load', 'host.ram_used'];
    const length = Math.max(...ids.map((id) => history[id]?.length ?? 0), 0);
    return Array.from({ length }, (_, index) => {
      const row: Record<string, string | number> = { t: String(index) };
      for (const id of ids) row[id] = history[id]?.[index]?.value ?? 0;
      return row;
    });
  }, [history]);

  return (
    <PageContainer
      wide
      header={
        <PageHeader
          title="Sensors"
          subtitle="Declare a channel — id, scale, healthy band, default meter — and the card, meter, status colouring and trend all follow. Updating live from a simulated rig."
          actions={
            <FormControlLabel
              control={<Switch checked={faulted} onChange={(_, checked) => setFaulted(checked)} />}
              label={<Typography sx={captionMuted}>Simulate fault</Typography>}
            />
          }
        />
      }
    >
      <StatusBar
        label="Rig"
        right={
          <Typography sx={captionMuted}>
            {fmtNumber(phase, 0)} samples · {POLL_MS}ms
          </Typography>
        }
      >
        <IndicatorBadge
          icon={<SensorsRoundedIcon sx={{ fontSize: '0.95rem' }} />}
          label={`${CHANNELS.length} channels`}
          color={SECTION_COLORS.environment}
          tooltip="Declared channel definitions"
        />
        <IndicatorBadge
          icon={<MemoryRoundedIcon sx={{ fontSize: '0.95rem' }} />}
          label={`CPU ${fmtNumber(snapshot.readings['host.cpu_temp']?.value, 1)}°C`}
          color={faulted ? SECTION_COLORS.safety : SECTION_COLORS.system}
          tooltip="Host core temperature"
        />
        <IndicatorBadge
          icon={<BoltRoundedIcon sx={{ fontSize: '0.95rem' }} />}
          label={`${fmtNumber(snapshot.readings['power.voltage']?.value, 2)} V`}
          color={SECTION_COLORS.power}
          tooltip="Battery bus voltage"
        />
        <AlertChip
          active={leaked}
          okLabel="No leak"
          alertLabel="LEAK DETECTED"
          okTooltip="No water ingress detected"
          alertTooltip="Water detected inside the housing"
        />
      </StatusBar>

      {SECTION_ORDER.map((section) => {
        const channels = CHANNELS.filter((channel) => channel.category === section);
        return (
          <ChannelSection
            key={section}
            title={SECTION_TITLES[section]}
            color={SECTION_COLORS[section]}
            count={channels.length}
            columns={section === 'safety' ? { xs: 12, sm: 6, md: 4 } : { xs: 6, sm: 4, md: 3, lg: 2 }}
            footer={
              section === 'system' && plotRows.length > 1 ? (
                <Box>
                  <Typography sx={{ ...captionMuted, mb: 1 }}>Combined history</Typography>
                  <AreaSeriesChart
                    rows={plotRows}
                    xKey="t"
                    height={180}
                    series={[
                      { key: 'host.cpu_temp', label: 'CPU temp', color: CHANNEL_COLORS['host.cpu_temp'] },
                      { key: 'host.cpu_load', label: 'CPU load', color: CHANNEL_COLORS['host.cpu_load'] },
                      { key: 'host.ram_used', label: 'RAM used', color: CHANNEL_COLORS['host.ram_used'] },
                    ]}
                    xFormat={() => ''}
                  />
                </Box>
              ) : undefined
            }
          >
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                definition={channel}
                reading={snapshot.readings[channel.id]}
                history={history[channel.id]}
                trend={trendFromHistory(history[channel.id] ?? [], channel)}
                meterType={meterOverrides[channel.id] ?? channel.meterType}
                alias={aliases[channel.id]}
                color={CHANNEL_COLORS[channel.id]}
                onMeterTypeChange={
                  channel.meterType === 'state'
                    ? undefined
                    : (next) => setMeterOverrides((prev) => ({ ...prev, [channel.id]: next }))
                }
                onAliasChange={(next) => setAliases((prev) => ({ ...prev, [channel.id]: next }))}
              />
            ))}
          </ChannelSection>
        );
      })}

      <Stack direction="row" spacing={1} sx={{ px: 0.5 }}>
        <Typography sx={captionMuted}>
          Click a card's speed icon to cycle its meter, or its title to rename it — both persist to
          localStorage, keyed per subject by <code>usePersistedState</code>. Channel definitions live in{' '}
          <code>src/demo/data/channels.ts</code>; {Object.keys(CHANNELS_BY_ID).length} are declared.
        </Typography>
      </Stack>
    </PageContainer>
  );
}
