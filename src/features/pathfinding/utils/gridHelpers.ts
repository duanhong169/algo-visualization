import type { Grid, Position, CellType } from '../types/grid';
import { CELL_VALUE_MAP, CELL_TYPE_MAP } from '../constants';

/** Create a new empty grid. */
export function createGrid(rows: number, cols: number): Grid {
  return {
    rows,
    cols,
    cells: new Uint8Array(rows * cols),
    start: null,
    end: null,
  };
}

/** Convert position to flat array index. */
export function posToIndex(cols: number, pos: Position): number {
  return pos.row * cols + pos.col;
}

/** Convert flat array index to position. */
export function indexToPos(cols: number, index: number): Position {
  return {
    row: Math.floor(index / cols),
    col: index % cols,
  };
}

/** Get the CellType at a position. */
export function getCell(grid: Grid, pos: Position): CellType {
  const index = posToIndex(grid.cols, pos);
  return CELL_TYPE_MAP[grid.cells[index]!] ?? 'empty';
}

/** Set a cell value, returning a new Grid (immutable). */
export function setCell(grid: Grid, pos: Position, type: CellType): Grid {
  const newCells = grid.cells.slice();
  newCells[posToIndex(grid.cols, pos)] = CELL_VALUE_MAP[type];
  return { ...grid, cells: newCells };
}

/** Clone a grid (cheap Uint8Array copy). */
export function cloneGrid(grid: Grid): Grid {
  return {
    ...grid,
    cells: grid.cells.slice(),
    start: grid.start ? { ...grid.start } : null,
    end: grid.end ? { ...grid.end } : null,
  };
}

/** Check if position is within grid bounds. */
export function isInBounds(grid: Grid, pos: Position): boolean {
  return pos.row >= 0 && pos.row < grid.rows && pos.col >= 0 && pos.col < grid.cols;
}

/** Check if position is walkable (not a wall). */
export function isWalkable(grid: Grid, pos: Position): boolean {
  return isInBounds(grid, pos) && getCell(grid, pos) !== 'wall';
}

/** 4-directional neighbors (up, right, down, left). */
const DIRECTIONS_4: readonly Position[] = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
];

/** 8-directional neighbors (includes diagonals). */
const DIRECTIONS_8: readonly Position[] = [
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: -1 },
];

/** Get walkable 4-directional neighbors. */
export function getNeighbors4(grid: Grid, pos: Position): Position[] {
  const neighbors: Position[] = [];
  for (const dir of DIRECTIONS_4) {
    const next: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isWalkable(grid, next)) {
      neighbors.push(next);
    }
  }
  return neighbors;
}

/**
 * Get walkable 8-directional neighbors.
 * Diagonal movement requires both adjacent cardinal cells to be walkable
 * (prevents cutting through wall corners).
 */
export function getNeighbors8(grid: Grid, pos: Position): Position[] {
  const neighbors: Position[] = [];
  for (const dir of DIRECTIONS_8) {
    const next: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (!isWalkable(grid, next)) continue;

    // For diagonals, check that both adjacent cardinal cells are walkable
    const isDiagonal = dir.row !== 0 && dir.col !== 0;
    if (isDiagonal) {
      const adj1: Position = { row: pos.row + dir.row, col: pos.col };
      const adj2: Position = { row: pos.row, col: pos.col + dir.col };
      if (!isWalkable(grid, adj1) || !isWalkable(grid, adj2)) continue;
    }

    neighbors.push(next);
  }
  return neighbors;
}

/** Create a position key string for Map/Set usage. */
export function posKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

/** Check if two positions are equal. */
export function posEquals(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}
