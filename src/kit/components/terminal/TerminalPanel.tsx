/**
 * xterm.js terminal, sized to its container and fed by a `TerminalTransport`.
 *
 * The panel owns the terminal instance, the fit/resize plumbing and the
 * theme; the transport owns the connection. Text can also be pushed in
 * programmatically through the imperative handle, which is how a command
 * sidebar runs a command.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Box from '@mui/material/Box';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { TERMINAL_BACKGROUND, TERMINAL_FONT, terminalTheme } from './terminalTheme';
import type { TerminalStatus, TerminalTransport } from './types';

export interface TerminalPanelHandle {
  /** Send text as if typed. Append '\r' to execute it. */
  sendText: (text: string) => void;
  /** Clear the screen. */
  clear: () => void;
  /** Move keyboard focus into the terminal. */
  focus: () => void;
}

export interface TerminalPanelProps {
  /** Where the bytes come from. Changing it tears down and reconnects. */
  transport: TerminalTransport;
  onStatusChange?: (status: TerminalStatus) => void;
  /** Scrollback lines retained. */
  scrollback?: number;
}

export const TerminalPanel = forwardRef<TerminalPanelHandle, TerminalPanelProps>(
  function TerminalPanel({ transport, onStatusChange, scrollback = 3000 }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);

    // Hold the status callback in a ref so changing it does not reconnect.
    const statusRef = useRef(onStatusChange);
    statusRef.current = onStatusChange;

    useImperativeHandle(ref, () => ({
      sendText: (text: string) => transport.send(text),
      clear: () => termRef.current?.clear(),
      focus: () => termRef.current?.focus(),
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const term = new Terminal({
        theme: terminalTheme,
        ...TERMINAL_FONT,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback,
        allowProposedApi: true,
      });
      termRef.current = term;

      const fitAddon = new FitAddon();
      // Custom handler so links always open in a new tab rather than
      // navigating the dashboard away.
      const linksAddon = new WebLinksAddon((_event, uri) => {
        window.open(uri, '_blank', 'noreferrer');
      });
      term.loadAddon(fitAddon);
      term.loadAddon(linksAddon);
      term.open(container);

      // Never fit at zero size: an unconstrained fit() while the container is
      // hidden (display:none, an inactive tab) corrupts xterm's scrollback and
      // makes lines vanish when it comes back.
      const safeFit = () => {
        if (container.offsetWidth > 0 && container.offsetHeight > 0) fitAddon.fit();
      };
      requestAnimationFrame(safeFit);

      transport.connect({
        write: (text) => term.write(text),
        clear: () => term.clear(),
        setStatus: (status) => statusRef.current?.(status),
      });

      const inputSub = term.onData((data) => transport.send(data));
      const resizeSub = term.onResize(({ cols, rows }) => transport.resize(cols, rows));

      const observer = new ResizeObserver(safeFit);
      observer.observe(container);

      return () => {
        observer.disconnect();
        inputSub.dispose();
        resizeSub.dispose();
        transport.dispose();
        term.dispose();
        termRef.current = null;
      };
    }, [transport, scrollback]);

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          bgcolor: TERMINAL_BACKGROUND,
          p: '10px',
          overflow: 'hidden',
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            '& .xterm': { width: '100%', height: '100%' },
            '& .xterm-viewport': { overflow: 'hidden !important' },
            '& .xterm-screen': { width: '100% !important' },
          }}
        />
      </Box>
    );
  },
);
