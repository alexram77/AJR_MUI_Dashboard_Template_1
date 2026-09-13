/**
 * The sidebar, in both of its forms.
 *
 * Desktop (md+): a permanent drawer that takes part in the shell's flex row.
 * Mobile: a temporary drawer over the content, opened from the TopBar's menu
 * button. `keepMounted` keeps the nav in the DOM so opening it is instant and
 * the list does not re-measure on every open.
 */
import Box from '@mui/material/Box';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { SideMenuContent } from './SideMenuContent';

/** Sidebar width in px. The one number every shell measurement derives from. */
export const DRAWER_WIDTH = 220;

const drawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: 'border-box' as const,
  backgroundColor: 'background.paper',
  backgroundImage: 'none',
  borderRight: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column' as const,
};

export interface SideMenuProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function SideMenu({ mobileOpen, onMobileClose }: SideMenuProps) {
  return (
    <Box component="nav" sx={{ flexShrink: 0 }}>
      {/* Mobile: overlay drawer */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .${drawerClasses.paper}`]: drawerPaperSx,
        }}
      >
        <SideMenuContent onNavigate={onMobileClose} />
      </MuiDrawer>

      {/* Desktop: permanent drawer */}
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .${drawerClasses.paper}`]: drawerPaperSx,
        }}
      >
        <SideMenuContent />
      </MuiDrawer>
    </Box>
  );
}
