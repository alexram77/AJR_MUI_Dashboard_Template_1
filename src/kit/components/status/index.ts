/**
 * The indicator library.
 *
 * Everything that reports state: health, freshness, direction, capacity,
 * liveness, counts. Every one resolves its colour through `indicatorTokens`,
 * so "degraded" is the same amber in the top bar and on the page.
 *
 * Do not build a bespoke coloured dot, chip or bar in a page — add an
 * indicator here instead, or the colours will drift.
 */
export { StatusDot } from './StatusDot';
export type { StatusDotProps, ServiceState } from './StatusDot';
export { TrendChip } from './TrendChip';
export type { TrendChipProps } from './TrendChip';
export { FreshnessChip } from './FreshnessChip';
export type { FreshnessChipProps } from './FreshnessChip';
export { QuotaBar } from './QuotaBar';
export type { QuotaBarProps } from './QuotaBar';
export { StatusBar } from './StatusBar';
export type { StatusBarProps } from './StatusBar';
export { IndicatorBadge } from './IndicatorBadge';
export type { IndicatorBadgeProps } from './IndicatorBadge';
export { AlertChip } from './AlertChip';
export type { AlertChipProps } from './AlertChip';
export { ConnectionChip } from './ConnectionChip';
export type { ConnectionChipProps } from './ConnectionChip';
export { StorageMeterRow } from './StorageMeterRow';
export type { StorageMeterRowProps } from './StorageMeterRow';
export { LiveIndicator } from './LiveIndicator';
export type { LiveIndicatorProps, LiveState } from './LiveIndicator';
export { CountBadge } from './CountBadge';
export type { CountBadgeProps } from './CountBadge';
export { STATE_TONE, toneColor, stateColor, shouldGlow } from './indicatorTokens';
export type { IndicatorState } from './indicatorTokens';
