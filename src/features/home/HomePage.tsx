import { getAlgorithmsByCategory } from '@/constants/algorithms';
import type { AlgorithmCategory } from '@/types/algorithm';

import { AlgorithmCard } from './components/AlgorithmCard';

const CATEGORY_LABELS: Record<AlgorithmCategory, string> = {
  pathfinding: 'Pathfinding & Graph Search',
  sorting: 'Sorting',
  tree: 'Tree Traversal',
  graph: 'Graph Algorithms',
};

export function HomePage() {
  const grouped = getAlgorithmsByCategory();

  return (
    <div className="space-y-6 py-6">
      <h1 className="text-xl font-semibold text-text">Algorithm Visualizations</h1>
      {Array.from(grouped.entries()).map(([category, algorithms]) => (
        <section key={category}>
          <h2 className="mb-3 text-base font-semibold text-text">
            {CATEGORY_LABELS[category as AlgorithmCategory] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {algorithms.map((algo) => (
              <AlgorithmCard key={algo.id} algorithm={algo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
