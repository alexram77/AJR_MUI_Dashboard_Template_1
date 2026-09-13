/** Block builder — a themed React Flow editor with no domain knowledge. */
export { FlowEditor } from './FlowEditor';
export type { FlowEditorProps } from './FlowEditor';
export { FlowCanvas } from './FlowCanvas';
export type { FlowCanvasProps } from './FlowCanvas';
export { BlockNode, BLOCK_NODE_TYPES, NODE_WIDTH, NODE_HEIGHT } from './BlockNode';
export { BlockPalette } from './BlockPalette';
export type { BlockPaletteProps } from './BlockPalette';
export { BlockInspector } from './BlockInspector';
export type { BlockInspectorProps } from './BlockInspector';
export { FlowBreadcrumb } from './FlowBreadcrumb';
export type { FlowBreadcrumbProps } from './FlowBreadcrumb';
export { layoutGraph } from './autoLayout';
export type { LayoutEdge, LayoutOptions, PositionMap } from './autoLayout';
export {
  DEFAULT_BLOCK_CATEGORIES,
  FALLBACK_CATEGORY,
  BLOCK_DND_TYPE,
  makeCategoryStyle,
  styleForCategory,
} from './blockCategories';
export type { BlockCategoryStyle, BlockDefinition, BlockNodeData, BreadcrumbSegment } from './types';
