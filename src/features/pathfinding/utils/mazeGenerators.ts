import type { Grid } from '../types/grid';
import { createGrid } from './gridHelpers';
import { CELL_VALUE_MAP } from '../constants';

/**
 * Recursive backtracker maze generation.
 * Generates a perfect maze where every cell is reachable.
 * Works by carving passages through a grid that starts fully walled.
 */
export function generateRecursiveBacktracker(rows: number, cols: number): Grid {
  // Start with all walls
  const cells = new Uint8Array(rows * cols).fill(CELL_VALUE_MAP.wall);

  // Only odd cells are passages; ensure we work on odd dimensions
  const visitRows = Math.floor((rows - 1) / 2);
  const visitCols = Math.floor((cols - 1) / 2);

  const visited = new Uint8Array(visitRows * visitCols);
  const stack: number[] = [];

  // Start from (0, 0) in visit-space → (1, 1) in grid-space
  const startVisitIdx = 0;
  visited[startVisitIdx] = 1;
  stack.push(startVisitIdx);
  cells[1 * cols + 1] = CELL_VALUE_MAP.empty;

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;

  while (stack.length > 0) {
    const currentIdx = stack[stack.length - 1]!;
    const cr = Math.floor(currentIdx / visitCols);
    const cc = currentIdx % visitCols;

    // Find unvisited neighbors
    const unvisited: number[] = [];
    for (const [dr, dc] of directions) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (nr < 0 || nr >= visitRows || nc < 0 || nc >= visitCols) continue;
      const nIdx = nr * visitCols + nc;
      if (!visited[nIdx]) {
        unvisited.push(nIdx);
      }
    }

    if (unvisited.length === 0) {
      stack.pop();
      continue;
    }

    // Pick a random unvisited neighbor
    const nextIdx = unvisited[Math.floor(Math.random() * unvisited.length)]!;
    const nr = Math.floor(nextIdx / visitCols);
    const nc = nextIdx % visitCols;

    // Carve passage: the neighbor cell and the wall between
    const gridRow = nr * 2 + 1;
    const gridCol = nc * 2 + 1;
    const wallRow = cr * 2 + 1 + (nr - cr);
    const wallCol = cc * 2 + 1 + (nc - cc);

    cells[gridRow * cols + gridCol] = CELL_VALUE_MAP.empty;
    cells[wallRow * cols + wallCol] = CELL_VALUE_MAP.empty;

    visited[nextIdx] = 1;
    stack.push(nextIdx);
  }

  return { rows, cols, cells, start: null, end: null };
}

/**
 * Random wall scatter — places walls at a given density.
 * Simple and fast, produces open maps with random obstacles.
 */
export function generateRandomWalls(rows: number, cols: number, density = 0.3): Grid {
  const grid = createGrid(rows, cols);
  const cells = grid.cells;

  for (let i = 0; i < cells.length; i++) {
    if (Math.random() < density) {
      cells[i] = CELL_VALUE_MAP.wall;
    }
  }

  return { ...grid, cells };
}
