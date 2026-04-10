import type { Grid, AlgorithmResult, AlgorithmStep, Position } from '../types/grid';
import { getNeighbors8, posToIndex } from '../utils/gridHelpers';

/**
 * A* pathfinding with 8-directional movement.
 * Heuristic: Octile distance (accounts for diagonal movement).
 * Returns every iteration as a step for visualization replay.
 */
export function aStar(grid: Grid): AlgorithmResult {
  if (!grid.start || !grid.end) {
    return { steps: [], finalPath: [], isPathFound: false, totalVisited: 0 };
  }

  const start = grid.start;
  const end = grid.end;
  const steps: AlgorithmStep[] = [];

  // g-score: cost from start to node
  const gScore = new Map<number, number>();
  // f-score: g + heuristic
  const fScore = new Map<number, number>();
  // Track where we came from for path reconstruction
  const cameFrom = new Map<number, number>();

  const startIdx = posToIndex(grid.cols, start);
  const endIdx = posToIndex(grid.cols, end);

  gScore.set(startIdx, 0);
  fScore.set(startIdx, octileDistance(start, end));

  // Open set as a binary min-heap
  const openHeap = new MinHeap<number>((a, b) => {
    return (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity);
  });
  openHeap.push(startIdx);

  const openSetLookup = new Set<number>([startIdx]);
  const closedSet = new Set<number>();

  while (openHeap.size() > 0) {
    const currentIdx = openHeap.pop()!;
    openSetLookup.delete(currentIdx);

    const currentPos = indexToPos(grid.cols, currentIdx);

    // Found the end
    if (currentIdx === endIdx) {
      const finalPath = reconstructPath(cameFrom, currentIdx, grid.cols);
      const g = gScore.get(currentIdx) ?? 0;
      steps.push({
        openSet: setToPositions(openSetLookup, grid.cols),
        closedSet: setToPositions(closedSet, grid.cols),
        current: currentPos,
        currentPath: finalPath,
        finalPath,
        description: `到达终点 (${currentPos.row},${currentPos.col})！路径总代价 g=${g.toFixed(1)}，路径长度 ${finalPath.length} 步。搜索完成。`,
      });
      return {
        steps,
        finalPath,
        isPathFound: true,
        totalVisited: closedSet.size,
      };
    }

    closedSet.add(currentIdx);

    // Record step for visualization
    const currentPath = reconstructPath(cameFrom, currentIdx, grid.cols);
    const g = gScore.get(currentIdx) ?? 0;
    const f = fScore.get(currentIdx) ?? 0;
    const h = f - g;
    const neighbors = getNeighbors8(grid, currentPos);

    steps.push({
      openSet: setToPositions(openSetLookup, grid.cols),
      closedSet: setToPositions(closedSet, grid.cols),
      current: currentPos,
      currentPath,
      description: `从 Open Set 取出 f 值最小的节点 (${currentPos.row},${currentPos.col})，f=${f.toFixed(1)} (g=${g.toFixed(1)} + h=${h.toFixed(1)})。将其移入 Closed Set，展开 ${neighbors.length} 个邻居。Open Set 剩余 ${openSetLookup.size} 个节点。`,
    });

    // Explore neighbors
    for (const neighbor of neighbors) {
      const neighborIdx = posToIndex(grid.cols, neighbor);

      if (closedSet.has(neighborIdx)) continue;

      // Diagonal cost is sqrt(2), cardinal cost is 1
      const isDiagonal =
        neighbor.row !== currentPos.row && neighbor.col !== currentPos.col;
      const moveCost = isDiagonal ? Math.SQRT2 : 1;
      const tentativeG = (gScore.get(currentIdx) ?? Infinity) + moveCost;

      if (tentativeG < (gScore.get(neighborIdx) ?? Infinity)) {
        cameFrom.set(neighborIdx, currentIdx);
        gScore.set(neighborIdx, tentativeG);
        fScore.set(neighborIdx, tentativeG + octileDistance(neighbor, end));

        if (!openSetLookup.has(neighborIdx)) {
          openSetLookup.add(neighborIdx);
          openHeap.push(neighborIdx);
        }
      }
    }
  }

  // No path found
  return {
    steps,
    finalPath: [],
    isPathFound: false,
    totalVisited: closedSet.size,
  };
}

/** Octile distance heuristic (admissible for 8-direction with unit cost). */
function octileDistance(a: Position, b: Position): number {
  const dx = Math.abs(a.row - b.row);
  const dy = Math.abs(a.col - b.col);
  return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}

/** Reconstruct path by following cameFrom links back to start. */
function reconstructPath(cameFrom: Map<number, number>, current: number, cols: number): Position[] {
  const path: Position[] = [indexToPos(cols, current)];
  let node = current;
  while (cameFrom.has(node)) {
    node = cameFrom.get(node)!;
    path.unshift(indexToPos(cols, node));
  }
  return path;
}

/** Convert flat index back to Position. */
function indexToPos(cols: number, index: number): Position {
  return { row: Math.floor(index / cols), col: index % cols };
}

/** Convert a Set of flat indices to Position array. */
function setToPositions(set: Set<number>, cols: number): Position[] {
  return Array.from(set).map((idx) => indexToPos(cols, idx));
}

/**
 * Binary min-heap for efficient O(log n) extract-min.
 * Critical for A* performance on large grids.
 */
class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  size(): number {
    return this.heap.length;
  }

  push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.heap[i]!, this.heap[parent]!) >= 0) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent]!, this.heap[i]!];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < length && this.compare(this.heap[left]!, this.heap[smallest]!) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.heap[right]!, this.heap[smallest]!) < 0) {
        smallest = right;
      }
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest]!, this.heap[i]!];
      i = smallest;
    }
  }
}
