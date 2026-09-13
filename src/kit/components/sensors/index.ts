/**
 * Channels — live named readings, with cards, meters and status derivation.
 *
 * Generic over what a reading *is*: a sensor, a service metric, a rig
 * telemetry field. Declare a `ChannelDefinition` and the rest follows.
 */
export { ChannelCard } from './ChannelCard';
export type { ChannelCardProps } from './ChannelCard';
export { ChannelSection } from './ChannelSection';
export type { ChannelSectionProps } from './ChannelSection';
export { ChannelGroupHeader } from './ChannelGroupHeader';
export type { ChannelGroupHeaderProps } from './ChannelGroupHeader';
export { MeterRenderer } from './MeterRenderer';
export type { MeterRendererProps } from './MeterRenderer';
export { InlineAliasEditor } from './InlineAliasEditor';
export type { InlineAliasEditorProps } from './InlineAliasEditor';
export {
  toneForReading,
  statusTextForReading,
  trendFromHistory,
  groupChannels,
  sourceOf,
} from './channelStatus';
export type { ChannelGroup } from './channelStatus';
export type {
  ChannelDefinition,
  ChannelReading,
  ChannelSnapshot,
  ChannelTrend,
  ChannelCardConfig,
  HistoryPoint,
  MeterType,
} from './types';
