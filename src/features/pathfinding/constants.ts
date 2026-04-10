import type { CellType, CellVisualState, SpeedPreset } from './types/grid';

/** CellType -> Uint8 value mapping. */
export const CELL_VALUE_MAP: Record<CellType, number> = {
  empty: 0,
  wall: 1,
  start: 2,
  end: 3,
} as const;

/** Uint8 value -> CellType mapping. */
export const CELL_TYPE_MAP: Record<number, CellType> = {
  0: 'empty',
  1: 'wall',
  2: 'start',
  3: 'end',
};

/** Canvas colors for each cell type — light/dark variants. */
export const CELL_TYPE_COLORS: Record<CellType, { light: string; dark: string }> = {
  empty: { light: '#FFFFFF', dark: '#161B22' },
  wall: { light: '#1F2328', dark: '#C9D1D9' },
  start: { light: '#1A7F37', dark: '#3FB950' },
  end: { light: '#CF222E', dark: '#F85149' },
};

/** Canvas colors for visual state overlay during visualization. */
export const VISUAL_STATE_COLORS: Record<CellVisualState, { light: string; dark: string }> = {
  idle: { light: '#FFFFFF', dark: '#161B22' },
  open: { light: '#DAFBE1', dark: '#0D4429' },
  closed: { light: '#DDF4FF', dark: '#0C2D6B' },
  visiting: { light: '#FBEFB6', dark: '#5C4813' },
  path: { light: '#FD8C73', dark: '#F85149' },
};

/** Grid line color. */
export const GRID_LINE_COLOR = { light: '#E1E4E8', dark: '#21262D' };

/** Speed presets — ms per step. */
export const SPEED_MS: Record<SpeedPreset, number> = {
  slow: 100,
  medium: 30,
  fast: 5,
  instant: 0,
};

export const DEFAULT_GRID_ROWS = 35;
export const DEFAULT_GRID_COLS = 55;

/** Grid size presets — 5 levels, level 3 is the default. */
export const GRID_LEVELS = [
  { level: 1, label: '1 (15×25)', rows: 15, cols: 25 },
  { level: 2, label: '2 (25×40)', rows: 25, cols: 40 },
  { level: 3, label: '3 (35×55)', rows: 35, cols: 55 },
  { level: 4, label: '4 (55×90)', rows: 55, cols: 90 },
  { level: 5, label: '5 (80×130)', rows: 80, cols: 130 },
] as const;

export const DEFAULT_GRID_LEVEL = 3;
