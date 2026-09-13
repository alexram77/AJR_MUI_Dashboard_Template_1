/**
 * Status indicators: health dots, direction chips, freshness badges and
 * capacity bars.
 */
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import {
  AlertChip,
  ConnectionChip,
  CountBadge,
  FreshnessChip,
  IndicatorBadge,
  LiveIndicator,
  QuotaBar,
  StatusBar,
  StatusDot,
  StorageMeterRow,
  TrendChip,
} from '@kit/components/status';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import SdStorageRoundedIcon from '@mui/icons-material/SdStorageRounded';
import UsbRoundedIcon from '@mui/icons-material/UsbRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { captionMuted } from '@kit/theme';
import { fmtBytes, fmtCompact } from '@kit/utils';
import { daysAgo, hoursAgo, minutesAgo } from '@demo/data/timestamps';

/** Freshness examples, each with its own budget. */
const FRESHNESS_CASES = [
  { label: 'live feed', asof: minutesAgo(1), budget: 120 },
  { label: 'nightly', asof: hoursAgo(9), budget: 26 * 3600 },
  { label: 'grades', asof: daysAgo(3), budget: 26 * 3600 },
  { label: 'never run', asof: null, budget: 3600 },
];

export default function StatusPage() {
  return (
    <PageContainer
      header={
        <PageHeader
          title="Status"
          subtitle="Honest-by-default indicators: 'checking' is not 'down', an unknown age is not a fresh one, and a metric where down is good does not render red."
        />
      }
    >
      <StatusBar label="Pipeline" right={<FreshnessChip asof={minutesAgo(2)} budgetSeconds={300} />}>
        <StatusDot name="scheduler" state="ok" detail="next fire in 3m" />
        <StatusDot name="ingest" state="ok" detail="1.8k rows/min" />
        <StatusDot name="scoring" state="degraded" detail="queue depth 412" />
        <StatusDot name="archive" state="down" detail="disk full on node 3" />
        <StatusDot name="backup" state="checking" />
        <LiveIndicator state="live" />
      </StatusBar>

      <SectionCard
        title="Liveness, alerts and counts"
        subtitle="The three indicators that answer an operator's first questions: is this updating, is anything wrong, and how many."
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
            <LiveIndicator state="live" />
            <LiveIndicator state="stale" ageSeconds={320} />
            <LiveIndicator state="paused" ageSeconds={1450} />
            <Typography sx={captionMuted}>
              Only a live stream animates — a paused dot that pulses is a lie.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <CountBadge label="healthy" count={7} tone="ok" />
            <CountBadge label="watch" count={2} tone="warn" />
            <CountBadge label="degraded" count={1} tone="bad" />
            <CountBadge label="failed" count={0} tone="bad" />
            <Typography sx={captionMuted}>
              Zero renders muted rather than hidden — "0 failures" is information.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
            <AlertChip active={false} okLabel="No leak" alertLabel="LEAK DETECTED" />
            <AlertChip active okLabel="No leak" alertLabel="LEAK DETECTED" />
            <AlertChip active severity="warning" okLabel="Nominal" alertLabel="OVER TEMP" />
          </Stack>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
            <IndicatorBadge icon={<CheckCircleRoundedIcon sx={{ fontSize: '0.95rem' }} />} label="Connected · 24 ms" color="#00e676" />
            <IndicatorBadge icon={<ScienceRoundedIcon sx={{ fontSize: '0.95rem' }} />} label="Demo mode" color="#ffd740" tooltip="Simulated data — no backend" />
            <IndicatorBadge icon={<MemoryRoundedIcon sx={{ fontSize: '0.95rem' }} />} label="rig-04" color="#00bcd4" />
            <ConnectionChip connected modeLabel="LAN" latencyMs={24} detail="192.168.1.40:8787" />
            <ConnectionChip connected={false} connectLabel="Connect" />
          </Stack>
        </Stack>
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="StatusDot"
            subtitle="Only a healthy service glows — a red glow reads as an alarm rather than a state."
          >
            <Stack spacing={1.5}>
              {(['ok', 'degraded', 'down', 'checking'] as const).map((state) => (
                <Stack key={state} direction="row" spacing={2} alignItems="center">
                  <StatusDot name={state} state={state} detail={`state = ${state}`} hideLabel />
                  <Typography sx={{ fontSize: '0.8rem' }}>{state}</Typography>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="TrendChip"
            subtitle="`invertColors` flips the mapping for metrics where down is good — latency, error rate, cost."
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <TrendChip label="+12.4%" trend="up" />
                <TrendChip label="-8.1%" trend="down" />
                <TrendChip label="0.0%" trend="flat" />
                <TrendChip label="+4.2pp" trend="up" variant="outlined" />
              </Stack>
              <Typography sx={captionMuted}>Inverted — a latency drop reads as good:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <TrendChip label="-31.0%" trend="down" invertColors />
                <TrendChip label="+18.0%" trend="up" invertColors />
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="FreshnessChip"
        subtitle="Green within budget, amber past it. A missing timestamp renders a neutral dash — an unknown age is not a fresh one."
      >
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
          {FRESHNESS_CASES.map((item) => (
            <Stack key={item.label} spacing={0.5} alignItems="flex-start">
              <FreshnessChip asof={item.asof} budgetSeconds={item.budget} label={item.label} />
              <Typography sx={captionMuted}>budget {item.budget}s</Typography>
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="QuotaBar"
        subtitle="Colour steps at the warn and critical thresholds, so a full bar is visible peripherally without reading the number."
      >
        <Stack spacing={3}>
          <QuotaBar
            label="LAKE"
            used={412_000_000_000}
            total={1_000_000_000_000}
            format={fmtBytes}
            breakdown={[
              ['raw', 240_000_000_000],
              ['curated', 132_000_000_000],
              ['archive', 40_000_000_000],
            ]}
          />
          <QuotaBar label="CACHE" used={806_000_000_000} total={1_000_000_000_000} format={fmtBytes} />
          <QuotaBar label="TOKENS" used={952_000} total={1_000_000} format={(value) => fmtCompact(value)} />
          <QuotaBar label="DENSE" used={640_000_000_000} total={1_000_000_000_000} format={fmtBytes} dense />
        </Stack>
      </SectionCard>

      <SectionCard
        title="StorageMeterRow"
        subtitle="Per-volume detail. Headlines free space rather than used, because that is the number deciding whether the next capture fits."
      >
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <StorageMeterRow label="root" used={412e9} total={1e12} icon={<SdStorageRoundedIcon />} />
          <StorageMeterRow label="capture" used={806e9} total={1e12} icon={<UsbRoundedIcon />} tag="data" />
          <StorageMeterRow label="archive" used={78e9} total={2e12} icon={<CloudRoundedIcon />} />
          <StorageMeterRow label="scratch" used={14e9} total={null} icon={<StorageRoundedIcon />} />
        </Stack>
      </SectionCard>
    </PageContainer>
  );
}
