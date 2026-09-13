/**
 * A terminal with no server behind it.
 *
 * Runs a small line editor in the browser and dispatches each entered line to
 * a handler map you supply. Two real uses beyond demos: an offline/"demo mode"
 * that mirrors the live terminal's chrome, and a client-side command console
 * where the commands are app actions rather than shell processes.
 *
 * The line editor handles printable characters, Backspace, Ctrl+C, Ctrl+L and
 * Enter. It is deliberately not a full readline — no history search, no
 * word motions — because anything needing those should be talking to a real
 * shell through `createTtydTransport`.
 */
import { ansi } from './terminalTheme';
import type { TerminalHandlers, TerminalTransport } from './types';

/** Runs one entered line. Return the output, or a promise of it. */
export type CommandHandler = (args: string[], raw: string) => string | Promise<string>;

export interface LocalTransportOptions {
  /** Shown once on connect, before the first prompt. */
  banner?: string;
  /** Prompt string, ANSI allowed. */
  prompt?: string;
  /** Command name → handler. Unknown commands get a "not found" line. */
  commands: Record<string, CommandHandler>;
  /** Text for an unrecognised command. Receives the command name. */
  notFound?: (name: string) => string;
}

const CTRL_C = '\x03';
const CTRL_L = '\x0c';
const BACKSPACE = '\x7f';
const ENTER = '\r';

export function createLocalTransport({
  banner,
  prompt = `${ansi.cyan('demo')}:${ansi.dim('~')}$ `,
  commands,
  notFound = (name) => `${name}: command not found`,
}: LocalTransportOptions): TerminalTransport {
  let handlers: TerminalHandlers | null = null;
  let line = '';
  // History is navigable but not persisted — this is a session-scoped console.
  const history: string[] = [];
  let historyIndex = -1;
  let busy = false;
  let disposed = false;

  const writePrompt = () => handlers?.write(`\r\n${prompt}`);

  /** Redraw the current line in place after a history recall. */
  const redraw = () => {
    handlers?.write(`\r\x1b[2K${prompt}${line}`);
  };

  const runLine = async (input: string) => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      writePrompt();
      return;
    }

    history.push(trimmed);
    historyIndex = history.length;

    const [name, ...args] = trimmed.split(/\s+/);
    const handler = commands[name];

    busy = true;
    try {
      const output = handler ? await handler(args, trimmed) : notFound(name);
      if (output) handlers?.write(`\r\n${output.replace(/\n/g, '\r\n')}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      handlers?.write(`\r\n${ansi.red(message)}`);
    } finally {
      busy = false;
      if (!disposed) writePrompt();
    }
  };

  return {
    connect(h: TerminalHandlers) {
      handlers = h;
      h.setStatus('connecting');
      if (banner) h.write(`${banner.replace(/\n/g, '\r\n')}\r\n`);
      h.write(prompt);
      h.setStatus('connected');
    },

    send(data: string) {
      if (!handlers || busy) return;

      for (const char of data) {
        if (char === ENTER) {
          const entered = line;
          line = '';
          void runLine(entered);
          return;
        }

        if (char === BACKSPACE) {
          if (line.length > 0) {
            line = line.slice(0, -1);
            // Move back, overwrite with a space, move back again.
            handlers.write('\b \b');
          }
          continue;
        }

        if (char === CTRL_C) {
          line = '';
          handlers.write(`${ansi.dim('^C')}`);
          writePrompt();
          continue;
        }

        if (char === CTRL_L) {
          handlers.clear();
          handlers.write(prompt + line);
          continue;
        }

        // Arrow keys arrive as a 3-char escape sequence; handle up/down for
        // history and swallow left/right rather than printing garbage.
        if (char === '\x1b') continue;
        if (char === '[') continue;
        if (char === 'A' || char === 'B') {
          if (history.length === 0) continue;
          historyIndex = char === 'A' ? Math.max(0, historyIndex - 1) : Math.min(history.length, historyIndex + 1);
          line = history[historyIndex] ?? '';
          redraw();
          continue;
        }
        if (char === 'C' || char === 'D') continue;

        // Printable characters only.
        if (char >= ' ') {
          line += char;
          handlers.write(char);
        }
      }
    },

    resize() {
      // Nothing to tell — the line editor reflows with the terminal.
    },

    dispose() {
      disposed = true;
      handlers = null;
      line = '';
    },
  };
}
