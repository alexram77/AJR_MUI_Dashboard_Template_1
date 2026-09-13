/**
 * Application top bar.
 *
 * Owns only three things: the mobile menu button, the page title (derived from
 * the nav declaration, never passed in), and the colour-mode toggle. Everything
 * else — status dots, quota bars, account menus — arrives through the `status`
 * and `actions` slots, so the bar never grows app-specific branches.
 */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import type { ReactNode } from 'react';
import { ColorModeToggle } from '../theme/ColorModeToggle';
import { usePageTitle } from './usePageTitle';

export interface TopBarProps {
  onMenuOpen: () => void;
  /** Centre-right slot — status dots, quota bars, live indicators. */
  status?: ReactNode;
  /** Far-right slot — account menu, sign out, refresh. */
  actions?: ReactNode;
  /** Hide the built-in colour-mode toggle if the app renders its own. */
  hideColorModeToggle?: boolean;
}

/** Thin vertical rule used to group the bar's right-hand slots. */
function SlotDivider() {
  return <Box sx={{ width: '1px', height: 16, bgcolor: 'divider', mx: { xs: 0.25, md: 0.75 } }} />;
}

export function TopBar({ onMenuOpen, status, actions, hideColorModeToggle }: TopBarProps) {
  const title = usePageTitle();

  return (
    <AppBar position="static" elevation={0} sx={{ flexShrink: 0 }}>
      <Toolbar sx={{ gap: 1, minHeight: { xs: 52, md: 56 } }}>
        <IconButton
          size="small"
          edge="start"
          onClick={onMenuOpen}
          sx={{ display: { md: 'none' }, color: 'text.secondary', mr: 0.5 }}
          aria-label="Open navigation"
        >
          <MenuRoundedIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' }, whiteSpace: 'nowrap' }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {status && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, minWidth: 0 }}>
              {status}
            </Box>
            <SlotDivider />
          </>
        )}

        {actions}
        {!hideColorModeToggle && <ColorModeToggle />}
      </Toolbar>
    </AppBar>
  );
}
