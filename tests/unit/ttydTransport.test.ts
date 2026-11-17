import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTtydTransport } from '@kit/components/terminal/ttydTransport';
import type { TerminalHandlers, TerminalStatus } from '@kit/components/terminal/types';

/** A WebSocket that does nothing until the test drives it. */
class FakeSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static all: FakeSocket[] = [];

  readyState = FakeSocket.CONNECTING;
  binaryType = 'blob';
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onclose: ((event: { reason: string; code: number }) => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(
    public url: string,
    public protocols?: string[],
  ) {
    FakeSocket.all.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    if (this.readyState === FakeSocket.CLOSED) return;
    this.readyState = FakeSocket.CLOSED;
    this.onclose?.({ reason: '', code: 1000 });
  }

  // Test drivers.
  open() {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }
  output(text: string) {
    this.onmessage?.({ data: `0${text}` });
  }
  drop(reason = '', code = 1006) {
    this.readyState = FakeSocket.CLOSED;
    this.onclose?.({ reason, code });
  }
}

function makeHandlers() {
  const lines: string[] = [];
  const statuses: TerminalStatus[] = [];
  const handlers: TerminalHandlers = {
    write: (text) => lines.push(text),
    clear: () => lines.push('<clear>'),
    setStatus: (status) => statuses.push(status),
  };
  return { handlers, lines, statuses, screen: () => lines.join('') };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  FakeSocket.all = [];
  vi.stubGlobal('WebSocket', FakeSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createTtydTransport', () => {
  it('connects to a fixed URL, authenticates and sends the size', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty', authToken: 't0k' });
    const { handlers, statuses } = makeHandlers();
    transport.resize(100, 30);
    transport.connect(handlers);

    expect(FakeSocket.all).toHaveLength(1);
    expect(FakeSocket.all[0].url).toBe('ws://pi/tty');
    FakeSocket.all[0].open();
    expect(FakeSocket.all[0].sent).toEqual([
      '{' + JSON.stringify({ AuthToken: 't0k' }),
      '1' + JSON.stringify({ columns: 100, rows: 30 }),
    ]);
    expect(statuses).toEqual(['connecting', 'connected']);
  });

  it('asks the resolver for a fresh URL on every connect', async () => {
    let n = 0;
    const url = vi.fn(async () => `ws://pi/tty?ticket=${++n}`);
    const transport = createTtydTransport({ url });
    const { handlers } = makeHandlers();
    transport.connect(handlers);
    await flush();
    expect(FakeSocket.all[0].url).toBe('ws://pi/tty?ticket=1');

    FakeSocket.all[0].open();
    FakeSocket.all[0].drop('idle_timeout');
    transport.send('\r');
    await flush();

    expect(url).toHaveBeenCalledTimes(2);
    expect(FakeSocket.all[1].url).toBe('ws://pi/tty?ticket=2');
  });

  it('says why it closed and offers Enter to reconnect', () => {
    const transport = createTtydTransport({
      url: 'ws://pi/tty',
      describeClose: (reason) => (reason === 'idle_timeout' ? 'Closed after 15 min idle.' : 'Connection closed.'),
    });
    const { handlers, screen, statuses } = makeHandlers();
    transport.connect(handlers);
    FakeSocket.all[0].open();
    FakeSocket.all[0].drop('idle_timeout');

    expect(screen()).toContain('Closed after 15 min idle.');
    expect(screen()).toContain('Press Enter to reconnect.');
    expect(statuses.at(-1)).toBe('disconnected');
  });

  it('does not reconnect on keys other than Enter, or while a connection is live', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty' });
    const { handlers } = makeHandlers();
    transport.connect(handlers);
    FakeSocket.all[0].open();

    transport.send('\r'); // live: goes to the shell
    expect(FakeSocket.all).toHaveLength(1);
    expect(FakeSocket.all[0].sent.at(-1)).toBe('0\r');

    FakeSocket.all[0].drop();
    transport.send('x');
    expect(FakeSocket.all).toHaveLength(1);
    transport.send('\r');
    expect(FakeSocket.all).toHaveLength(2);
  });

  it('can be told not to reconnect', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty', reconnectOnEnter: false });
    const { handlers, screen } = makeHandlers();
    transport.connect(handlers);
    FakeSocket.all[0].open();
    FakeSocket.all[0].drop();
    transport.send('\r');
    expect(FakeSocket.all).toHaveLength(1);
    expect(screen()).not.toContain('Press Enter');
  });

  it('reports a failed URL lookup and lets Enter retry', async () => {
    const url = vi
      .fn<(signal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new Error('ticket refused (403)'))
      .mockResolvedValueOnce('ws://pi/tty?ticket=2');
    const transport = createTtydTransport({ url, describeError: (e) => `No ticket: ${(e as Error).message}` });
    const { handlers, screen, statuses } = makeHandlers();
    transport.connect(handlers);
    await flush();

    expect(screen()).toContain('No ticket: ticket refused (403)');
    expect(statuses.at(-1)).toBe('error');
    expect(FakeSocket.all).toHaveLength(0);

    transport.send('\r');
    await flush();
    expect(FakeSocket.all).toHaveLength(1);
  });

  it('aborts a pending URL lookup on dispose and opens nothing', async () => {
    let seen: AbortSignal | undefined;
    let resolve: (value: string) => void = () => {};
    const transport = createTtydTransport({
      url: (signal) => {
        seen = signal;
        return new Promise<string>((r) => {
          resolve = r;
        });
      },
    });
    const { handlers } = makeHandlers();
    transport.connect(handlers);
    transport.dispose();

    expect(seen?.aborted).toBe(true);
    resolve('ws://late');
    await flush();
    expect(FakeSocket.all).toHaveLength(0);
  });

  it('clears the connecting banner once, so a reconnect keeps the scrollback', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty' });
    const { handlers, lines } = makeHandlers();
    transport.connect(handlers);
    FakeSocket.all[0].open();
    FakeSocket.all[0].output('pi@unit:~$ ');
    FakeSocket.all[0].drop();
    transport.send('\r');
    FakeSocket.all[1].open();
    FakeSocket.all[1].output('pi@unit:~$ ');

    expect(lines.filter((line) => line === '<clear>')).toHaveLength(1);
  });

  it('ignores a socket that closes after dispose', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty' });
    const { handlers, screen } = makeHandlers();
    transport.connect(handlers);
    FakeSocket.all[0].open();
    transport.dispose();
    expect(screen()).not.toContain('Connection closed');
  });

  it('re-arms after dispose, as StrictMode does', () => {
    const transport = createTtydTransport({ url: 'ws://pi/tty' });
    transport.connect(makeHandlers().handlers);
    transport.dispose();
    transport.connect(makeHandlers().handlers);
    expect(FakeSocket.all).toHaveLength(2);
  });
});
