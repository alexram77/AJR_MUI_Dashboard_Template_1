/**
 * The toast queue, as plain data, so its rules can be tested without a DOM.
 *
 * One toast shows at a time and the rest wait in order. Two identical
 * messages in a row collapse into one: a save button clicked three times
 * should say "Saved" once, not stack three of them.
 */
import type { ReactNode } from 'react';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  severity?: ToastSeverity;
  /** Milliseconds before it hides itself. `null` keeps it until dismissed. */
  duration?: number | null;
  /** One button beside the message, e.g. "Undo" or "Retry". */
  action?: ToastAction;
}

export interface Toast {
  id: number;
  message: ReactNode;
  severity: ToastSeverity;
  duration: number | null;
  action?: ToastAction;
}

/**
 * How long each severity stays up. An error stays longest: it is the one the
 * operator most needs to read, and the one most likely to arrive while they
 * are looking elsewhere.
 */
export const TOAST_DURATION: Record<ToastSeverity, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 7000,
};

export interface ToastQueueState {
  /** The toast on screen, if any. */
  current: Toast | null;
  /** Waiting, oldest first. */
  pending: Toast[];
}

export const EMPTY_TOAST_QUEUE: ToastQueueState = { current: null, pending: [] };

let nextId = 1;

export function makeToast(message: ReactNode, options: ToastOptions = {}): Toast {
  const severity = options.severity ?? 'info';
  return {
    id: nextId++,
    message,
    severity,
    duration: options.duration === undefined ? TOAST_DURATION[severity] : options.duration,
    action: options.action,
  };
}

const sameToast = (a: Toast | null | undefined, b: Toast) =>
  !!a && typeof a.message === 'string' && a.message === b.message && a.severity === b.severity;

/** Add a toast: show it now if nothing is up, otherwise queue it. */
export function enqueueToast(state: ToastQueueState, toast: Toast): ToastQueueState {
  const last = state.pending.length > 0 ? state.pending[state.pending.length - 1] : state.current;
  if (sameToast(last, toast)) return state;
  if (!state.current) return { current: toast, pending: state.pending };
  return { current: state.current, pending: [...state.pending, toast] };
}

/** The current toast has finished leaving: bring on the next. */
export function advanceToast(state: ToastQueueState): ToastQueueState {
  const [next = null, ...rest] = state.pending;
  return { current: next, pending: rest };
}
