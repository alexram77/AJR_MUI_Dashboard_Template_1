/**
 * Layered auto-layout for a directed block graph.
 *
 * Assigns each node an x from its longest path to a root, and a y from its
 * order within that layer. Good enough for a tidy default arrangement; once a
 * user drags a node, the caller should persist that position and pass it
 * through instead.
 *
 * Cycles are tolerated: nodes still reachable when the topological pass runs
 * out are appended to a final layer rather than dropped, so a tangled graph
 * still renders.
 */
import { NODE_HEIGHT, NODE_WIDTH } from './BlockNode';

export interface LayoutEdge {
  source: string;
  target: string;
}

export interface LayoutOptions {
  /** Horizontal gap between layers, added to the node width. */
  columnGap?: number;
  /** Vertical gap between nodes in a layer, added to the node height. */
  rowGap?: number;
}

export type PositionMap = Record<string, { x: number; y: number }>;

export function layoutGraph(
  nodeIds: string[],
  edges: LayoutEdge[],
  { columnGap = 80, rowGap = 34 }: LayoutOptions = {},
): PositionMap {
  const indegree = new Map<string, number>(nodeIds.map((id) => [id, 0]));
  const outgoing = new Map<string, string[]>(nodeIds.map((id) => [id, []]));

  for (const edge of edges) {
    if (!indegree.has(edge.target) || !outgoing.has(edge.source)) continue;
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    outgoing.get(edge.source)!.push(edge.target);
  }

  // Kahn's algorithm, tracking the depth each node is first reached at.
  const depth = new Map<string, number>();
  const queue = nodeIds.filter((id) => (indegree.get(id) ?? 0) === 0);
  for (const id of queue) depth.set(id, 0);

  const remaining = new Map(indegree);
  while (queue.length > 0) {
    const id = queue.shift()!;
    const current = depth.get(id) ?? 0;
    for (const next of outgoing.get(id) ?? []) {
      // Longest path wins, so a node always sits right of every predecessor.
      depth.set(next, Math.max(depth.get(next) ?? 0, current + 1));
      const left = (remaining.get(next) ?? 0) - 1;
      remaining.set(next, left);
      if (left === 0) queue.push(next);
    }
  }

  // Anything left is part of a cycle; park it one layer past the deepest node.
  const maxDepth = Math.max(0, ...depth.values());
  for (const id of nodeIds) {
    if (!depth.has(id)) depth.set(id, maxDepth + 1);
  }

  // Group by layer, preserving input order within each.
  const layers = new Map<number, string[]>();
  for (const id of nodeIds) {
    const level = depth.get(id) ?? 0;
    const list = layers.get(level);
    if (list) list.push(id);
    else layers.set(level, [id]);
  }

  const positions: PositionMap = {};
  for (const [level, ids] of layers) {
    ids.forEach((id, index) => {
      positions[id] = {
        x: level * (NODE_WIDTH + columnGap),
        y: index * (NODE_HEIGHT + rowGap),
      };
    });
  }
  return positions;
}
