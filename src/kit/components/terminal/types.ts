/**
 * Terminal transport contract.
 *
 * `TerminalPanel` renders and sizes an xterm instance; it knows nothing about
 * where the bytes come from. A transport is the adapter — ttyd over a
 * WebSocket, a plain socket, an SSH proxy, or a local simulation for a demo.
 *
 * Keeping this boundary is what lets one terminal component serve every
 * project: swapping backends means writing a new transport, not touching the
 * panel.
 */

export type TerminalStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

/** Callbacks a transport receives when the panel connects it. */
export interface TerminalHandlers {
  /** Write raw text (including ANSI escapes) to the terminal. */
  write: (text: string) => void;
  /** Clear the screen — used to drop a connecting banner on first output. */
  clear: () => void;
  /** Report a status change; the panel forwards it to the caller. */
  setStatus: (status: TerminalStatus) => void;
}

export interface TerminalTransport {
  /** Open the connection. Called once when the panel mounts. */
  connect: (handlers: TerminalHandlers) => void;
  /** Keystrokes typed into the terminal. */
  send: (data: string) => void;
  /** The terminal was resized. */
  resize: (cols: number, rows: number) => void;
  /** Tear down. Called on unmount; must be safe to call twice. */
  dispose: () => void;
}

/** One entry in a `CommandSidebar`. */
export interface CommandEntry {
  id: string;
  label: string;
  /** The literal text sent to the terminal when clicked. */
  command: string;
  /** Grouping key. Groups render in `categoryOrder`, then alphabetically. */
  category?: string;
  /** Tooltip — say what the command does and anything it changes. */
  description?: string;
  /** Nested variants, e.g. subcommands of the same script. */
  subcommands?: Array<{ label: string; command: string; description?: string }>;
}
