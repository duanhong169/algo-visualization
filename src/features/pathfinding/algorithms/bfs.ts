import type { Grid, AlgorithmResult, AlgorithmStep, Position } from '../types/grid';
import { getNeighbors4, posToIndex } from '../utils/gridHelpers';

/**
 * Breadth-First Search — unweighted shortest path, 4-directional.
 * Guarantees shortest path on unweighted grids.
 * Uses a queue (FIFO) for frontier exploration.
 */
export function bfs(grid: Grid): AlgorithmResult {
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
  visited.add(startIdx);

  const queue: number[] = [startIdx];
  // Track open set for visualization
  const openSet = new Set<number>([startIdx]);

  while (queue.length > 0) {
    const currentIdx = queue.shift()!;
    openSet.delete(currentIdx);
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
        ? `到达终点 (${currentPos.row},${currentPos.col})！BFS 保证这是最短路径，长度 ${reconstructPath(cameFrom, currentIdx, grid.cols).length} 步。`
        : `从队列头部取出节点 (${currentPos.row},${currentPos.col})，距起点 ${reconstructPath(cameFrom, currentIdx, grid.cols).length - 1} 步。检查其 ${neighborCount} 个邻居，将未访问的加入队列尾部。队列中还有 ${openSet.size} 个待处理节点。`,
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

    // Explore neighbors
    const neighbors = getNeighbors4(grid, currentPos);
    for (const neighbor of neighbors) {
      const neighborIdx = posToIndex(grid.cols, neighbor);
      if (visited.has(neighborIdx)) continue;

      visited.add(neighborIdx);
      cameFrom.set(neighborIdx, currentIdx);
      queue.push(neighborIdx);
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
