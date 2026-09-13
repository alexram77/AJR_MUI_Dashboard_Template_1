/**
 * Shell configuration types.
 *
 * The whole app shell is driven by these objects — an app declares its nav and
 * brand once and never touches the shell components themselves. That is what
 * makes the shell portable between projects.
 */
import type { ReactNode } from 'react';

/** One sidebar entry. */
export interface NavItem {
  /** Sidebar label, and the TopBar page title when this route is active. */
  label: string;
  /** Route path. Matched exactly for selection. */
  href: string;
  /** Leading icon — pass `fontSize="small"` for the correct scale. */
  icon?: ReactNode;
  /** Renders greyed out with a tooltip; clicks are ignored. */
  disabled?: boolean;
  /** Small trailing chip, e.g. "soon", "beta", a count. */
  badge?: string;
  /** Include in the mobile bottom bar. Keep to at most six per app. */
  primary?: boolean;
  /** Short label for the bottom bar, where horizontal space is tight. */
  shortLabel?: string;
}

/** A labelled group of nav entries. An unlabelled section renders no header. */
export interface NavSection {
  label?: string;
  items: NavItem[];
}

/** The complete navigation declaration for an app. */
export interface NavConfig {
  sections: NavSection[];
  /**
   * Page titles for routes that are reachable but not in the sidebar
   * (detail pages, sub-routes). Keys are exact paths.
   */
  extraTitles?: Record<string, string>;
  /**
   * Last-resort title resolver for dynamic routes, e.g. `/catalog/:id`.
   * Returns `undefined` to fall through to an empty title.
   */
  resolveTitle?: (pathname: string) => string | undefined;
}

/** Sidebar wordmark. */
export interface BrandConfig {
  /** Primary word, rendered bold. */
  name: string;
  /** Optional second line, rendered small and letter-spaced beneath. */
  tagline?: string;
  /** Optional leading logo/mark. */
  icon?: ReactNode;
  /** Where clicking the wordmark navigates. Defaults to the first nav item. */
  href?: string;
}

/** Small print pinned to the bottom of the sidebar (build sha, user, env). */
export interface BuildInfo {
  lines: string[];
}
