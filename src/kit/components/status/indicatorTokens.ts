/**
 * The indicator vocabulary.
 *
 * Every indicator in the kit — dots, chips, badges, bars, meters — resolves
 * its colour through here. That is what stops "degraded" being amber in the
 * top bar and orange on the page, which is exactly how an operator learns to
 * distrust the colours.
 *
 * Two layers, deliberately:
 *   - `Tone` is the semantic (ok / warn / bad / neutral), from `utils/color`.
 *   - `IndicatorState` is the operational vocabulary a service reports.
 * A state maps to a tone; a tone maps to a palette colour. Add states freely;
 * add tones almost never.
 */
import type { Theme } from '@mui/material/styles';
import type { Tone } from '../../utils/color';

/** What a monitored thing can be doing. */
export type IndicatorState =
  /** Healthy and reporting. */
  | 'ok'
  /** Reporting, but outside its healthy band. */
  | 'degraded'
  /** Not reporting, or failing. */
  | 'down'
  /** A check is in flight. NOT the same as `down` — never colour it red. */
  | 'checking'
  /** Deliberately switched off. Grey, not red: this is not a fault. */
  | 'disabled'
  /** Simulated or demo data. Amber, always — fake data that looks live is the
   *  most expensive thing a dashboard can imply. */
  | 'simulated';

/** State → tone. The one place this mapping lives. */
export const STATE_TONE: Record<IndicatorState, Tone> = {
  ok: 'ok',
  degraded: 'warn',
  down: 'bad',
  checking: 'neutral',
  disabled: 'neutral',
  simulated: 'warn',
};

/** Tone → a concrete colour from the live theme. */
export function toneColor(theme: Theme, tone: Tone): string {
  switch (tone) {
    case 'ok':
      return theme.palette.success.main;
    case 'warn':
      return theme.palette.warning.main;
    case 'bad':
      return theme.palette.error.main;
    default:
      return theme.palette.text.disabled;
  }
}

/** State → colour, the shortcut most indicators actually want. */
export function stateColor(theme: Theme, state: IndicatorState): string {
  return toneColor(theme, STATE_TONE[state]);
}

/**
 * Whether a state's dot should glow.
 *
 * Every state that is actually *reporting* glows, in its own colour — a flat
 * red dot beside a glowing green one reads as two different kinds of thing
 * rather than two values of one thing.
 *
 * The exceptions are the states that are deliberately inert: `checking` (no
 * reading yet) and `disabled` (switched off). Those stay flat grey, which is
 * what makes them legible as "nothing to report" at a glance.
 *
 * Note this is a steady glow, not an animation. Pulsing is reserved for
 * `LiveIndicator` and `AlertChip`, where something is actively happening.
 */
export function shouldGlow(state: IndicatorState): boolean {
  return state !== 'checking' && state !== 'disabled';
}
