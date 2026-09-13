/**
 * The SVG instrument meters — gauge, level, thermometer and discrete state.
 *
 * A live slider drives every meter at once so the optimal-range rendering and
 * the fault pulse are visible without waiting for mock data to change.
 */
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import { GaugeMeter, LevelMeter, MeterCard, StateMeter, ThermometerMeter } from '@kit/components/meters';
import { bodyMuted, captionMuted } from '@kit/theme';
import { INSTRUMENTS, LEAK_STATES, LINK_STATES, POWER_STATES } from '@demo/data/instruments';

export default function MetersPage() {
  // One shared 0–100 position, mapped onto each instrument's own scale.
  const [position, setPosition] = useState(62);

  /** Map the shared slider position onto an instrument's range. */
  const valueFor = (min: number, max: number) => min + ((max - min) * position) / 100;

  return (
    <PageContainer
      header={
        <PageHeader
          title="Meters"
          subtitle="Hand-drawn SVG rather than a chart library, for exact control over concentric arcs, tick placement and optimal-range brackets."
          actions={
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: { xs: '100%', md: 260 } }}>
              <Typography sx={captionMuted}>Drive all</Typography>
              <Slider
                size="small"
                value={position}
                onChange={(_, next) => setPosition(next as number)}
                aria-label="Meter position"
              />
            </Stack>
          }
        />
      }
    >
      <SectionCard
        title="GaugeMeter"
        subtitle="Half-circle with a needle. The optimal band is a concentric arc outside the bar, so 'where it is' and 'where it should be' stay two separate readings."
      >
        <Grid container spacing={2.5}>
          {INSTRUMENTS.slice(0, 3).map((instrument) => {
            const value = valueFor(instrument.min, instrument.max);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={instrument.id}>
                <MeterCard label={instrument.label} value={value} unit={instrument.unit}>
                  <GaugeMeter
                    value={value}
                    min={instrument.min}
                    max={instrument.max}
                    optimalMin={instrument.optimalMin}
                    optimalMax={instrument.optimalMax}
                  />
                </MeterCard>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="LevelMeter"
            subtitle="Segmented horizontal bar, legible across a room. Optimal band underneath, proportion ticks below that."
          >
            <Grid container spacing={2.5}>
              {INSTRUMENTS.slice(0, 4).map((instrument) => {
                const value = valueFor(instrument.min, instrument.max);
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={instrument.id}>
                    <MeterCard label={instrument.label} value={value} unit={instrument.unit}>
                      <LevelMeter
                        value={value}
                        min={instrument.min}
                        max={instrument.max}
                        optimalMin={instrument.optimalMin}
                        optimalMax={instrument.optimalMax}
                      />
                    </MeterCard>
                  </Grid>
                );
              })}
            </Grid>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="ThermometerMeter"
            subtitle="Ticks left, optimal bracket right, so the two annotations never collide."
          >
            <Grid container spacing={2.5}>
              {INSTRUMENTS.slice(2, 5).map((instrument) => {
                const value = valueFor(instrument.min, instrument.max);
                return (
                  <Grid size={4} key={instrument.id}>
                    <MeterCard label={instrument.label} value={value} unit={instrument.unit}>
                      <ThermometerMeter
                        value={value}
                        min={instrument.min}
                        max={instrument.max}
                        optimalMin={instrument.optimalMin}
                        optimalMax={instrument.optimalMax}
                      />
                    </MeterCard>
                  </Grid>
                );
              })}
            </Grid>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="StateMeter"
        subtitle="Discrete states rather than a number. States are declared by the caller, so the same tile serves a leak sensor, a power source and a link status."
      >
        <Typography sx={{ ...bodyMuted, mb: 2 }}>
          A `bad` state pulses — a fault that looks like every other tile is a fault nobody sees.
          Slide past 66% to trip the leak and battery tiles.
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StateMeter value={position > 66 ? 1 : 0} states={LEAK_STATES} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StateMeter value={position > 66 ? 3 : position > 33 ? 2 : 1} states={POWER_STATES} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StateMeter value={position > 66 ? 'offline' : position > 33 ? 'syncing' : 'online'} states={LINK_STATES} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StateMeter value="not-a-declared-state" states={LINK_STATES} unknownLabel="No reading" />
          </Grid>
        </Grid>
      </SectionCard>
    </PageContainer>
  );
}
