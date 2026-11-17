/**
 * Transport for ttyd (https://github.com/tsl0922/ttyd), the usual way to put a
 * real shell behind a WebSocket.
 *
 * ttyd's protocol is ASCII-prefixed, not binary:
 *   server → client   '0' terminal output   '1' window title   '2' JSON prefs
 *   client → server   '{' JSON auth token   '0' keyboard input  '1' resize JSON
 *
 * A dropped connection is not the end of the session: the terminal says why it
 * closed and pressing Enter reconnects, keeping the scrollback. When each
 * connection needs a fresh credential (a single-use ticket from an auth proxy),
 * pass `url` as a function; it is called again for every reconnect.
 */
import { ansi } from './terminalTheme';
import type { TerminalHandlers, TerminalTransport } from './types';

const INPUT = '0';
const RESIZE = '1';
const AUTH = '{';
const OUTPUT = '0';
const ENTER = '\r';

/**
 * Re-sending the window size every 40s. A proxy (Cloudflare tunnel, nginx)
 * idle-closes a WebSocket that carries no DATA frames for ~100s, and ttyd's
 * own PING frames do not reset that timer. A resize to the current size is a
 * true no-op for the shell but a real data frame, so an idle terminal survives.
 */
const KEEPALIVE_MS = 40_000;

/** Resolves the WebSocket URL for one connection. Aborted on dispose. */
export type TtydUrlResolver = (signal: AbortSignal) => Promise<string>;

export interface TtydTransportOptions {
  /**
   * ws:// or wss:// URL of the ttyd endpoint, or a function that returns one.
   * The function runs for every connect and reconnect, so it can fetch a
   * single-use ticket each time.
   */
  url: string | TtydUrlResolver;
  /** Auth token, if ttyd was started with one. */
  authToken?: string;
  /** Banner shown while connecting. Cleared by the first shell output. */
  connectingMessage?: string;
  /** Text shown when `url` rejects. Defaults to the error's message. */
  describeError?: (error: unknown) => string;
  /**
   * Text shown when the socket closes. Gets the close reason and code; an
   * auth proxy usually puts "idle_timeout" or "max_session" in the reason.
   */
  describeClose?: (reason: string, code: number) => string;
  /** Reconnect when Enter is pressed after a close or error. Default true. */
  reconnectOnEnter?: boolean;
}

const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';

const defaultDescribeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export function createTtydTransport({
  url,
  authToken = '',
  connectingMessage = '  Connecting…',
  describeError = defaultDescribeError,
  describeClose = () => 'Connection closed.',
  reconnectOnEnter = true,
}: TtydTransportOptions): TerminalTransport {
  let handlers: TerminalHandlers | null = null;
  let socket: WebSocket | null = null;
  let keepAlive: ReturnType<typeof setInterval> | undefined;
  let pendingUrl: AbortController | null = null;
  let connecting = false;
  let disposed = false;
  let size = { cols: 80, rows: 24 };
  // The connecting banner is cleared once, on the first real output. A
  // reconnect leaves the screen alone so the scrollback survives.
  let bannerCleared = false;

  const stopKeepAlive = () => {
    if (keepAlive !== undefined) {
      clearInterval(keepAlive);
      keepAlive = undefined;
    }
  };

  const offerReconnect = () => {
    if (reconnectOnEnter) handlers?.write(`${ansi.dim('  Press Enter to reconnect.')}\r\n`);
  };

  const sendSize = (ws: WebSocket) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(RESIZE + JSON.stringify({ columns: size.cols, rows: size.rows }));
    }
  };

  const openSocket = (wsUrl: string) => {
    const ws = new WebSocket(wsUrl, ['tty']);
    ws.binaryType = 'arraybuffer';
    socket = ws;

    // Every callback checks it still belongs to the live socket: a socket
    // replaced by a reconnect, or one closing after dispose, must stay quiet.
    ws.onopen = () => {
      if (socket !== ws) return;
      connecting = false;
      handlers?.setStatus('connected');
      ws.send(AUTH + JSON.stringify({ AuthToken: authToken }));
      sendSize(ws);
      stopKeepAlive();
      keepAlive = setInterval(() => sendSize(ws), KEEPALIVE_MS);
    };

    ws.onmessage = (event: MessageEvent) => {
      if (socket !== ws) return;
      const raw =
        event.data instanceof ArrayBuffer ? new TextDecoder().decode(event.data) : String(event.data);
      if (!raw.length) return;

      // '1' (title) and '2' (prefs) carry nothing the panel needs.
      if (raw[0] !== OUTPUT) return;

      if (!bannerCleared) {
        bannerCleared = true;
        handlers?.clear();
      }
      handlers?.write(raw.slice(1));
    };

    ws.onclose = (event: CloseEvent) => {
      if (socket !== ws) return;
      stopKeepAlive();
      connecting = false;
      socket = null;
      handlers?.setStatus('disconnected');
      handlers?.write(`\r\n${ansi.yellow(`  ${describeClose(event.reason ?? '', event.code ?? 0)}`)}\r\n`);
      offerReconnect();
    };

    ws.onerror = () => {
      if (socket !== ws) return;
      handlers?.setStatus('error');
      handlers?.write(
        `\r\n${ansi.red('  WebSocket error — the terminal server refused or dropped the connection.')}\r\n`,
      );
      // The browser fires `close` next, which offers the reconnect.
    };
  };

  const connect = () => {
    if (disposed || connecting || socket || !handlers) return;
    connecting = true;
    handlers.setStatus('connecting');
    handlers.write(`${ansi.dim(connectingMessage)}\r\n`);

    if (typeof url === 'string') {
      openSocket(url);
      return;
    }

    const controller = new AbortController();
    pendingUrl = controller;
    url(controller.signal).then(
      (wsUrl) => {
        if (pendingUrl === controller) pendingUrl = null;
        if (disposed || controller.signal.aborted) return;
        openSocket(wsUrl);
      },
      (error: unknown) => {
        if (pendingUrl === controller) pendingUrl = null;
        if (disposed || controller.signal.aborted || isAbort(error)) return;
        connecting = false;
        handlers?.setStatus('error');
        handlers?.write(`\r\n${ansi.red(`  ${describeError(error)}`)}\r\n`);
        offerReconnect();
      },
    );
  };

  return {
    connect(next: TerminalHandlers) {
      // A panel may connect the same transport again after disposing it
      // (React StrictMode mounts effects twice), so connect re-arms it.
      disposed = false;
      handlers = next;
      connect();
    },

    send(data: string) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(INPUT + data);
        return;
      }
      if (reconnectOnEnter && data === ENTER && !socket && !connecting) connect();
    },

    resize(cols: number, rows: number) {
      size = { cols, rows };
      if (socket) sendSize(socket);
    },

    dispose() {
      disposed = true;
      connecting = false;
      pendingUrl?.abort();
      pendingUrl = null;
      stopKeepAlive();
      const ws = socket;
      socket = null;
      ws?.close();
      handlers = null;
    },
  };
}
