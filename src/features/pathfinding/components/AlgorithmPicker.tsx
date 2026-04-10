import { useNavigate } from 'react-router-dom';

import { ALGORITHM_CATALOG } from '@/constants/algorithms';

interface AlgorithmPickerProps {
  currentAlgorithmId: string;
  disabled: boolean;
}

export function AlgorithmPicker({ currentAlgorithmId, disabled }: AlgorithmPickerProps) {
  const navigate = useNavigate();
  const pathfindingAlgorithms = ALGORITHM_CATALOG.filter((a) => a.category === 'pathfinding');

  return (
    <select
      value={currentAlgorithmId}
      onChange={(e) => navigate(`/pathfinding/${e.target.value}`)}
      disabled={disabled}
      className="rounded-md border border-border bg-bg px-2 py-1 text-sm text-text disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pathfindingAlgorithms.map((algo) => (
        <option key={algo.id} value={algo.id}>
          {algo.name}
        </option>
      ))}
    </select>
  );
}
