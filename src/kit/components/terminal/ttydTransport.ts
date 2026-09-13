/**
 * Transport for ttyd (https://github.com/tsl0922/ttyd), the usual way to put a
 * real shell behind a WebSocket.
 *
 * ttyd's protocol is ASCII-prefixed, not binary:
 *   server → client   '0' terminal output   '1' window title   '2' JSON prefs
 *   client → server   '{' JSON auth token   '0' keyboard input  '1' resize JSON
 */
import { ansi } from './terminalTheme';
import type { TerminalHandlers, TerminalTransport } from './types';

const INPUT = '0';
const RESIZE = '1';
const AUTH = '{';
const OUTPUT = '0';

/**
 * Re-sending the window size every 40s. A proxy (Cloudflare tunnel, nginx)
 * idle-closes a WebSocket that carries no DATA frames for ~100s, and ttyd's
 * own PING frames do not reset that timer. A resize to the current size is a
 * true no-op for the shell but a real data frame, so an idle terminal survives.
 */
const KEEPALIVE_MS = 40_000;

export interface TtydTransportOptions {
  /** ws:// or wss:// URL of the ttyd endpoint. */
  url: string;
  /** Auth token, if ttyd was started with one. */
  authToken?: string;
  /** Banner shown while connecting. */
  connectingMessage?: string;
}

export function createTtydTransport({
  url,
  authToken = '',
  connectingMessage = '  Connecting…',
}: TtydTransportOptions): TerminalTransport {
  let socket: WebSocket | null = null;
  let keepAlive: ReturnType<typeof setInterval> | undefined;
  let size = { cols: 80, rows: 24 };
  // The connecting banner is cleared exactly once, on the first real output.
  let bannerCleared = false;

  const stopKeepAlive = () => {
    if (keepAlive !== undefined) {
      clearInterval(keepAlive);
      keepAlive = undefined;
    }
  };

  return {
    connect(handlers: TerminalHandlers) {
      handlers.setStatus('connecting');
      handlers.write(`${ansi.dim(connectingMessage)}\r\n`);

      const ws = new WebSocket(url, ['tty']);
      ws.binaryType = 'arraybuffer';
      socket = ws;

      ws.onopen = () => {
        handlers.setStatus('connected');
        ws.send(AUTH + JSON.stringify({ AuthToken: authToken }));
        ws.send(RESIZE + JSON.stringify({ columns: size.cols, rows: size.rows }));

        keepAlive = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(RESIZE + JSON.stringify({ columns: size.cols, rows: size.rows }));
          }
        }, KEEPALIVE_MS);
      };

      ws.onmessage = (event: MessageEvent) => {
        const raw =
          event.data instanceof ArrayBuffer ? new TextDecoder().decode(event.data) : String(event.data);
        if (!raw.length) return;

        // '1' (title) and '2' (prefs) carry nothing the panel needs.
        if (raw[0] !== OUTPUT) return;

        if (!bannerCleared) {
          bannerCleared = true;
          handlers.clear();
        }
        handlers.write(raw.slice(1));
      };

      ws.onclose = () => {
        stopKeepAlive();
        handlers.setStatus('disconnected');
        handlers.write(`\r\n${ansi.yellow('  Connection closed. Reload to reconnect.')}\r\n`);
      };

      ws.onerror = () => {
        handlers.setStatus('error');
        handlers.write(`\r\n${ansi.red('  WebSocket error — check that the terminal server is running.')}\r\n`);
      };
    },

    send(data: string) {
      if (socket?.readyState === WebSocket.OPEN) socket.send(INPUT + data);
    },

    resize(cols: number, rows: number) {
      size = { cols, rows };
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(RESIZE + JSON.stringify({ columns: cols, rows }));
      }
    },

    dispose() {
      stopKeepAlive();
      socket?.close();
      socket = null;
    },
  };
}
