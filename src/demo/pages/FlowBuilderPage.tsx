/**
 * Block builder — drag from the palette, wire blocks together, edit the
 * selected one in the inspector.
 *
 * The page owns the graph and the rules (no self-loops, no duplicate wires, no
 * cycles); the kit owns the editor. That split is the point: a mission
 * sequencer, an ETL pipeline and an automation flow all use these same
 * components and differ only in this file.
 */
import { useCallback, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {
  BlockInspector,
  BlockPalette,
  DEFAULT_BLOCK_CATEGORIES,
  FlowCanvas,
  FlowEditor,
  layoutGraph,
  styleForCategory,
} from '@kit/components/flow';
import type { BlockNodeData } from '@kit/components/flow';
import { ToolbarButton } from '@kit/components/buttons';
import { captionMuted } from '@kit/theme';
import type { Connection, Edge, EdgeChange, Node, NodeChange } from '@xyflow/react';
import { BLOCKS, BLOCKS_BY_TYPE, BLOCK_CATEGORY_ORDER, INITIAL_GRAPH } from '@demo/data/blocks';

/** The page's own model: a block instance, independent of React Flow's node shape. */
interface BlockInstance {
  id: string;
  type: string;
  subtitle?: string;
  childCount?: number;
  position?: { x: number; y: number };
}

/** Depth-first reachability, used to reject a wire that would close a cycle. */
function reaches(edges: Array<{ source: string; target: string }>, from: string, to: string): boolean {
  const seen = new Set([from]);
  const stack = [from];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === to) return true;
    for (const edge of edges) {
      if (edge.source === current && !seen.has(edge.target)) {
        seen.add(edge.target);
        stack.push(edge.target);
      }
    }
  }
  return false;
}

let nextId = 100;

export default function FlowBuilderPage() {
  const [blocks, setBlocks] = useState<BlockInstance[]>(INITIAL_GRAPH.nodes);
  const [wires, setWires] = useState(INITIAL_GRAPH.edges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Auto-place anything without a saved position, so a fresh block still lands
  // somewhere sensible rather than at the origin.
  const autoPositions = useMemo(
    () => layoutGraph(blocks.map((block) => block.id), wires),
    [blocks, wires],
  );

  const nodes = useMemo<Node[]>(
    () =>
      blocks.map((block) => {
        const definition = BLOCKS_BY_TYPE[block.type];
        const data: BlockNodeData = {
          definition,
          style: styleForCategory(DEFAULT_BLOCK_CATEGORIES, definition.category),
          subtitle: block.subtitle,
          childCount: block.childCount,
          connectable: true,
          // A trigger has no input: nothing precedes the thing that starts the run.
          hideTargetHandle: definition.category === 'trigger',
        };
        return {
          id: block.id,
          type: 'blockNode',
          position: block.position ?? autoPositions[block.id] ?? { x: 0, y: 0 },
          selected: block.id === selectedId,
          data: data as unknown as Record<string, unknown>,
        };
      }),
    [blocks, autoPositions, selectedId],
  );

  const edges = useMemo<Edge[]>(
    () => wires.map((wire) => ({ ...wire, type: 'default' })),
    [wires],
  );

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Let React Flow compute the new node array, then fold the parts we own
    // (positions, deletions) back into our model.
    const removed = new Set(
      changes.filter((change) => change.type === 'remove').map((change) => change.id),
    );

    if (removed.size > 0) {
      setBlocks((previous) => previous.filter((block) => !removed.has(block.id)));
      setWires((previous) =>
        previous.filter((wire) => !removed.has(wire.source) && !removed.has(wire.target)),
      );
      setSelectedId((current) => (current && removed.has(current) ? null : current));
      return;
    }

    const positioned = changes.filter(
      (change) => change.type === 'position' && change.position !== undefined,
    );
    if (positioned.length > 0) {
      setBlocks((previous) =>
        previous.map((block) => {
          const change = positioned.find((c) => 'id' in c && c.id === block.id);
          return change && 'position' in change && change.position
            ? { ...block, position: change.position }
            : block;
        }),
      );
    }
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    const removed = new Set(
      changes.filter((change) => change.type === 'remove').map((change) => change.id),
    );
    if (removed.size > 0) setWires((previous) => previous.filter((wire) => !removed.has(wire.id)));
  }, []);

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const { source, target } = connection as Connection;
      if (!source || !target || source === target) return false;
      if (wires.some((wire) => wire.source === source && wire.target === target)) return false;
      // Wiring target → source would close a loop; a pipeline must stay acyclic.
      return !reaches(wires, target, source);
    },
    [wires],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection) || !connection.source || !connection.target) {
        setNotice('That wire would create a cycle, duplicate an existing one, or loop a block to itself.');
        return;
      }
      setNotice(null);
      setWires((previous) => [
        ...previous,
        { id: `e${nextId++}`, source: connection.source!, target: connection.target! },
      ]);
    },
    [isValidConnection],
  );

  const addBlock = useCallback((type: string, position?: { x: number; y: number }) => {
    const definition = BLOCKS_BY_TYPE[type];
    if (!definition) return;
    const id = `n${nextId++}`;
    setBlocks((previous) => [
      ...previous,
      { id, type, position, childCount: definition.isContainer ? 0 : undefined },
    ]);
    setSelectedId(id);
  }, []);

  const selected = blocks.find((block) => block.id === selectedId) ?? null;
  const selectedDefinition = selected ? BLOCKS_BY_TYPE[selected.type] : null;

  return (
    <FlowEditor
      paletteWidth={240}
      palette={
        <BlockPalette
          blocks={BLOCKS}
          categories={DEFAULT_BLOCK_CATEGORIES}
          categoryOrder={BLOCK_CATEGORY_ORDER}
          onAdd={(block) => addBlock(block.type)}
        />
      }
      toolbar={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Pipeline builder
          </Typography>
          <Typography sx={captionMuted}>
            {blocks.length} blocks · {wires.length} wires
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <ToolbarButton
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            disabled={!selectedId}
            onClick={() => {
              if (!selectedId) return;
              setBlocks((previous) => previous.filter((block) => block.id !== selectedId));
              setWires((previous) =>
                previous.filter((wire) => wire.source !== selectedId && wire.target !== selectedId),
              );
              setSelectedId(null);
            }}
          >
            Delete
          </ToolbarButton>

          <ToolbarButton
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={() => {
              setBlocks(INITIAL_GRAPH.nodes);
              setWires(INITIAL_GRAPH.edges);
              setSelectedId(null);
              setNotice(null);
            }}
          >
            Reset
          </ToolbarButton>
        </Stack>
      }
      canvas={
        <>
          {notice && (
            <Alert severity="warning" onClose={() => setNotice(null)} sx={{ borderRadius: 0 }}>
              {notice}
            </Alert>
          )}
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            isValidConnection={isValidConnection}
            onSelectionChange={setSelectedId}
            onBlockDrop={(type, position) => addBlock(type, position)}
            onNodeMoved={(nodeId, position) =>
              setBlocks((previous) =>
                previous.map((block) => (block.id === nodeId ? { ...block, position } : block)),
              )
            }
          />
        </>
      }
      inspector={
        <BlockInspector
          definition={selectedDefinition}
          style={
            selectedDefinition
              ? styleForCategory(DEFAULT_BLOCK_CATEGORIES, selectedDefinition.category)
              : undefined
          }
          subtitle={selected ? `${selected.type} · ${selected.id}` : undefined}
          onClose={() => setSelectedId(null)}
        >
          {selected && (
            <Stack spacing={2}>
              <TextField
                label="Label"
                size="small"
                fullWidth
                value={selected.subtitle ?? ''}
                onChange={(event) =>
                  setBlocks((previous) =>
                    previous.map((block) =>
                      block.id === selected.id ? { ...block, subtitle: event.target.value } : block,
                    ),
                  )
                }
                helperText="Shown as the node card's second line."
              />
              <Typography variant="body2" color="text.secondary">
                {selectedDefinition?.description}
              </Typography>
              <Typography sx={captionMuted}>
                The kit supplies this panel's frame; the fields inside are the app's, because only
                the app knows a block's parameters.
              </Typography>
            </Stack>
          )}
        </BlockInspector>
      }
    />
  );
}
