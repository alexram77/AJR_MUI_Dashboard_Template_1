/**
 * Channel declarations and a simulator for the sensors demo.
 *
 * The definitions are the shape a real project ships: an id, a scale, a
 * healthy band, and a default meter. The simulator walks each channel around
 * its base value so the page is alive without a backend.
 */
import type { ChannelDefinition, ChannelSnapshot } from '@kit/components/sensors';

/** Section colours. One place to retheme every band on the page. */
export const SECTION_COLORS = {
  system: 'hsl(142, 65%, 50%)',
  environment: 'hsl(187, 98%, 42%)',
  power: 'hsl(320, 80%, 62%)',
  safety: 'hsl(28, 90%, 58%)',
} as const;

export const SECTION_TITLES: Record<string, string> = {
  system: 'System vitals',
  environment: 'Environment',
  power: 'Power & battery',
  safety: 'Safety',
};

export const SECTION_ORDER = ['system', 'environment', 'power', 'safety'] as const;

export const CHANNELS: ChannelDefinition[] = [
  // ── System ────────────────────────────────────────────────────────────────
  { id: 'host.cpu_temp', label: 'CPU temp', unit: '°C', min: 20, max: 85, optimalMin: 25, optimalMax: 65, baseValue: 48, meterType: 'thermometer', category: 'system', sourceLabel: 'Host' },
  { id: 'host.cpu_load', label: 'CPU load', unit: '%', min: 0, max: 100, optimalMin: 0, optimalMax: 80, baseValue: 32, meterType: 'gauge', category: 'system', sourceLabel: 'Host' },
  { id: 'host.ram_used', label: 'RAM used', unit: '%', min: 0, max: 100, optimalMin: 0, optimalMax: 80, baseValue: 55, meterType: 'level', category: 'system', sourceLabel: 'Host' },
  { id: 'host.disk_used', label: 'Disk used', unit: '%', min: 0, max: 100, optimalMin: 0, optimalMax: 85, baseValue: 42, meterType: 'level', category: 'system', sourceLabel: 'Host' },

  // ── Environment ───────────────────────────────────────────────────────────
  { id: 'env.temperature', label: 'Air temp', unit: '°C', min: 0, max: 50, optimalMin: 10, optimalMax: 35, baseValue: 24, meterType: 'thermometer', category: 'environment', sourceLabel: 'Environment probe' },
  { id: 'env.humidity', label: 'Humidity', unit: '%', min: 0, max: 100, optimalMin: 20, optimalMax: 60, baseValue: 38, meterType: 'gauge', category: 'environment', sourceLabel: 'Environment probe' },
  { id: 'env.pressure', label: 'Pressure', unit: 'hPa', min: 900, max: 1100, optimalMin: 980, optimalMax: 1040, baseValue: 1013, meterType: 'gauge', category: 'environment', sourceLabel: 'Environment probe' },
  { id: 'env.voc', label: 'VOC resistance', unit: 'kΩ', min: 0, max: 500, optimalMin: 50, optimalMax: 500, baseValue: 210, meterType: 'chart', category: 'environment', sourceLabel: 'Environment probe' },

  // ── Power ─────────────────────────────────────────────────────────────────
  { id: 'power.charge', label: 'Battery', unit: '%', min: 0, max: 100, optimalMin: 20, optimalMax: 100, baseValue: 78, meterType: 'level', category: 'power', sourceLabel: 'Power system' },
  { id: 'power.voltage', label: 'Bus voltage', unit: 'V', min: 9, max: 14, optimalMin: 11, optimalMax: 13.5, baseValue: 12.4, meterType: 'gauge', category: 'power', sourceLabel: 'Power system' },
  { id: 'power.current', label: 'Draw', unit: 'A', min: 0, max: 8, optimalMin: 0, optimalMax: 5, baseValue: 2.1, meterType: 'chart', category: 'power', sourceLabel: 'Power system' },
  { id: 'power.temperature', label: 'Pack temp', unit: '°C', min: -10, max: 60, optimalMin: 10, optimalMax: 45, baseValue: 28, meterType: 'thermometer', category: 'power', sourceLabel: 'Power system' },

  // ── Safety — declared states rather than a scale ──────────────────────────
  {
    id: 'safety.leak', label: 'Leak sensor', unit: '', min: 0, max: 1, optimalMin: 0, optimalMax: 0,
    baseValue: 0, meterType: 'state', category: 'safety', sourceLabel: 'Safety',
    states: { 0: { label: 'No leak', tone: 'ok' }, 1: { label: 'Leak detected', tone: 'bad' } },
  },
  {
    id: 'safety.power_source', label: 'Power source', unit: '', min: 0, max: 3, optimalMin: 1, optimalMax: 1,
    baseValue: 1, meterType: 'state', category: 'safety', sourceLabel: 'Safety',
    states: {
      0: { label: 'Unknown', tone: 'neutral' },
      1: { label: 'Mains', tone: 'ok' },
      2: { label: 'On battery', tone: 'warn' },
      3: { label: 'Low battery', tone: 'bad' },
    },
  },
  {
    id: 'safety.link', label: 'Uplink', unit: '', min: 0, max: 2, optimalMin: 2, optimalMax: 2,
    baseValue: 2, meterType: 'state', category: 'safety', sourceLabel: 'Safety',
    states: {
      0: { label: 'Offline', tone: 'bad' },
      1: { label: 'Syncing', tone: 'warn' },
      2: { label: 'Online', tone: 'ok' },
    },
  },
];

/** Definition lookup, the shape the kit's helpers expect. */
export const CHANNELS_BY_ID: Record<string, ChannelDefinition> = Object.fromEntries(
  CHANNELS.map((channel) => [channel.id, channel]),
);

/** Per-channel accent colours, so a card's meter matches its plot line. */
export const CHANNEL_COLORS: Record<string, string> = {
  'host.cpu_temp': '#ff5370',
  'host.cpu_load': '#ff9900',
  'host.ram_used': '#ffd740',
  'host.disk_used': '#a3e600',
  'env.temperature': '#00e5cc',
  'env.humidity': '#00d4f5',
  'env.pressure': '#4d94ff',
  'env.voc': '#aa66ff',
  'power.charge': '#ff4db8',
  'power.voltage': '#ff2255',
  'power.current': '#ff9900',
  'power.temperature': '#aa88ff',
};

/**
 * One simulated snapshot.
 *
 * `phase` advances each tick; channels drift on slow sines of different
 * periods so the page never looks like every needle moving in lockstep.
 */
export function simulateSnapshot(phase: number, faulted: boolean): ChannelSnapshot {
  const timestamp = Date.now();
  const readings: ChannelSnapshot['readings'] = {};

  CHANNELS.forEach((channel, index) => {
    let value: number;

    if (channel.meterType === 'state') {
      // The three state channels trip together, so one toggle demonstrates the
      // whole alarm path: pulsing tile, alert chip, indicator badge.
      if (channel.id === 'safety.leak') value = faulted ? 1 : 0;
      else if (channel.id === 'safety.power_source') value = faulted ? 3 : 1;
      else value = faulted ? 0 : 2;
    } else {
      const base = channel.baseValue ?? (channel.min + channel.max) / 2;
      const span = (channel.max - channel.min) * 0.08;
      // Each channel gets its own period and offset from its index.
      const wave = Math.sin(phase / (7 + index * 2.3) + index);
      value = base + wave * span;
      // A faulted rig runs hot and draws harder.
      if (faulted && (channel.id === 'host.cpu_temp' || channel.id === 'power.temperature')) {
        value += (channel.max - channel.min) * 0.28;
      }
      value = Math.min(channel.max, Math.max(channel.min, value));
    }

    readings[channel.id] = { value: Math.round(value * 100) / 100, timestamp, valid: true };
  });

  return { snapshotTime: timestamp, readings };
}
