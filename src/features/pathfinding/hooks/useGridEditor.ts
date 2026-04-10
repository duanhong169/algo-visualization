import { useState, useCallback, useRef } from 'react';

import type { Grid, Position, EditorTool } from '../types/grid';
import { createGrid, setCell, getCell, posEquals } from '../utils/gridHelpers';
import { generateRecursiveBacktracker, generateRandomWalls } from '../utils/mazeGenerators';
import { CELL_VALUE_MAP } from '../constants';

export type MazeType = 'recursive-backtracker' | 'random';

interface UseGridEditorReturn {
  grid: Grid;
  activeTool: EditorTool;
  setActiveTool: (tool: EditorTool) => void;
  handleCellClick: (pos: Position) => void;
  handleCellDrag: (pos: Position) => void;
  setGrid: (grid: Grid) => void;
  clearGrid: () => void;
  resetGrid: () => void;
  resizeGrid: (rows: number, cols: number) => void;
  generateMaze: (type: MazeType) => void;
}

function createDefaultGrid(rows: number, cols: number): Grid {
  const g = createGrid(rows, cols);
  const startRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 4);
  const endCol = Math.floor((cols * 3) / 4);

  const cells = g.cells.slice();
  cells[startRow * cols + startCol] = CELL_VALUE_MAP.start;
  cells[startRow * cols + endCol] = CELL_VALUE_MAP.end;

  return {
    ...g,
    cells,
    start: { row: startRow, col: startCol },
    end: { row: startRow, col: endCol },
  };
}

/**
 * Manages the mutable grid state and mouse-based editing.
 * Wall drawing works via click + drag.
 */
export function useGridEditor(initialRows: number, initialCols: number): UseGridEditorReturn {
  const [grid, setGridState] = useState<Grid>(() => createDefaultGrid(initialRows, initialCols));

  const [activeTool, setActiveTool] = useState<EditorTool>('wall');
  const lastDragPosRef = useRef<Position | null>(null);

  const applyTool = useCallback(
    (pos: Position, tool: EditorTool) => {
      setGridState((prev) => {
        const current = getCell(prev, pos);

        switch (tool) {
          case 'wall': {
            if (current === 'start' || current === 'end') return prev;
            if (current === 'wall') return prev;
            return setCell(prev, pos, 'wall');
          }
          case 'eraser': {
            if (current === 'start' || current === 'end') return prev;
            if (current === 'empty') return prev;
            return setCell(prev, pos, 'empty');
          }
          case 'start': {
            let newGrid = prev;
            if (prev.start) {
              newGrid = setCell(newGrid, prev.start, 'empty');
            }
            if (prev.end && posEquals(pos, prev.end)) return prev;
            newGrid = setCell(newGrid, pos, 'start');
            return { ...newGrid, start: pos };
          }
          case 'end': {
            let newGrid = prev;
            if (prev.end) {
              newGrid = setCell(newGrid, prev.end, 'empty');
            }
            if (prev.start && posEquals(pos, prev.start)) return prev;
            newGrid = setCell(newGrid, pos, 'end');
            return { ...newGrid, end: pos };
          }
          default:
            return prev;
        }
      });
    },
    [],
  );

  const handleCellClick = useCallback(
    (pos: Position) => {
      lastDragPosRef.current = pos;
      applyTool(pos, activeTool);
    },
    [activeTool, applyTool],
  );

  const handleCellDrag = useCallback(
    (pos: Position) => {
      if (activeTool !== 'wall' && activeTool !== 'eraser') return;
      if (lastDragPosRef.current && posEquals(pos, lastDragPosRef.current)) return;
      lastDragPosRef.current = pos;
      applyTool(pos, activeTool);
    },
    [activeTool, applyTool],
  );

  const setGrid = useCallback((newGrid: Grid) => {
    setGridState(newGrid);
  }, []);

  const clearGrid = useCallback(() => {
    setGridState((prev) => {
      const g = createGrid(prev.rows, prev.cols);
      if (prev.start) {
        const cells = g.cells;
        cells[prev.start.row * prev.cols + prev.start.col] = CELL_VALUE_MAP.start;
        if (prev.end) {
          cells[prev.end.row * prev.cols + prev.end.col] = CELL_VALUE_MAP.end;
        }
        return { ...g, cells, start: prev.start, end: prev.end };
      }
      return g;
    });
  }, []);

  const resetGrid = useCallback(() => {
    setGridState((prev) => createDefaultGrid(prev.rows, prev.cols));
  }, []);

  const resizeGrid = useCallback((rows: number, cols: number) => {
    setGridState(createDefaultGrid(rows, cols));
  }, []);

  const generateMaze = useCallback((type: MazeType) => {
    setGridState((prev) => {
      const base =
        type === 'recursive-backtracker'
          ? generateRecursiveBacktracker(prev.rows, prev.cols)
          : generateRandomWalls(prev.rows, prev.cols, 0.3);

      // Place start and end on empty cells
      const startPos = findEmptyCell(base, Math.floor(prev.rows / 2), Math.floor(prev.cols / 4));
      const endPos = findEmptyCell(base, Math.floor(prev.rows / 2), Math.floor((prev.cols * 3) / 4));

      const cells = base.cells;
      if (startPos) cells[startPos.row * prev.cols + startPos.col] = CELL_VALUE_MAP.start;
      if (endPos) cells[endPos.row * prev.cols + endPos.col] = CELL_VALUE_MAP.end;

      return { ...base, cells, start: startPos, end: endPos };
    });
  }, []);

  return {
    grid,
    activeTool,
    setActiveTool,
    handleCellClick,
    handleCellDrag,
    setGrid,
    clearGrid,
    resetGrid,
    resizeGrid,
    generateMaze,
  };
}

/** Find an empty cell near a target position by spiraling outward. */
function findEmptyCell(grid: Grid, targetRow: number, targetCol: number): Position | null {
  // Check target first
  if (grid.cells[targetRow * grid.cols + targetCol] === CELL_VALUE_MAP.empty) {
    return { row: targetRow, col: targetCol };
  }

  // Spiral outward
  for (let radius = 1; radius < Math.max(grid.rows, grid.cols); radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue;
        const r = targetRow + dr;
        const c = targetCol + dc;
        if (r < 0 || r >= grid.rows || c < 0 || c >= grid.cols) continue;
        if (grid.cells[r * grid.cols + c] === CELL_VALUE_MAP.empty) {
          return { row: r, col: c };
        }
      }
    }
  }
  return null;
}
