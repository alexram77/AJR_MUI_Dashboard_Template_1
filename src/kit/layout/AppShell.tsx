/**
 * The application frame: sidebar + top bar + scrolling main region + mobile
 * bottom bar.
 *
 * The shell owns the viewport. It pins itself to 100dvh and hides overflow, so
 * scrolling happens *inside* the main region rather than on the document —
 * which is what keeps the sidebar and top bar fixed without position: fixed.
 *
 * Pages render into it either as `children` or, with react-router, as the
 * `<Outlet/>` of a layout route:
 *
 *   <Route element={<AppShell nav={nav} brand={brand} />}>
 *     <Route path="/overview" element={<OverviewPage />} />
 *   </Route>
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { NavigationProvider } from './NavigationContext';
import { SideMenu } from './SideMenu';
import { TopBar } from './TopBar';
import type { BrandConfig, BuildInfo, NavConfig } from './types';

export interface AppShellProps {
  nav: NavConfig;
  brand: BrandConfig;
  /** Small print pinned under the sidebar nav (commit sha, env, user). */
  buildInfo?: BuildInfo;
  /** TopBar centre-right slot. */
  topBarStatus?: ReactNode;
  /** TopBar far-right slot. */
  topBarActions?: ReactNode;
  /** Full-width strip between the top bar and the content (banners, alerts). */
  banner?: ReactNode;
  /** Page content. Omit to render the router `<Outlet/>`. */
  children?: ReactNode;
}

export function AppShell({
  nav,
  brand,
  buildInfo,
  topBarStatus,
  topBarActions,
  banner,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer on every route change — otherwise it stays open
  // over the page the user just navigated to.
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <NavigationProvider nav={nav} brand={brand} buildInfo={buildInfo}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          '@supports (height: 100dvh)': { height: '100dvh' },
          overflow: 'hidden',
        }}
      >
        <SideMenu mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <TopBar
            onMenuOpen={() => setMobileOpen(true)}
            status={topBarStatus}
            actions={topBarActions}
          />

          {banner}

          {/* Flex column so a PageContainer child fills the area and scrolls
              internally, with an identical gutter on all four sides at every
              breakpoint. */}
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minHeight: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            {children ?? <Outlet />}
          </Box>

          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <BottomNav />
          </Box>
        </Box>
      </Box>
    </NavigationProvider>
  );
}
