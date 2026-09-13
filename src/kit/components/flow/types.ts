/**
 * Block-builder contracts.
 *
 * The kit supplies the *editor* — palette, canvas, node chrome, inspector —
 * and knows nothing about what a block means. An app declares its block types
 * and owns the graph state; that split is what lets the same editor drive a
 * mission sequencer, an ETL pipeline or an automation flow.
 */
import type { ReactNode } from 'react';

/** Visual identity for one block category. */
export interface BlockCategoryStyle {
  /** Primary hue: left accent bar, icon tint, palette heading, minimap dot. */
  color: string;
  /** Faint wash behind the node's icon well. */
  iconBg: string;
  /** Heading shown in the palette. */
  label: string;
}

/** A block type the palette offers and the canvas can instantiate. */
export interface BlockDefinition {
  /** Stable type key, written into created nodes. */
  type: string;
  /** Name shown on the palette row and the node card. */
  label: string;
  /** Category key into the style map. */
  category: string;
  icon: ReactNode;
  /** Tooltip — what the block does. */
  description?: string;
  /** Blocks that contain other blocks; the node card gets a drill-in affordance. */
  isContainer?: boolean;
}

/** Data carried on a canvas node. Read by `BlockNode`. */
export interface BlockNodeData extends Record<string, unknown> {
  definition: BlockDefinition;
  style: BlockCategoryStyle;
  /** Second line on the card — usually a parameter summary. */
  subtitle?: string;
  /** Container blocks: how many children they hold. */
  childCount?: number;
  /** Flagged by validation — drawn with a red ring. */
  invalid?: boolean;
  /** Full-width strip across the top of the card, e.g. a severity. */
  accent?: { label: string; color: string };
  /** Handles accept connections. False in a read-only canvas. */
  connectable?: boolean;
  /** Hide the left (target) handle — entry blocks and triggers. */
  hideTargetHandle?: boolean;
  /** Hide the right (source) handle — terminal blocks. */
  hideSourceHandle?: boolean;
  /** Double-click on a container. */
  onDrillIn?: (nodeId: string) => void;
  /** The node's own id, so callbacks can identify it. */
  nodeId?: string;
}

/** One level of a drill-down path, for `FlowBreadcrumb`. */
export interface BreadcrumbSegment {
  id: string;
  label: string;
}
