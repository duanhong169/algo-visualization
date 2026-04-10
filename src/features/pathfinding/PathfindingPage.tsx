import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { ALGORITHM_CATALOG } from '@/constants/algorithms';

import { PATHFINDING_ALGORITHMS } from './algorithms';
import { AlgorithmInfoPanel } from './components/AlgorithmInfoPanel';
import { AlgorithmPicker } from './components/AlgorithmPicker';
import { GridCanvas } from './components/GridCanvas';
import { GridLegend } from './components/GridLegend';
import { GridToolbar } from './components/GridToolbar';
import { PlaybackControls } from './components/PlaybackControls';
import { StatsPanel } from './components/StatsPanel';
import { StepExplainer } from './components/StepExplainer';
import { useGridEditor } from './hooks/useGridEditor';
import { useVisualization } from './hooks/useVisualization';
import { DEFAULT_GRID_LEVEL, GRID_LEVELS } from './constants';

import type { CellVisualState, Position } from './types/grid';

/** Build a visual overlay map from the current algorithm step. */
function buildOverlay(
  step: { openSet: Position[]; closedSet: Position[]; current: Position; currentPath: Position[]; finalPath?: Position[] } | null,
): Map<string, CellVisualState> {
  const overlay = new Map<string, CellVisualState>();
  if (!step) return overlay;

  for (const pos of step.closedSet) {
    overlay.set(`${pos.row},${pos.col}`, 'closed');
  }
  for (const pos of step.openSet) {
    overlay.set(`${pos.row},${pos.col}`, 'open');
  }
  const pathToShow = step.finalPath ?? step.currentPath;
  for (const pos of pathToShow) {
    overlay.set(`${pos.row},${pos.col}`, 'path');
  }
  overlay.set(`${step.current.row},${step.current.col}`, 'visiting');

  return overlay;
}

export function PathfindingPage() {
  const { algorithmId = 'a-star' } = useParams<{ algorithmId: string }>();
  const algorithm = ALGORITHM_CATALOG.find((a) => a.id === algorithmId);
  const algorithmFn = PATHFINDING_ALGORITHMS[algorithmId];

  const defaultLevel = GRID_LEVELS.find((l) => l.level === DEFAULT_GRID_LEVEL)!;
  const [gridLevel, setGridLevel] = useState(DEFAULT_GRID_LEVEL);

  const {
    grid,
    activeTool,
    setActiveTool,
    handleCellClick,
    handleCellDrag,
    clearGrid,
    resetGrid,
    resizeGrid,
    generateMaze,
  } = useGridEditor(defaultLevel.rows, defaultLevel.cols);

  const {
    status,
    currentStepIndex,
    currentStep,
    totalSteps,
    speed,
    isPathFound,
    totalVisited,
    load,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpTo,
    reset,
    setSpeed,
  } = useVisualization();

  const visualOverlay = useMemo(() => buildOverlay(currentStep), [currentStep]);

  const isRunning = status === 'playing' || status === 'paused' || status === 'finished';

  const handleRun = useCallback(() => {
    if (!algorithmFn || !grid.start || !grid.end) return;

    if (status === 'paused') {
      play();
      return;
    }

    const result = algorithmFn(grid);
    load(result);
    play();
  }, [algorithmFn, grid, status, load, play]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const handleClearGrid = useCallback(() => {
    reset();
    clearGrid();
  }, [reset, clearGrid]);

  const handleResetGrid = useCallback(() => {
    reset();
    resetGrid();
  }, [reset, resetGrid]);

  const handleGridLevelChange = useCallback(
    (level: number) => {
      const preset = GRID_LEVELS.find((l) => l.level === level);
      if (!preset) return;
      reset();
      setGridLevel(level);
      resizeGrid(preset.rows, preset.cols);
    },
    [reset, resizeGrid],
  );

  const handleGenerateMaze = useCallback(
    (type: 'recursive-backtracker' | 'random') => {
      reset();
      generateMaze(type);
    },
    [reset, generateMaze],
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      switch (e.key) {
        case ' ': {
          e.preventDefault();
          if (status === 'playing') {
            pause();
          } else {
            handleRun();
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          stepForward();
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          stepBackward();
          break;
        }
        case 'r':
        case 'R': {
          if (!e.metaKey && !e.ctrlKey) {
            handleReset();
          }
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, pause, handleRun, stepForward, stepBackward, handleReset]);

  if (!algorithm) {
    return (
      <div className="py-6">
        <p className="text-text-muted">Algorithm not found: {algorithmId}</p>
        <Link to="/" className="mt-2 text-sm text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm text-text-muted hover:text-text">
          ← Back
        </Link>
        <div>
          <h1 className="text-base font-semibold text-text">{algorithm.name}</h1>
          <p className="text-xs text-text-muted">{algorithm.description}</p>
        </div>
      </div>

      {/* Algorithm Picker + Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <AlgorithmPicker currentAlgorithmId={algorithmId} disabled={isRunning} />
        <GridToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onClear={handleClearGrid}
          onReset={handleResetGrid}
          isRunning={isRunning}
          gridLevel={gridLevel}
          onGridLevelChange={handleGridLevelChange}
          onGenerateMaze={handleGenerateMaze}
        />
      </div>

      {/* Color Legend */}
      <GridLegend />

      {/* Canvas Grid */}
      <GridCanvas
        grid={grid}
        visualOverlay={visualOverlay}
        onCellClick={isRunning ? () => {} : handleCellClick}
        onCellDrag={isRunning ? () => {} : handleCellDrag}
        className="h-[calc(100vh-16rem)]"
      />

      {/* Playback Controls + Step Explanation */}
      <div className="rounded-md border border-border bg-surface px-3 py-2">
        <PlaybackControls
          status={status}
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          speed={speed}
          onPlay={handleRun}
          onPause={pause}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onJumpTo={jumpTo}
          onReset={handleReset}
          onSpeedChange={setSpeed}
        />
        <StatsPanel
          step={currentStep}
          isPathFound={isPathFound}
          totalVisited={totalVisited}
          algorithmId={algorithmId}
        />
        <div className="mt-2 border-t border-border pt-2">
          <StepExplainer
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={totalSteps}
            algorithmId={algorithmId}
          />
        </div>
      </div>

      {/* Algorithm Education Panel */}
      <AlgorithmInfoPanel algorithmId={algorithmId} />

      {/* Keyboard shortcut hints */}
      <div className="flex gap-4 text-[11px] text-text-muted">
        <span>Space: Play/Pause</span>
        <span>←→: Step</span>
        <span>R: Reset</span>
      </div>
    </div>
  );
}
