import { useRef, useCallback, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import type { Grid, Position, CellVisualState } from '../types/grid';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

interface GridCanvasProps {
  grid: Grid;
  visualOverlay: Map<string, CellVisualState>;
  onCellClick: (pos: Position) => void;
  onCellDrag: (pos: Position) => void;
  className?: string;
}

/**
 * Canvas-based grid renderer.
 * Auto-fits grid to container. No zoom/pan — grid always fills the view.
 */
export function GridCanvas({
  grid,
  visualOverlay,
  onCellClick,
  onCellDrag,
  className,
}: GridCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(18);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isDrawingRef = useRef(false);

  // Detect dark mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-fit grid to container on mount, resize, and grid size change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fitGrid = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const fitCellW = Math.floor(width / grid.cols);
      const fitCellH = Math.floor(height / grid.rows);
      const fitCell = Math.max(2, Math.min(40, Math.min(fitCellW, fitCellH)));
      setCellSize(fitCell);

      // Center the grid
      const gridW = grid.cols * fitCell;
      const gridH = grid.rows * fitCell;
      setOffset({
        x: Math.max(0, (width - gridW) / 2),
        y: Math.max(0, (height - gridH) / 2),
      });
    };

    const observer = new ResizeObserver(() => fitGrid());
    observer.observe(container);

    return () => observer.disconnect();
  }, [grid.rows, grid.cols]);

  const { canvasRef } = useCanvasRenderer({
    grid,
    visualOverlay,
    cellSize,
    offset,
    isDarkMode,
  });

  /** Convert mouse client coordinates to grid position. */
  const clientToGrid = useCallback(
    (clientX: number, clientY: number): Position | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - offset.x;
      const y = clientY - rect.top - offset.y;

      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return null;
      return { row, col };
    },
    [canvasRef, offset, cellSize, grid.rows, grid.cols],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Left click only
      isDrawingRef.current = true;
      const pos = clientToGrid(e.clientX, e.clientY);
      if (pos) onCellClick(pos);
    },
    [clientToGrid, onCellClick],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawingRef.current) return;
      const pos = clientToGrid(e.clientX, e.clientY);
      if (pos) onCellDrag(pos);
    },
    [clientToGrid, onCellDrag],
  );

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-md border border-border bg-surface', className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
