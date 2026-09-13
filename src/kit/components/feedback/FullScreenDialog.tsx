/**
 * Full-screen dialog with a close-button app bar.
 *
 * The mobile answer to a picker or detail panel that would not fit in a modal.
 */
import type { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export interface FullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Right-aligned app bar actions — save, filter, reset. */
  actions?: ReactNode;
  children: ReactNode;
}

export function FullScreenDialog({ open, onClose, title, actions, children }: FullScreenDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" size="small" onClick={onClose} sx={{ color: 'text.secondary' }} aria-label="Close">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {title}
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>

      <Box sx={{ overflowY: 'auto', flex: 1 }}>{children}</Box>
    </Dialog>
  );
}
