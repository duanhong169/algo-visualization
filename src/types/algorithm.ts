/** Every algorithm category the app supports. Add new ones here. */
export type AlgorithmCategory = 'pathfinding' | 'sorting' | 'tree' | 'graph';

/** Metadata for one algorithm, used by the home page and routing. */
export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  path: string;
}
