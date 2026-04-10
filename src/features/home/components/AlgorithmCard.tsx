import { Link } from 'react-router-dom';

import type { AlgorithmInfo } from '@/types/algorithm';

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  return (
    <Link
      to={algorithm.path}
      className="group rounded-md border border-border bg-surface p-4 transition-colors hover:border-primary"
    >
      <h3 className="text-sm font-semibold text-text group-hover:text-primary">
        {algorithm.name}
      </h3>
      <p className="mt-1 text-sm text-text-muted">{algorithm.description}</p>
      <div className="mt-3 flex gap-3 text-xs text-text-muted">
        <span>Time: {algorithm.timeComplexity}</span>
        <span>Space: {algorithm.spaceComplexity}</span>
      </div>
    </Link>
  );
}
