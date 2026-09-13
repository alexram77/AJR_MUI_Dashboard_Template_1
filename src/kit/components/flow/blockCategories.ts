/**
 * Default category palette for block canvases.
 *
 * Hues are chosen to stay distinguishable at the small swatch sizes a node
 * card uses, in both colour schemes. An app can use these keys as-is or
 * declare its own map of the same shape — nothing in the editor assumes these
 * particular names.
 */
import type { BlockCategoryStyle } from './types';

/**
 * Build a category style from one hue, so custom categories match the set.
 * `hsl` is the base colour; the icon wash is the same hue at low alpha.
 */
export function makeCategoryStyle(label: string, hue: number, saturation = 80, lightness = 58): BlockCategoryStyle {
  return {
    label,
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    iconBg: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.12)`,
  };
}

export const DEFAULT_BLOCK_CATEGORIES: Record<string, BlockCategoryStyle> = {
  trigger: makeCategoryStyle('Triggers', 187, 95, 45),
  flow: makeCategoryStyle('Flow control', 265, 70, 60),
  time: makeCategoryStyle('Time', 215, 80, 60),
  io: makeCategoryStyle('Inputs & outputs', 195, 85, 55),
  action: makeCategoryStyle('Actions', 28, 90, 58),
  capture: makeCategoryStyle('Capture', 142, 65, 50),
  log: makeCategoryStyle('Log markers', 220, 12, 55),
  alert: makeCategoryStyle('Alerts', 355, 80, 60),
};

/** Fallback for a category key with no declared style. */
export const FALLBACK_CATEGORY: BlockCategoryStyle = makeCategoryStyle('Other', 220, 12, 55);

/** Look up a style, never returning undefined. */
export function styleForCategory(
  categories: Record<string, BlockCategoryStyle>,
  key: string,
): BlockCategoryStyle {
  return categories[key] ?? FALLBACK_CATEGORY;
}

/**
 * The drag-and-drop MIME type the palette writes and the canvas reads. Having
 * a specific type is what lets the canvas ignore text drags, tab drags and
 * files.
 */
export const BLOCK_DND_TYPE = 'application/x-ajr-block';
