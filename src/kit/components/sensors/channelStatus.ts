/**
 * Status derivation for a channel reading.
 *
 * The rule everywhere: inside the optimal band is healthy; just outside is a
 * warning; well outside is an error. "Well outside" is measured as a fraction
 * of the channel's full scale, not an absolute — 2°C over on a 0–50 range is a
 * different matter from 2°C over on a 0–1000 one.
 */
import type { Tone } from '../../utils/color';
import type { ChannelDefinition, ChannelTrend, HistoryPoint } from './types';

/** How far outside the band still counts as a warning, as a fraction of scale. */
const WARN_BAND = 0.15;

/** Semantic tone for a reading against its channel's optimal band. */
export function toneForReading(value: number, definition: ChannelDefinition): Tone {
  const { min, max, optimalMin, optimalMax } = definition;
  if (value >= optimalMin && value <= optimalMax) return 'ok';

  const distance = Math.max(optimalMin - value, value - optimalMax, 0);
  const scale = max - min;
  if (scale <= 0) return 'warn';

  return distance / scale < WARN_BAND ? 'warn' : 'bad';
}

/** Short status word for the card. Says which way it is off, not just that it is. */
export function statusTextForReading(value: number, definition: ChannelDefinition): string {
  const { min, max, optimalMin, optimalMax } = definition;
  if (value >= optimalMin && value <= optimalMax) return 'Optimal';

  const scale = max - min || 1;
  if (value < optimalMin) {
    return (optimalMin - value) / scale < WARN_BAND ? 'Slightly low' : 'Low';
  }
  return (value - optimalMax) / scale < WARN_BAND ? 'Slightly high' : 'High';
}

/**
 * Trend over a history window.
 *
 * `flat` is a real answer, not a fallback: a reading that moved by less than
 * `threshold` of full scale has not meaningfully moved, and drawing an arrow
 * for it invites reading noise as signal.
 */
export function trendFromHistory(
  history: HistoryPoint[],
  definition: ChannelDefinition,
  threshold = 0.01,
): ChannelTrend {
  if (history.length < 2) return { direction: 'flat', delta: 0 };

  const first = history[0].value;
  const last = history[history.length - 1].value;
  const delta = last - first;
  const scale = definition.max - definition.min || 1;

  if (Math.abs(delta) / scale < threshold) return { direction: 'flat', delta };
  return { direction: delta > 0 ? 'up' : 'down', delta };
}

/** The owning device/subsystem for a channel: explicit `source`, else the id prefix. */
export function sourceOf(definition: ChannelDefinition): string {
  return definition.source ?? definition.id.split('.')[0];
}

/** A set of channels that share a source. */
export interface ChannelGroup {
  source: string;
  label: string;
  channelIds: string[];
}

/** Group channel ids by their source, preserving first-seen order. */
export function groupChannels(
  channelIds: string[],
  definitions: Record<string, ChannelDefinition>,
): ChannelGroup[] {
  const groups = new Map<string, ChannelGroup>();

  for (const id of channelIds) {
    const definition = definitions[id];
    const source = definition ? sourceOf(definition) : id.split('.')[0];
    const label = definition?.sourceLabel ?? source;

    const existing = groups.get(source);
    if (existing) existing.channelIds.push(id);
    else groups.set(source, { source, label, channelIds: [id] });
  }

  return [...groups.values()];
}
