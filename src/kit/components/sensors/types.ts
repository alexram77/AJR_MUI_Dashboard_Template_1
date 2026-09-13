/**
 * Channel contracts.
 *
 * A "channel" is any named numeric reading that arrives repeatedly — a sensor,
 * a service metric, a rig telemetry field. Declaring one gives you a card, a
 * meter, status colouring and trend for free.
 *
 * `id` is the join key between a definition, a reading and a card config, so
 * it must be stable across restarts. `sensor.field` dotted ids work well and
 * give `groupChannels` something to group on.
 */
import type { Tone } from '../../utils/color';

/** Which meter draws a channel. `chart` plots its recent history. */
export type MeterType = 'gauge' | 'thermometer' | 'level' | 'state' | 'chart';

export interface ChannelDefinition {
  id: string;
  /** Human label. Overridden per-card by an alias. */
  label: string;
  /** Displayed after the value. Empty for unitless channels. */
  unit: string;
  /** Scale bounds — the meter's full sweep. */
  min: number;
  max: number;
  /** The healthy band. Readings inside it are green. */
  optimalMin: number;
  optimalMax: number;
  /** Default meter for this channel. */
  meterType: MeterType;
  /** Grouping key for sections. Free-form; the app defines the vocabulary. */
  category?: string;
  /**
   * Owning device or subsystem, for `groupChannels`. Defaults to the part of
   * `id` before the first dot.
   */
  source?: string;
  /** Display name for the source group. */
  sourceLabel?: string;
  /** Shown when the channel has never reported. */
  baseValue?: number;
  /** Declared states for a `state` meter, keyed by value. */
  states?: Record<string | number, { label: string; tone: Tone }>;
}

/** One reading. `valid: false` means the channel reported but the value is unusable. */
export interface ChannelReading {
  value: number | null;
  timestamp: number;
  valid: boolean;
}

/** Everything read at one moment. */
export interface ChannelSnapshot {
  snapshotTime: number;
  readings: Record<string, ChannelReading>;
}

/** A point in a channel's history, for the chart meter and trend. */
export interface HistoryPoint {
  time: number;
  value: number;
}

/** Direction of travel, with the magnitude that produced it. */
export interface ChannelTrend {
  direction: 'up' | 'down' | 'flat';
  delta: number;
}

/** Per-card state an app persists: which channel, drawn how, called what. */
export interface ChannelCardConfig {
  id: string;
  channelId: string;
  meterType: MeterType;
  /** User-chosen name, overriding the definition's label. */
  alias?: string;
}
