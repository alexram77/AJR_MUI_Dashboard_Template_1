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
 * Whether a state should glow or pulse.
 *
 * Only `ok` glows — a red glow reads as an active alarm rather than a
 * reported state, and a page where everything pulses has taught the operator
 * to ignore all of it.
 */
export function shouldGlow(state: IndicatorState): boolean {
  return state === 'ok';
}
