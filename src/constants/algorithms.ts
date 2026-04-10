import type { AlgorithmInfo } from '@/types/algorithm';

/**
 * Single source of truth for all algorithms in the app.
 * The home page reads this to render category cards.
 * New categories (sorting, tree) just add entries here.
 */
export const ALGORITHM_CATALOG: AlgorithmInfo[] = [
  {
    id: 'a-star',
    name: 'A* Search',
    category: 'pathfinding',
    description: 'Optimal pathfinding using heuristic + cost. Used in game NavMesh navigation.',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    path: '/pathfinding/a-star',
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'pathfinding',
    description: 'Explores all neighbors before going deeper. Guarantees shortest unweighted path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    path: '/pathfinding/bfs',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'pathfinding',
    description: 'Explores as far as possible before backtracking. Does NOT guarantee shortest path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    path: '/pathfinding/dfs',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'pathfinding',
    description: 'Weighted shortest path using priority queue. Guarantees optimal path on weighted graphs.',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    path: '/pathfinding/dijkstra',
  },
];

/** Group algorithms by category for display. */
export function getAlgorithmsByCategory() {
  const grouped = new Map<string, AlgorithmInfo[]>();
  for (const algo of ALGORITHM_CATALOG) {
    const list = grouped.get(algo.category) ?? [];
    list.push(algo);
    grouped.set(algo.category, list);
  }
  return grouped;
}
