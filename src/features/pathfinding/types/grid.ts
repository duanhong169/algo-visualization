/** What a single cell can be. */
export type CellType = 'empty' | 'wall' | 'start' | 'end';

/** Visual state overlaid during visualization (not persisted to grid). */
export type CellVisualState = 'idle' | 'open' | 'closed' | 'visiting' | 'path';

/** Coordinate — row, col. */
export interface Position {
  row: number;
  col: number;
}

/**
 * The grid is a flat Uint8Array for performance on large grids.
 * Index = row * cols + col. Values map to CellType via CELL_VALUE_MAP.
 *
 * Why Uint8Array:
 * - 100x100 grid = 10,000 bytes vs ~240KB for object array
 * - Cache-friendly sequential access for Canvas rendering
 * - Cheap to snapshot (slice()) for step history
 */
export interface Grid {
  readonly rows: number;
  readonly cols: number;
  readonly cells: Uint8Array;
  start: Position | null;
  end: Position | null;
}

/** One snapshot of algorithm state at a single iteration. */
export interface AlgorithmStep {
  /** Cells in the open set / frontier after this iteration. */
  openSet: Position[];
  /** Cells in the closed set after this iteration. */
  closedSet: Position[];
  /** The cell being evaluated in this iteration. */
  current: Position;
  /** Current best path from start to `current`. */
  currentPath: Position[];
  /** If algorithm is done, the final path. undefined while running. */
  finalPath?: Position[];
}

/** Result returned by every pathfinding algorithm. */
export interface AlgorithmResult {
  steps: AlgorithmStep[];
  finalPath: Position[];
  isPathFound: boolean;
  totalVisited: number;
}

/** The contract every pathfinding algorithm must implement. */
export type PathfindingAlgorithm = (grid: Grid) => AlgorithmResult;

/** Playback state for the visualization controller. */
export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'finished';

/** Speed presets in ms per step. */
export type SpeedPreset = 'slow' | 'medium' | 'fast' | 'instant';

/** Editor tool types. */
export type EditorTool = 'wall' | 'eraser' | 'start' | 'end';
