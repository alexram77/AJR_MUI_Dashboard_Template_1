/**
 * Collapsible header for a group of channels from one device or subsystem.
 */
import type { ReactNode } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import type { ChannelGroup } from './channelStatus';

export interface ChannelGroupHeaderProps {
  group: ChannelGroup;
  open: boolean;
  onToggle: () => void;
  /** Status chip or alert badge shown before the count. */
  badge?: ReactNode;
}

export function ChannelGroupHeader({ group, open, onToggle, badge }: ChannelGroupHeaderProps) {
  return (
    <ListItemButton
      onClick={onToggle}
      sx={{ py: 1, px: 2, bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
    >
      <ListItemText
        primary={group.label}
        slotProps={{ primary: { fontWeight: 600, fontSize: '0.85rem' } }}
      />
      {badge}
      <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5, ml: 1 }}>
        {group.channelIds.length}
      </Typography>
      {open ? (
        <ExpandLessIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
      ) : (
        <ExpandMoreIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
      )}
    </ListItemButton>
  );
}
