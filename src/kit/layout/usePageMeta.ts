/**
 * Resolves the TopBar's title and one-line description for the current route
 * from the nav declaration — so the sidebar label and the page title can never
 * drift apart, and a page never restates its own name in its body.
 *
 * Both resolve the same way: exact nav match → the `extra*` map → the
 * `resolve*` callback → nothing.
 */
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';
import type { NavConfig, NavItem } from './types';

/** Shared lookup for anything the nav declaration carries per route. */
function useNavField<T>(
  pick: (item: NavItem) => T | undefined,
  extras: (nav: NavConfig) => Record<string, string> | undefined,
  resolve: (nav: NavConfig) => ((pathname: string) => string | undefined) | undefined,
): T | string | undefined {
  const { pathname } = useLocation();
  const { nav, allItems } = useNavigation();

  const match = allItems.find((item) => item.href === pathname);
  if (match) {
    const value = pick(match);
    if (value !== undefined) return value;
  }

  return extras(nav)?.[pathname] ?? resolve(nav)?.(pathname);
}

/** The current route's page title. Empty string when nothing declares one. */
export function usePageTitle(): string {
  return (
    (useNavField(
      (item) => item.label,
      (nav) => nav.extraTitles,
      (nav) => nav.resolveTitle,
    ) as string | undefined) ?? ''
  );
}

/**
 * The current route's one-line description, shown beside the title in the top
 * bar. Undefined when the route declares none — the bar then shows the title
 * alone rather than reserving empty space.
 */
export function usePageDescription(): string | undefined {
  return useNavField(
    (item) => item.description,
    (nav) => nav.extraDescriptions,
    (nav) => nav.resolveDescription,
  ) as string | undefined;
}
