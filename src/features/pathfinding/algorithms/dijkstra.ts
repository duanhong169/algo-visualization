import type { Grid, AlgorithmResult, AlgorithmStep, Position } from '../types/grid';
import { getNeighbors4, posToIndex } from '../utils/gridHelpers';

/**
 * Dijkstra's Algorithm — weighted shortest path using priority queue.
 * On a uniform-cost grid, behaves like BFS but demonstrates priority queue mechanics.
 * Uses 4-directional movement with unit cost.
 */
export function dijkstra(grid: Grid): AlgorithmResult {
  if (!grid.start || !grid.end) {
    return { steps: [], finalPath: [], isPathFound: false, totalVisited: 0 };
  }

  const start = grid.start;
  const end = grid.end;
  const steps: AlgorithmStep[] = [];

  const endIdx = posToIndex(grid.cols, end);
  const cameFrom = new Map<number, number>();
  const dist = new Map<number, number>();
  const visited = new Set<number>();

  const startIdx = posToIndex(grid.cols, start);
  dist.set(startIdx, 0);

  // Simple priority queue (array sorted by distance)
  // For production, use a binary heap — but this is clear and correct
  const openSet: number[] = [startIdx];
  const openSetLookup = new Set<number>([startIdx]);

  while (openSet.length > 0) {
    // Find node with minimum distance
    let minIdx = 0;
    let minDist = dist.get(openSet[0]!) ?? Infinity;
    for (let i = 1; i < openSet.length; i++) {
      const d = dist.get(openSet[i]!) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        minIdx = i;
      }
    }

    const currentIdx = openSet[minIdx]!;
    openSet.splice(minIdx, 1);
    openSetLookup.delete(currentIdx);

    if (visited.has(currentIdx)) continue;
    visited.add(currentIdx);

    const currentPos = indexToPos(grid.cols, currentIdx);

    // Record step
    steps.push({
      openSet: openSet.map((idx) => indexToPos(grid.cols, idx)),
      closedSet: setToPositions(visited, grid.cols),
      current: currentPos,
      currentPath: reconstructPath(cameFrom, currentIdx, grid.cols),
      finalPath: currentIdx === endIdx
        ? reconstructPath(cameFrom, currentIdx, grid.cols)
        : undefined,
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

      const newDist = (dist.get(currentIdx) ?? Infinity) + 1;
      if (newDist < (dist.get(neighborIdx) ?? Infinity)) {
        dist.set(neighborIdx, newDist);
        cameFrom.set(neighborIdx, currentIdx);

        if (!openSetLookup.has(neighborIdx)) {
          openSet.push(neighborIdx);
          openSetLookup.add(neighborIdx);
        }
      }
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
