/**
 * In-card tab bar, rendered as the first row of a page card via
 * `<PageContainer tabs={...}>` (which supplies the divider and gutter).
 *
 * Generic over the tab value so a page can key its tabs on a string union and
 * keep exhaustive switching.
 */
import type { ReactElement } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TAB_HEIGHT } from '../../theme/customizations';

export interface PageTabItem<T extends number | string> {
  value: T;
  label: string;
  /** Small leading icon — pass `sx={{ fontSize: '0.9rem' }}`. */
  icon?: ReactElement;
  disabled?: boolean;
}

export interface PageTabsProps<T extends number | string> {
  tabs: PageTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function PageTabs<T extends number | string>({ tabs, value, onChange }: PageTabsProps<T>) {
  return (
    <Tabs
      value={value}
      onChange={(_, next) => onChange(next as T)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{ minHeight: TAB_HEIGHT }}
    >
      {tabs.map((tab) => (
        <Tab
          key={String(tab.value)}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          iconPosition={tab.icon ? 'start' : undefined}
          disabled={tab.disabled}
          sx={{ minHeight: TAB_HEIGHT }}
        />
      ))}
    </Tabs>
  );
}
