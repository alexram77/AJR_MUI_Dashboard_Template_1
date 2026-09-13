/**
 * Wires the route table into the kit's AppShell.
 *
 * The shell is a layout route, so every page renders through its `<Outlet/>`
 * and inherits the sidebar, top bar and mobile bottom bar without knowing they
 * exist. The Suspense boundary covers the lazily-loaded pages.
 */
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { AppShell } from '@kit/layout';
import { BRAND, BUILD_INFO, NAV } from '@demo/navigation';
import { APP_ROUTES } from '@demo/routes';
import { DemoTopBarActions, DemoTopBarStatus } from '@demo/TopBarSlots';
import NotFoundPage from '@demo/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <AppShell
            nav={NAV}
            brand={BRAND}
            buildInfo={BUILD_INFO}
            topBarStatus={<DemoTopBarStatus />}
            topBarActions={<DemoTopBarActions />}
          />
        }
      >
        {APP_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Suspense fallback={<LinearProgress />}>{route.element}</Suspense>}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
