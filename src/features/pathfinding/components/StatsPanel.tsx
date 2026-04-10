import { Tooltip } from '@/components/ui';

import type { AlgorithmStep } from '../types/grid';
import { ALGORITHM_EDUCATION } from '../constants/algorithmEducation';

interface StatsPanelProps {
  step: AlgorithmStep | null;
  isPathFound: boolean | null;
  totalVisited: number;
  algorithmId: string;
}

export function StatsPanel({ step, isPathFound, totalVisited, algorithmId }: StatsPanelProps) {
  if (!step) return null;

  const openCount = step.openSet.length;
  const closedCount = step.closedSet.length;
  const pathLength = step.finalPath?.length ?? step.currentPath.length;
  const tips = ALGORITHM_EDUCATION[algorithmId]?.tooltips;

  return (
    <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-muted">
      <Tooltip text={tips?.openSet ?? '待探索的节点集合'}>
        <span>
          Open: <span className="font-medium text-text">{openCount}</span>
          <span className="ml-0.5 text-text-muted/60">ⓘ</span>
        </span>
      </Tooltip>

      <Tooltip text={tips?.closedSet ?? '已完成评估的节点集合'}>
        <span>
          Closed: <span className="font-medium text-text">{closedCount}</span>
          <span className="ml-0.5 text-text-muted/60">ⓘ</span>
        </span>
      </Tooltip>

      <Tooltip text={tips?.path ?? '从起点到当前节点的路径长度'}>
        <span>
          Path: <span className="font-medium text-text">{pathLength}</span>
          <span className="ml-0.5 text-text-muted/60">ⓘ</span>
        </span>
      </Tooltip>

      <Tooltip text={tips?.totalVisited ?? '算法总共评估过的节点数量'}>
        <span>
          Total Visited: <span className="font-medium text-text">{totalVisited}</span>
          <span className="ml-0.5 text-text-muted/60">ⓘ</span>
        </span>
      </Tooltip>

      {isPathFound !== null && (
        <span className={isPathFound ? 'text-success' : 'text-danger'}>
          {isPathFound ? '✓ Path found' : '✗ No path'}
        </span>
      )}
    </div>
  );
}
