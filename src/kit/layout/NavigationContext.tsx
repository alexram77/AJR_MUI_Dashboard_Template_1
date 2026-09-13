/**
 * Makes the nav/brand declaration available to every shell component without
 * prop-drilling through AppShell → SideMenu → SideMenuContent → SideMenuItem.
 *
 * Only the shell consumes this. Pages should not read it; a page that needs to
 * know about navigation should take what it needs as a prop.
 */
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { BrandConfig, BuildInfo, NavConfig, NavItem } from './types';

interface NavigationContextValue {
  nav: NavConfig;
  brand: BrandConfig;
  buildInfo?: BuildInfo;
  /** Every item across every section, flattened — for lookups. */
  allItems: NavItem[];
  /** Items flagged `primary`, for the mobile bottom bar. */
  primaryItems: NavItem[];
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export interface NavigationProviderProps {
  nav: NavConfig;
  brand: BrandConfig;
  buildInfo?: BuildInfo;
  children: ReactNode;
}

export function NavigationProvider({ nav, brand, buildInfo, children }: NavigationProviderProps) {
  const value = useMemo<NavigationContextValue>(() => {
    const allItems = nav.sections.flatMap((section) => section.items);
    return {
      nav,
      brand,
      buildInfo,
      allItems,
      primaryItems: allItems.filter((item) => item.primary && !item.disabled),
    };
  }, [nav, brand, buildInfo]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

/** Throws rather than returning a silent default — a missing provider is a bug. */
export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used inside <NavigationProvider> (rendered by <AppShell>).');
  }
  return ctx;
}
