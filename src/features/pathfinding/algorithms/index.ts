import type { PathfindingAlgorithm } from '../types/grid';
import { aStar } from './aStar';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';

/** Registry: algorithm ID -> implementation. Add new algorithms here. */
export const PATHFINDING_ALGORITHMS: Record<string, PathfindingAlgorithm> = {
  'a-star': aStar,
  bfs,
  dfs,
  dijkstra,
};
