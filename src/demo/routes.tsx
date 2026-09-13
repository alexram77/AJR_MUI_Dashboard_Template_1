/**
 * Route table for the demo.
 *
 * Kept as data rather than JSX so `App.tsx` stays a three-line file and adding
 * a page is a one-line change here.
 *
 * The three heavy pages are lazy — React Flow and xterm are ~400 kB between
 * them, and a visitor who only looks at the overview should not pay for either.
 * `App` wraps the outlet in a Suspense boundary.
 */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import OverviewPage from './pages/OverviewPage';
import BlocksPage from './pages/BlocksPage';
import ChartsPage from './pages/ChartsPage';
import MetersPage from './pages/MetersPage';
import TablesPage from './pages/TablesPage';
import ControlsPage from './pages/ControlsPage';
import StatusPage from './pages/StatusPage';
import SplitViewPage from './pages/SplitViewPage';
import ThemePage from './pages/ThemePage';
import SensorsPage from './pages/SensorsPage';

const FlowBuilderPage = lazy(() => import('./pages/FlowBuilderPage'));
const TerminalPage = lazy(() => import('./pages/TerminalPage'));

export interface AppRoute {
  path: string;
  element: ReactElement;
}

export const APP_ROUTES: AppRoute[] = [
  { path: '/', element: <Navigate to="/overview" replace /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/blocks', element: <BlocksPage /> },
  { path: '/charts', element: <ChartsPage /> },
  { path: '/meters', element: <MetersPage /> },
  { path: '/tables', element: <TablesPage /> },
  { path: '/controls', element: <ControlsPage /> },
  { path: '/status', element: <StatusPage /> },
  { path: '/split', element: <SplitViewPage /> },
  { path: '/sensors', element: <SensorsPage /> },
  { path: '/builder', element: <FlowBuilderPage /> },
  { path: '/terminal', element: <TerminalPage /> },
  { path: '/theme', element: <ThemePage /> },
];
