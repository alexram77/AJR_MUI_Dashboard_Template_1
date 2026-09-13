/**
 * xterm colour theme.
 *
 * A terminal is one of the few surfaces that should NOT follow the app's
 * light/dark switch — shell output carries its own ANSI colours, and a light
 * terminal makes half of them illegible. This stays dark in both schemes, on
 * purpose, and is tuned to sit beside the app's teal brand.
 */
import type { ITheme } from '@xterm/xterm';

export const TERMINAL_BACKGROUND = '#080d16';

export const terminalTheme: ITheme = {
  background: TERMINAL_BACKGROUND,
  foreground: '#d0dce8',
  cursor: '#00bcd4',
  cursorAccent: TERMINAL_BACKGROUND,
  selectionBackground: 'rgba(0,188,212,0.25)',

  black: '#1a1f2e',
  red: '#f07178',
  green: '#c3e88d',
  yellow: '#ffcb6b',
  blue: '#82aaff',
  magenta: '#c792ea',
  cyan: '#89ddff',
  white: '#d0dce8',

  brightBlack: '#3b4261',
  brightRed: '#ff5370',
  brightGreen: '#c3e88d',
  brightYellow: '#ffcb6b',
  brightBlue: '#82aaff',
  brightMagenta: '#c792ea',
  brightCyan: '#89ddff',
  brightWhite: '#ffffff',
};

/** Font stack and metrics. Falls back through the common coding faces. */
export const TERMINAL_FONT = {
  fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", ui-monospace, monospace',
  fontSize: 13,
  lineHeight: 1.3,
} as const;

/** ANSI helpers so transports can emit styled text without magic strings. */
export const ansi = {
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
};
