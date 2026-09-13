/**
 * Resolves the TopBar title for the current route from the nav declaration —
 * so the sidebar label and the page title can never drift apart.
 *
 * Resolution order: exact nav match → `extraTitles` → `resolveTitle()` → ''.
 */
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

export function usePageTitle(): string {
  const { pathname } = useLocation();
  const { nav, allItems } = useNavigation();

  const match = allItems.find((item) => item.href === pathname);
  if (match) return match.label;

  const extra = nav.extraTitles?.[pathname];
  if (extra) return extra;

  return nav.resolveTitle?.(pathname) ?? '';
}
