/**
 * The demo app's navigation declaration.
 *
 * This is the whole contract between an app and the kit's shell: one object.
 * Copy this file into a new project, change the entries, and the sidebar, top
 * bar titles and mobile bottom bar all follow.
 */
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import VerticalSplitRoundedIcon from '@mui/icons-material/VerticalSplitRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import type { BrandConfig, BuildInfo, NavConfig } from '@kit/layout';

export const BRAND: BrandConfig = {
  name: 'AJR',
  tagline: 'DASHBOARD KIT',
  href: '/overview',
};

export const BUILD_INFO: BuildInfo = {
  lines: ['kit v0.1.0', 'demo build'],
};

export const NAV: NavConfig = {
  sections: [
    {
      items: [
        {
          label: 'Overview',
          href: '/overview',
          icon: <DashboardRoundedIcon fontSize="small" />,
          primary: true,
        },
      ],
    },
    {
      label: 'Blocks',
      items: [
        {
          label: 'Cards & Shells',
          href: '/blocks',
          icon: <WidgetsRoundedIcon fontSize="small" />,
          primary: true,
          shortLabel: 'Blocks',
        },
        {
          label: 'Charts',
          href: '/charts',
          icon: <InsightsRoundedIcon fontSize="small" />,
        },
        {
          label: 'Meters',
          href: '/meters',
          icon: <SpeedRoundedIcon fontSize="small" />,
        },
        {
          label: 'Tables & Detail',
          href: '/tables',
          icon: <TableChartRoundedIcon fontSize="small" />,
          shortLabel: 'Tables',
        },
        {
          label: 'Controls & Dialogs',
          href: '/controls',
          icon: <TuneRoundedIcon fontSize="small" />,
          primary: true,
          shortLabel: 'Controls',
        },
        {
          label: 'Status',
          href: '/status',
          icon: <MonitorHeartRoundedIcon fontSize="small" />,
        },
        {
          label: 'Split View',
          href: '/split',
          icon: <VerticalSplitRoundedIcon fontSize="small" />,
        },
      ],
    },
    {
      label: 'Systems',
      items: [
        {
          label: 'Sensors',
          href: '/sensors',
          icon: <SensorsRoundedIcon fontSize="small" />,
          primary: true,
        },
        {
          label: 'Block Builder',
          href: '/builder',
          icon: <AccountTreeRoundedIcon fontSize="small" />,
          primary: true,
          shortLabel: 'Builder',
        },
        {
          label: 'Terminal',
          href: '/terminal',
          icon: <TerminalRoundedIcon fontSize="small" />,
        },
      ],
    },
    {
      label: 'Reference',
      items: [
        {
          label: 'Theme Tokens',
          href: '/theme',
          icon: <PaletteRoundedIcon fontSize="small" />,
        },
      ],
    },
  ],
};
