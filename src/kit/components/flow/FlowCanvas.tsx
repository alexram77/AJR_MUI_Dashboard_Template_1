/**
 * Themed React Flow canvas.
 *
 * Owns presentation only — background grid, edge styling, minimap, controls,
 * and turning a palette drop into flow coordinates. Graph state (nodes, edges,
 * what a connection means) stays with the caller, because that is where the
 * domain rules live: whether a cycle is legal, whether two blocks may connect,
 * what a fan-out compiles to.
 *
 * Must be rendered inside a `<ReactFlowProvider>`; `FlowEditor` does that for
 * you.
 */
import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnSelectionChangeFunc,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BLOCK_DND_TYPE } from './blockCategories';
import { BLOCK_NODE_TYPES } from './BlockNode';
import type { BlockNodeData } from './types';

export interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  /** Reject a wire before it is made — cycles, type mismatches, duplicates. */
  isValidConnection?: (connection: Connection | Edge) => boolean;
  /** Selection changed. Receives the first selected node id, or null. */
  onSelectionChange?: (nodeId: string | null) => void;
  /** A palette block was dropped. Position is already in flow coordinates. */
  onBlockDrop?: (blockType: string, position: { x: number; y: number }) => void;
  /** A node finished being dragged — persist its position. */
  onNodeMoved?: (nodeId: string, position: { x: number; y: number }) => void;
  /** Double-click on a non-container node. */
  onNodeOpen?: (nodeId: string) => void;
  /** Read-only canvas: no wiring, no deletion. */
  readOnly?: boolean;
  /**
   * Zoom floor. React Flow's default of 0.5 is too high for a wide graph:
   * `fitView` cannot zoom out past it, so a pipeline more than a few blocks
   * long silently overflows the viewport instead of fitting. 0.15 lets a
   * ~20-block chain fit a laptop screen.
   */
  minZoom?: number;
  maxZoom?: number;
  showMiniMap?: boolean;
  showControls?: boolean;
  /** Extra overlay children — panels, legends, empty-state notices. */
  children?: ReactNode;
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  onSelectionChange,
  onBlockDrop,
  onNodeMoved,
  onNodeOpen,
  readOnly = false,
  minZoom = 0.15,
  maxZoom = 1.5,
  showMiniMap = true,
  showControls = true,
  children,
}: FlowCanvasProps) {
  const theme = useTheme();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesInitialized = useNodesInitialized();

  /**
   * Re-fit once the nodes have been measured, and again whenever the container
   * resizes.
   *
   * React Flow's `fitView` prop runs on mount against whatever size the
   * container had then. On a lazily-loaded page — or inside a pane that is
   * still settling — that is the wrong size, and the graph ends up scrolled
   * half behind the palette. Refitting on the real size is what makes the
   * initial view correct rather than approximately correct.
   */
  useEffect(() => {
    if (!nodesInitialized) return;
    const container = containerRef.current;
    if (!container) return;

    // rAF so the fit runs after the browser has applied the new layout.
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
          fitView({ padding: 0.2, minZoom, maxZoom });
        }
      });
    };

    refit();
    const observer = new ResizeObserver(refit);
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [nodesInitialized, fitView, minZoom, maxZoom]);

  const handleSelectionChange = useCallback<OnSelectionChangeFunc>(
    ({ nodes: selected }) => onSelectionChange?.(selected.length === 0 ? null : selected[0].id),
    [onSelectionChange],
  );

  // Only accept drags carrying our own MIME type; everything else falls
  // through to the browser so text and file drops are not swallowed.
  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (!event.dataTransfer.types.includes(BLOCK_DND_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const blockType = event.dataTransfer.getData(BLOCK_DND_TYPE);
      if (!blockType || readOnly || !onBlockDrop) return;
      event.preventDefault();
      onBlockDrop(blockType, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
    [readOnly, onBlockDrop, screenToFlowPosition],
  );

  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Containers drill in via their own card affordance, not this handler.
      if ((node.data as BlockNodeData).childCount !== undefined) return;
      onNodeOpen?.(node.id);
    },
    [onNodeOpen],
  );

  return (
    <Box
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
        bgcolor: 'background.default',
        '& .react-flow__attribution': { display: 'none' },
        '& .react-flow__edge-path': {
          strokeWidth: 2.5,
          stroke: alpha(theme.palette.text.secondary, 0.5),
        },
        '& .react-flow__edge.selected .react-flow__edge-path, & .react-flow__edge:hover .react-flow__edge-path': {
          stroke: theme.palette.primary.main,
          strokeWidth: 3,
        },
        '& .react-flow__controls-button': {
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.secondary,
          '&:hover': { background: theme.palette.action.hover },
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={BLOCK_NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onSelectionChange={handleSelectionChange}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeDragStop={(_event, node) => onNodeMoved?.(node.id, node.position)}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom, maxZoom }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable
        deleteKeyCode={readOnly ? null : ['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color={theme.palette.divider} />

        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            maskColor={theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}
            nodeColor={(node) => (node.data as BlockNodeData).style?.color ?? theme.palette.text.secondary}
            style={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
            }}
          />
        )}

        {showControls && <Controls position="bottom-left" showInteractive={false} />}
        {children}
      </ReactFlow>
    </Box>
  );
}
