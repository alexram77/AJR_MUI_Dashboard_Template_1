/**
 * Draws the right meter for a channel's meter type.
 *
 * One dispatch point, so a card, a compact row and a detail panel can all
 * render "whatever meter this channel is set to" without each repeating the
 * switch — and so adding a meter type is a change in exactly one place.
 */
import { GaugeMeter } from '../meters/GaugeMeter';
import { LevelMeter } from '../meters/LevelMeter';
import { StateMeter } from '../meters/StateMeter';
import { ThermometerMeter } from '../meters/ThermometerMeter';
import { TimeSeriesMeter } from '../meters/TimeSeriesMeter';
import type { ChannelDefinition, HistoryPoint, MeterType } from './types';

export interface MeterRendererProps {
  meterType: MeterType;
  value: number;
  definition: ChannelDefinition;
  /** Per-channel accent. Defaults to the theme primary inside each meter. */
  color?: string;
  /** Required by the `chart` meter; ignored by the others. */
  history?: HistoryPoint[];
  /** Scales the gauge and thermometer. */
  size?: number;
}

export function MeterRenderer({
  meterType,
  value,
  definition,
  color,
  history = [],
  size = 120,
}: MeterRendererProps) {
  const scale = {
    value,
    min: definition.min,
    max: definition.max,
    optimalMin: definition.optimalMin,
    optimalMax: definition.optimalMax,
  };

  switch (meterType) {
    case 'thermometer':
      return <ThermometerMeter {...scale} size={size} color={color} />;

    case 'level':
      return <LevelMeter {...scale} width={160} height={26} color={color} />;

    case 'chart':
      return (
        <TimeSeriesMeter data={history} min={definition.min} max={definition.max} color={color} />
      );

    case 'state':
      // A state channel with no declared states is a definition bug, not a
      // rendering one — show it as unknown rather than inventing labels.
      return <StateMeter value={value} states={definition.states ?? {}} />;

    case 'gauge':
    default:
      return <GaugeMeter {...scale} size={size} color={color} />;
  }
}
