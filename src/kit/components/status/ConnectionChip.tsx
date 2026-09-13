/**
 * Connection state, as one clickable chip.
 *
 * Disconnected renders a call-to-action button rather than a grey chip,
 * because "not connected" is a thing the user must *do* something about.
 * Connected renders the transport and, when known, the latency — a connection
 * that is up but slow is a different problem from one that is down.
 */
import type { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';

export interface ConnectionChipProps {
  connected: boolean;
  /** Short transport label — 'LAN', 'TUNNEL', 'DEMO', 'WS'. */
  modeLabel?: string;
  /** Transport icon. */
  modeIcon?: ReactElement;
  /** Round-trip time in ms, appended to the tooltip. */
  latencyMs?: number | null;
  /** Endpoint or explanation for the tooltip. */
  detail?: string;
  /** Opens the connection picker. Fires from both states. */
  onClick?: () => void;
  /** Label for the disconnected button. */
  connectLabel?: string;
  /**
   * A simulated connection. Renders amber rather than green — live-looking
   * fake data is the single most expensive thing a dashboard can imply.
   */
  simulated?: boolean;
}

export function ConnectionChip({
  connected,
  modeLabel,
  modeIcon,
  latencyMs,
  detail,
  onClick,
  connectLabel = 'Connect',
  simulated = false,
}: ConnectionChipProps) {
  if (!connected) {
    return (
      <Button
        variant="contained"
        size="small"
        startIcon={<LinkRoundedIcon />}
        endIcon={onClick ? <KeyboardArrowDownRoundedIcon /> : undefined}
        onClick={onClick}
        sx={{ fontWeight: 700, px: 1.5 }}
      >
        {connectLabel}
      </Button>
    );
  }

  const tooltip = [detail, latencyMs != null ? `${latencyMs} ms` : null].filter(Boolean).join(' · ');

  return (
    <Tooltip title={tooltip}>
      <Chip
        icon={modeIcon}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            {modeLabel}
            {onClick && <KeyboardArrowDownRoundedIcon sx={{ fontSize: '0.85rem' }} />}
          </Box>
        }
        size="small"
        color={simulated ? 'warning' : 'success'}
        variant="filled"
        onClick={onClick}
        sx={{ fontWeight: 700, letterSpacing: 0.5, cursor: onClick ? 'pointer' : 'default' }}
      />
    </Tooltip>
  );
}
