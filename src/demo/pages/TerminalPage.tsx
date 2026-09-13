/**
 * Terminal with a clickable command rail.
 *
 * The panel is backed by `createLocalTransport`, which runs a small line
 * editor in the browser — so the demo works with nothing behind it. Pointing
 * the same panel at a real machine is a one-line swap to
 * `createTtydTransport({ url })`.
 */
import { useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import { SplitPane } from '@kit/components/page';
import { PageHeader } from '@kit/components/page';
import {
  CommandSidebar,
  TerminalPanel,
  createLocalTransport,
  type TerminalPanelHandle,
  type TerminalStatus,
} from '@kit/components/terminal';
import { StatusDot } from '@kit/components/status';
import { ToolbarButton } from '@kit/components/buttons';
import { captionMuted } from '@kit/theme';
import {
  COMMAND_CATEGORY_LABELS,
  COMMAND_CATEGORY_ORDER,
  DEMO_BANNER,
  DEMO_COMMANDS,
  DEMO_COMMAND_ENTRIES,
} from '@demo/data/terminalCommands';

/** Map the transport's status onto the StatusDot vocabulary. */
const STATUS_STATE: Record<TerminalStatus, 'ok' | 'degraded' | 'down' | 'checking'> = {
  idle: 'checking',
  connecting: 'checking',
  connected: 'ok',
  disconnected: 'degraded',
  error: 'down',
};

export default function TerminalPage() {
  const panelRef = useRef<TerminalPanelHandle>(null);
  const [status, setStatus] = useState<TerminalStatus>('idle');

  // The transport must be stable: a new object each render would tear the
  // terminal down and rebuild it on every state change.
  const transport = useMemo(
    () => createLocalTransport({ banner: DEMO_BANNER, commands: DEMO_COMMANDS }),
    [],
  );

  const run = (command: string) => {
    panelRef.current?.sendText(`${command}\r`);
    panelRef.current?.focus();
  };

  const rail = (
    <CommandSidebar
      commands={DEMO_COMMAND_ENTRIES}
      onSelect={run}
      disabled={status !== 'connected'}
      categoryOrder={COMMAND_CATEGORY_ORDER}
      categoryLabels={COMMAND_CATEGORY_LABELS}
    />
  );

  return (
    <SplitPane rail={rail} railWidth={260}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <PageHeader
          title="Terminal"
          subtitle="An xterm panel fed by a pluggable transport. This one runs entirely in the browser; createTtydTransport points the same panel at a real shell."
          actions={
            <Stack direction="row" spacing={1.5} alignItems="center">
              <StatusDot name={status} state={STATUS_STATE[status]} detail="local transport" />
              <ToolbarButton
                variant="outlined"
                startIcon={<TerminalRoundedIcon />}
                onClick={() => run('help')}
              >
                Run help
              </ToolbarButton>
            </Stack>
          }
        />
      </Box>

      {/* The panel fills whatever height is left; xterm needs a resolved size,
          which is why this is a flex child with minHeight 0 rather than auto. */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <TerminalPanel ref={panelRef} transport={transport} onStatusChange={setStatus} />
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 }, py: 1, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography sx={captionMuted}>
          Type into the terminal, or click a command in the rail. Ctrl+C clears the line, Ctrl+L
          clears the screen, and the up/down arrows walk history.
        </Typography>
      </Box>
    </SplitPane>
  );
}
