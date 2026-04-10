import { useRef, useCallback, useEffect } from 'react';

import type { Grid, Position, CellVisualState } from '../types/grid';
import {
  CELL_TYPE_COLORS,
  VISUAL_STATE_COLORS,
  GRID_LINE_COLOR,
  CELL_TYPE_MAP,
} from '../constants';

interface UseCanvasRendererOptions {
  grid: Grid;
  visualOverlay: Map<string, CellVisualState>;
  cellSize: number;
  offset: { x: number; y: number };
  isDarkMode: boolean;
}

/**
 * Manages <canvas> drawing for the pathfinding grid.
 * Uses viewport culling and batched draws for performance on large grids.
 */
export function useCanvasRenderer({
  grid,
  visualOverlay,
  cellSize,
  offset,
  isDarkMode,
}: UseCanvasRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const theme = isDarkMode ? 'dark' : 'light';

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Set canvas size with device pixel ratio for sharp rendering
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Calculate visible cell range (viewport culling)
    const startCol = Math.max(0, Math.floor(-offset.x / cellSize));
    const startRow = Math.max(0, Math.floor(-offset.y / cellSize));
    const endCol = Math.min(grid.cols, Math.ceil((width - offset.x) / cellSize));
    const endRow = Math.min(grid.rows, Math.ceil((height - offset.y) / cellSize));

    // Batch cells by color to minimize fillStyle changes
    const colorBuckets = new Map<string, { x: number; y: number }[]>();

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const key = `${row},${col}`;
        const visualState = visualOverlay.get(key);

        let color: string;
        if (visualState && visualState !== 'idle') {
          color = VISUAL_STATE_COLORS[visualState][theme];
        } else {
          const cellValue = grid.cells[row * grid.cols + col];
          const cellType = CELL_TYPE_MAP[cellValue ?? 0] ?? 'empty';
          color = CELL_TYPE_COLORS[cellType][theme];
        }

        const bucket = colorBuckets.get(color) ?? [];
        bucket.push({
          x: col * cellSize + offset.x,
          y: row * cellSize + offset.y,
        });
        colorBuckets.set(color, bucket);
      }
    }

    // Draw cells by color batch
    for (const [color, cells] of colorBuckets) {
      ctx.fillStyle = color;
      for (const cell of cells) {
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
      }
    }

    // Draw grid lines (only if cell size is large enough)
    if (cellSize >= 8) {
      ctx.strokeStyle = GRID_LINE_COLOR[theme];
      ctx.lineWidth = 0.5;
      ctx.beginPath();

      // Vertical lines
      for (let col = startCol; col <= endCol; col++) {
        const x = col * cellSize + offset.x;
        ctx.moveTo(x, startRow * cellSize + offset.y);
        ctx.lineTo(x, endRow * cellSize + offset.y);
      }

      // Horizontal lines
      for (let row = startRow; row <= endRow; row++) {
        const y = row * cellSize + offset.y;
        ctx.moveTo(startCol * cellSize + offset.x, y);
        ctx.lineTo(endCol * cellSize + offset.x, y);
      }

      ctx.stroke();
    }

    // Draw start/end markers (icons on top)
    if (grid.start && isVisible(grid.start)) {
      drawMarker(ctx, grid.start, 'S', CELL_TYPE_COLORS.start[theme]);
    }
    if (grid.end && isVisible(grid.end)) {
      drawMarker(ctx, grid.end, 'E', CELL_TYPE_COLORS.end[theme]);
    }

    function isVisible(pos: Position): boolean {
      return pos.row >= startRow && pos.row < endRow && pos.col >= startCol && pos.col < endCol;
    }

    function drawMarker(c: CanvasRenderingContext2D, pos: Position, label: string, color: string) {
      const x = pos.col * cellSize + offset.x + cellSize / 2;
      const y = pos.row * cellSize + offset.y + cellSize / 2;
      const fontSize = Math.max(10, cellSize * 0.6);

      c.fillStyle = color;
      c.font = `bold ${fontSize}px sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(label, x, y);
    }
  }, [grid, visualOverlay, cellSize, offset, theme]);

  // Redraw on dependency changes using rAF for smooth rendering
  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return { canvasRef };
}
