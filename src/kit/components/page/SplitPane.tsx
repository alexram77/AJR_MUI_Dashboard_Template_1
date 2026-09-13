/**
 * Two-column page body with a collapsible left rail.
 *
 * Desktop (md+): the rail renders inline at a fixed width; the narrow column
 * beside it is the entire collapse target — no round button, just a centred
 * chevron whose background lightens on hover.
 *
 * Mobile: rail and main each take the full width and the user swaps between
 * them via a round button in the gutter below. Both stay mounted
 * (`display: none`) so component state survives the swap.
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PAGE_CARD_SX } from './pageCardSx';

/** Width of the desktop collapse column. The whole column is the click target. */
const CHEVRON_COL_WIDTH = 16;
/**
 * Size of the mobile swap button. 44px is the tap-target minimum; this control
 * only renders below `md`, so the number cannot affect desktop.
 */
const MOBILE_TOGGLE_SIZE = 44;

export interface SplitPaneProps {
  /** Left rail content. Omit and the component degrades to a plain page card. */
  rail?: ReactNode;
  /** Rail width in px on desktop. Mobile always uses the full card. */
  railWidth?: number;
  children: ReactNode;
  /** Override the outer wrapper — useful for `flex` weights when stacking. */
  sx?: SxProps<Theme>;
}

export function SplitPane({ rail, railWidth = 300, children, sx }: SplitPaneProps) {
  const isMobile = useIsMobile();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  // Crossing the breakpoint resets the other mode's state so the pane never
  // reappears in an inconsistent position.
  useEffect(() => {
    if (isMobile) setDesktopCollapsed(false);
    else setMobileRailOpen(false);
  }, [isMobile]);

  const hasRail = rail !== undefined && rail !== null;
  const railVisible = hasRail && (isMobile ? mobileRailOpen : !desktopCollapsed);
  const mainVisible = !(isMobile && hasRail && mobileRailOpen);

  const toggleDesktop = () => setDesktopCollapsed((collapsed) => !collapsed);

  return (
    <Box
      sx={[
        { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0, width: '100%' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as SxProps<Theme>}
    >
      <Box sx={{ ...PAGE_CARD_SX, flexDirection: 'row', position: 'relative' }}>
        {hasRail && (
          <Box
            sx={{
              display: railVisible ? 'flex' : 'none',
              flexDirection: 'column',
              width: isMobile ? '100%' : railWidth,
              flexShrink: 0,
              bgcolor: 'background.paper',
              overflowY: 'auto',
            }}
          >
            {rail}
          </Box>
        )}

        {hasRail && !isMobile && (
          <Tooltip title={desktopCollapsed ? 'Show panel' : 'Hide panel'} placement="right">
            <Box
              role="button"
              tabIndex={0}
              aria-label={desktopCollapsed ? 'Show panel' : 'Hide panel'}
              onClick={toggleDesktop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleDesktop();
                }
              }}
              sx={{
                width: CHEVRON_COL_WIDTH,
                flexShrink: 0,
                bgcolor: 'background.paper',
                borderRight: 1,
                borderColor: 'divider',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                transition: 'background-color 120ms ease, color 120ms ease',
                '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '-2px',
                },
              }}
            >
              {desktopCollapsed ? (
                <ChevronRightRoundedIcon sx={{ fontSize: '1rem' }} />
              ) : (
                <ChevronLeftRoundedIcon sx={{ fontSize: '1rem' }} />
              )}
            </Box>
          </Tooltip>
        )}

        <Box
          sx={{
            display: mainVisible ? 'flex' : 'none',
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Box>

      {isMobile && hasRail && (
        <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Tooltip title={mobileRailOpen ? 'Back to main view' : 'Show panel'}>
            <IconButton
              onClick={() => setMobileRailOpen((open) => !open)}
              aria-label={mobileRailOpen ? 'Back to main view' : 'Show panel'}
              sx={{
                width: MOBILE_TOGGLE_SIZE,
                height: MOBILE_TOGGLE_SIZE,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: '50%',
                color: mobileRailOpen ? 'primary.main' : 'text.secondary',
                '&:hover': { bgcolor: 'action.hover', color: 'primary.main', borderColor: 'primary.main' },
              }}
            >
              <MenuOpenRoundedIcon
                sx={{ fontSize: '1.2rem', transform: mobileRailOpen ? 'scaleX(-1)' : 'none' }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
