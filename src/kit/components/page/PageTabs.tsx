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
import { BADGE_SIZING } from '../../theme/sizing';

export interface PageTabItem<T extends number | string> {
  value: T;
  label: string;
  /** Small leading icon. Sized by the tab bar — do not set a size on it. */
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
      sx={{
        minHeight: TAB_HEIGHT,
        // The bar sizes its own icons so a page cannot hand in a mismatched one.
        '& .MuiTab-iconWrapper': { fontSize: `${BADGE_SIZING.iconSize} !important` },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={String(tab.value)}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          iconPosition={tab.icon ? 'start' : undefined}
          disabled={tab.disabled}
          sx={{
        minHeight: TAB_HEIGHT,
        // The bar sizes its own icons so a page cannot hand in a mismatched one.
        '& .MuiTab-iconWrapper': { fontSize: `${BADGE_SIZING.iconSize} !important` },
      }}
        />
      ))}
    </Tabs>
  );
}
