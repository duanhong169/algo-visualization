import type { Grid, AlgorithmResult, AlgorithmStep, Position } from '../types/grid';
import { getNeighbors4, posToIndex } from '../utils/gridHelpers';

/**
 * Depth-First Search — explores as deep as possible before backtracking.
 * Does NOT guarantee shortest path.
 * Uses a stack (LIFO) for frontier exploration.
 */
export function dfs(grid: Grid): AlgorithmResult {
  if (!grid.start || !grid.end) {
    return { steps: [], finalPath: [], isPathFound: false, totalVisited: 0 };
  }

  const start = grid.start;
  const end = grid.end;
  const steps: AlgorithmStep[] = [];

  const endIdx = posToIndex(grid.cols, end);
  const cameFrom = new Map<number, number>();
  const visited = new Set<number>();

  const startIdx = posToIndex(grid.cols, start);
  const stack: number[] = [startIdx];
  const openSet = new Set<number>([startIdx]);

  while (stack.length > 0) {
    const currentIdx = stack.pop()!;
    openSet.delete(currentIdx);

    if (visited.has(currentIdx)) continue;
    visited.add(currentIdx);

    const currentPos = indexToPos(grid.cols, currentIdx);

    // Record step
    const neighborCount = getNeighbors4(grid, currentPos).length;
    const isFinal = currentIdx === endIdx;
    steps.push({
      openSet: setToPositions(openSet, grid.cols),
      closedSet: setToPositions(visited, grid.cols),
      current: currentPos,
      currentPath: reconstructPath(cameFrom, currentIdx, grid.cols),
      finalPath: isFinal
        ? reconstructPath(cameFrom, currentIdx, grid.cols)
        : undefined,
      description: isFinal
        ? `到达终点 (${currentPos.row},${currentPos.col})！找到路径长度 ${reconstructPath(cameFrom, currentIdx, grid.cols).length} 步。注意：DFS 不保证这是最短路径。`
        : `从栈顶弹出节点 (${currentPos.row},${currentPos.col})，深度 ${reconstructPath(cameFrom, currentIdx, grid.cols).length - 1}。将其 ${neighborCount} 个未访问邻居压入栈。栈中还有 ${openSet.size} 个节点。`,
    });

    // Found the end
    if (currentIdx === endIdx) {
      const finalPath = reconstructPath(cameFrom, currentIdx, grid.cols);
      return {
        steps,
        finalPath,
        isPathFound: true,
        totalVisited: visited.size,
      };
    }

    // Explore neighbors (reverse order so first neighbor is processed next)
    const neighbors = getNeighbors4(grid, currentPos);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i]!;
      const neighborIdx = posToIndex(grid.cols, neighbor);
      if (visited.has(neighborIdx)) continue;

      cameFrom.set(neighborIdx, currentIdx);
      stack.push(neighborIdx);
      openSet.add(neighborIdx);
    }
  }

  return {
    steps,
    finalPath: [],
    isPathFound: false,
    totalVisited: visited.size,
  };
}

function indexToPos(cols: number, index: number): Position {
  return { row: Math.floor(index / cols), col: index % cols };
}

function setToPositions(set: Set<number>, cols: number): Position[] {
  return Array.from(set).map((idx) => indexToPos(cols, idx));
}

function reconstructPath(cameFrom: Map<number, number>, current: number, cols: number): Position[] {
  const path: Position[] = [indexToPos(cols, current)];
  let node = current;
  while (cameFrom.has(node)) {
    node = cameFrom.get(node)!;
    path.unshift(indexToPos(cols, node));
  }
  return path;
}
