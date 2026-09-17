/**
 * Application top bar.
 *
 * Owns only three things: the mobile menu button, the page title and its
 * one-line description (both derived from the nav declaration, never passed
 * in), and the colour-mode toggle. Everything
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
import { usePageDescription, usePageTitle } from './usePageMeta';

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
  const description = usePageDescription();

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

        {/* Title and description share one row. The description gives up its
            space first and truncates, so a long one can never push the status
            slot off the bar. No `overflow: hidden` here on purpose: it would
            clip the title itself once the bar gets tight, and a half-rendered
            page name is worse than a squeezed status slot.

            `minWidth` is the breakpoint that decides who gives way. From lg,
            0 lets this row shrink so the description truncates instead of
            pushing the status slot off the bar. Below lg there is no
            description to give up, so the default `auto` floors the row at the
            title's width and the status slot yields — losing the end of a
            status label costs less than losing the page's name. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            minWidth: { xs: 'auto', lg: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.95rem', md: '1rem' },
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              // Shown from lg. Below that the bar is carrying the menu button,
              // the title, the status slot and the toggle, and what is left for
              // a description truncates to a two-character stub that reads as a
              // bug. The ellipsis below is still the safety net for an app
              // whose status slot is denser than this one's.
              variant="body2"
              color="text.secondary"
              sx={{
                display: { xs: 'none', lg: 'block' },
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {status && (
          <>
            <Box
              // flexShrink: 0 so the description is the only thing that gives
              // when the bar runs short. Let this shrink too and the indicators
              // compress instead, wrapping their labels mid-word.
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 1.5 },
                flexShrink: 0,
              }}
            >
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
