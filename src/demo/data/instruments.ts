/**
 * Mock instrument readings for the meters showcase.
 *
 * Each reading carries its own scale and healthy band so the demo exercises
 * the optimal-range rendering, not just the needle.
 */
import type { MeterScale } from '@kit/components/meters';

export interface InstrumentReading extends MeterScale {
  id: string;
  label: string;
  unit: string;
}

export const INSTRUMENTS: InstrumentReading[] = [
  { id: 'temp', label: 'Core temp', unit: '°C', value: 47.2, min: 0, max: 90, optimalMin: 20, optimalMax: 65 },
  { id: 'pressure', label: 'Pressure', unit: 'bar', value: 3.8, min: 0, max: 10, optimalMin: 2.5, optimalMax: 6 },
  { id: 'humidity', label: 'Humidity', unit: '%', value: 71, min: 0, max: 100, optimalMin: 30, optimalMax: 60 },
  { id: 'voltage', label: 'Bus voltage', unit: 'V', value: 11.9, min: 0, max: 16, optimalMin: 11.5, optimalMax: 14.4 },
  { id: 'rpm', label: 'Pump speed', unit: 'rpm', value: 2840, min: 0, max: 4000, optimalMin: 1800, optimalMax: 3200 },
  { id: 'flow', label: 'Flow rate', unit: 'L/min', value: 6.4, min: 0, max: 12, optimalMin: 4, optimalMax: 9 },
];

/** State maps for the discrete-state tiles. */
export const LEAK_STATES = {
  0: { label: 'No leak', tone: 'ok' as const },
  1: { label: 'Leak detected', tone: 'bad' as const },
};

export const POWER_STATES = {
  0: { label: 'Unknown', tone: 'neutral' as const },
  1: { label: 'DC power', tone: 'ok' as const },
  2: { label: 'On battery', tone: 'warn' as const },
  3: { label: 'Low battery', tone: 'bad' as const },
};

export const LINK_STATES = {
  online: { label: 'Online', tone: 'ok' as const },
  syncing: { label: 'Syncing', tone: 'warn' as const },
  offline: { label: 'Offline', tone: 'neutral' as const },
};
