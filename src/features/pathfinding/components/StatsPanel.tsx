import type { AlgorithmStep } from '../types/grid';

interface StatsPanelProps {
  step: AlgorithmStep | null;

  isPathFound: boolean | null;
  totalVisited: number;
}

export function StatsPanel({ step, isPathFound, totalVisited }: StatsPanelProps) {
  if (!step) return null;

  const openCount = step.openSet.length;
  const closedCount = step.closedSet.length;
  const pathLength = step.finalPath?.length ?? step.currentPath.length;

  return (
    <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-muted">
      <span>
        Open: <span className="font-medium text-text">{openCount}</span>
      </span>
      <span>
        Closed: <span className="font-medium text-text">{closedCount}</span>
      </span>
      <span>
        Path: <span className="font-medium text-text">{pathLength}</span>
      </span>
      <span>
        Total Visited: <span className="font-medium text-text">{totalVisited}</span>
      </span>
      {isPathFound !== null && (
        <span className={isPathFound ? 'text-success' : 'text-danger'}>
          {isPathFound ? '✓ Path found' : '✗ No path'}
        </span>
      )}
    </div>
  );
}
