/**
 * Algorithm education data — detailed explanations for each algorithm.
 * Used by AlgorithmInfo panel and StatsPanel tooltips.
 */

export interface AlgorithmEducation {
  /** One-line core idea. */
  coreConcept: string;
  /** Key terms explained. */
  keyTerms: { term: string; definition: string }[];
  /** Step-by-step workflow. */
  workflow: string[];
  /** Characteristics. */
  characteristics: { label: string; value: string }[];
  /** When to use. */
  useCases: string[];
  /** Tooltip text for stats panel metrics (algorithm-specific). */
  tooltips: {
    openSet: string;
    closedSet: string;
    path: string;
    totalVisited: string;
  };
}

export const ALGORITHM_EDUCATION: Record<string, AlgorithmEducation> = {
  'a-star': {
    coreConcept:
      'A* 结合了实际代价 g(n) 和启发式估计 h(n)，以 f(n) = g(n) + h(n) 为优先级探索节点，在保证最优解的同时大幅减少搜索范围。',
    keyTerms: [
      {
        term: 'g(n) — 实际代价',
        definition: '从起点到节点 n 的实际路径代价。每移动一格，直线方向 +1，对角线方向 +√2≈1.41。',
      },
      {
        term: 'h(n) — 启发式估计',
        definition:
          '从节点 n 到终点的预估代价。本实现使用 Octile 距离（考虑对角线移动的精确下界），确保不会高估真实距离。',
      },
      {
        term: 'f(n) — 综合评估值',
        definition: 'f(n) = g(n) + h(n)。Open Set 中 f 值最小的节点会被优先探索，这就是 A* "聪明"的关键。',
      },
      {
        term: 'Open Set（开放集）',
        definition: '已发现但尚未评估的节点集合，用最小堆按 f 值排序。每一步从中取出 f 值最小的节点。',
      },
      {
        term: 'Closed Set（关闭集）',
        definition: '已完成评估的节点集合。进入 Closed Set 的节点不会被重复评估，避免无限循环。',
      },
    ],
    workflow: [
      '将起点加入 Open Set，设 g=0，f=h(起点)',
      '从 Open Set 取出 f 值最小的节点作为当前节点',
      '如果当前节点是终点 → 回溯路径，算法结束',
      '将当前节点移入 Closed Set',
      '遍历当前节点的 8 个邻居（含对角线）',
      '对每个邻居计算 tentative_g = 当前节点的 g + 移动代价',
      '如果 tentative_g < 邻居已知的 g → 更新邻居的 g、f 值，记录父节点',
      '如果邻居不在 Open Set 中 → 加入 Open Set',
      '重复步骤 2，直到找到终点或 Open Set 为空（无路径）',
    ],
    characteristics: [
      { label: '最优性', value: '保证找到最短路径。前提是 h(n) 估计值不超过实际距离（本实现使用的 Octile 距离满足此条件）' },
      { label: '完备性', value: '只要路径存在就一定能找到' },
      { label: '时间复杂度', value: 'O(E log V)，E 为边数，V 为节点数' },
      { label: '空间复杂度', value: 'O(V)，需要存储所有已发现的节点' },
      { label: '移动方向', value: '8 方向（含对角线），对角线代价 √2' },
    ],
    useCases: [
      '游戏中的 NPC 寻路和 NavMesh 导航',
      '地图应用的路径规划',
      '机器人运动规划',
      '任何需要最优路径的加权图搜索场景',
    ],
    tooltips: {
      openSet: '待探索节点集合（按 f=g+h 排序的最小堆）。A* 每步从中取出 f 值最小的节点评估。',
      closedSet: '已完成评估的节点。这些节点已找到最优路径，不再重复访问。',
      path: '从起点到当前节点的路径长度。最终显示起点到终点的完整最短路径。',
      totalVisited: '算法总共评估过的节点数。A* 通过启发函数引导搜索方向，通常远少于 BFS/Dijkstra。',
    },
  },

  bfs: {
    coreConcept:
      'BFS 逐层向外扩展搜索范围，像水波纹一样均匀扩散。由于每层代价相同，第一次到达终点时的路径一定是最短的。',
    keyTerms: [
      {
        term: 'Queue（队列）',
        definition: 'BFS 使用 FIFO（先进先出）队列。最早发现的节点最先被探索，保证逐层扩展。',
      },
      {
        term: 'Open Set（待探索集）',
        definition: '队列中等待被处理的节点。BFS 的 Open Set 始终包含当前层和下一层的边界节点。',
      },
      {
        term: 'Closed Set（已访问集）',
        definition: '所有已经从队列中取出并处理过的节点。标记为已访问可防止重复探索。',
      },
      {
        term: '层（Level）',
        definition: '距离起点相同步数的所有节点构成一层。BFS 按层序遍历，确保距离递增。',
      },
    ],
    workflow: [
      '将起点加入队列，标记为已访问',
      '从队列头部取出一个节点作为当前节点',
      '如果当前节点是终点 → 回溯路径，算法结束',
      '遍历当前节点的 4 个邻居（上下左右）',
      '对每个未访问的邻居：标记为已访问，记录父节点，加入队列尾部',
      '重复步骤 2，直到找到终点或队列为空（无路径）',
    ],
    characteristics: [
      { label: '最优性', value: '在无权图（所有边权重相同）上保证最短路径' },
      { label: '完备性', value: '如果存在路径一定能找到' },
      { label: '时间复杂度', value: 'O(V + E)' },
      { label: '空间复杂度', value: 'O(V)，需要存储整个搜索层' },
      { label: '移动方向', value: '4 方向（上下左右）' },
    ],
    useCases: [
      '无权图的最短路径搜索',
      '社交网络中的"最短关系链"',
      '迷宫求解（保证最短路径）',
      '网络爬虫的广度优先抓取策略',
    ],
    tooltips: {
      openSet: '队列中等待处理的节点。BFS 按 FIFO 顺序处理，确保逐层扩展。',
      closedSet: '已经从队列中取出并处理过的节点，不会被重复访问。',
      path: '从起点到当前节点的最短步数。BFS 保证第一次到达时就是最短距离。',
      totalVisited: '算法总共处理过的节点数。BFS 均匀扩展，搜索范围通常较大。',
    },
  },

  dfs: {
    coreConcept:
      'DFS 沿一个方向尽可能深入探索，直到走不通才回溯尝试其他方向。它能快速到达远处节点，但不保证找到最短路径。',
    keyTerms: [
      {
        term: 'Stack（栈）',
        definition: 'DFS 使用 LIFO（后进先出）栈。最后发现的节点最先被探索，导致"一路走到底"的行为。',
      },
      {
        term: '回溯（Backtracking）',
        definition: '当前路径走不通（死胡同或所有邻居已访问）时，退回上一个分叉点，尝试其他方向。',
      },
      {
        term: 'Open Set（待探索集）',
        definition: '栈中等待被处理的节点。DFS 的栈可能很深，包含一整条路径上的待探索分支。',
      },
      {
        term: 'Closed Set（已访问集）',
        definition: '所有已经弹出栈并处理过的节点。',
      },
    ],
    workflow: [
      '将起点压入栈',
      '从栈顶弹出一个节点作为当前节点',
      '如果已访问过 → 跳过，回到步骤 2',
      '标记为已访问',
      '如果当前节点是终点 → 回溯路径，算法结束',
      '将当前节点的未访问邻居全部压入栈',
      '重复步骤 2，直到找到终点或栈为空（无路径）',
    ],
    characteristics: [
      { label: '最优性', value: '不保证最短路径！找到的路径取决于探索顺序' },
      { label: '完备性', value: '在有限图中，如果存在路径一定能找到' },
      { label: '时间复杂度', value: 'O(V + E)' },
      { label: '空间复杂度', value: 'O(V)，但实际栈深度通常远小于 BFS 的队列' },
      { label: '移动方向', value: '4 方向（上下左右）' },
    ],
    useCases: [
      '迷宫生成（随机 DFS）',
      '拓扑排序',
      '检测图中的环',
      '内存受限时的图搜索（栈深度通常小于 BFS 队列宽度）',
    ],
    tooltips: {
      openSet: '栈中等待处理的节点。DFS 从栈顶取节点，导致"深度优先"的探索行为。',
      closedSet: '已经弹出栈并处理过的节点。注意 DFS 的访问顺序与 BFS 完全不同。',
      path: '从起点到当前节点的路径长度。注意：DFS 找到的路径通常不是最短的！',
      totalVisited: '算法总共处理过的节点数。DFS 可能很快到达终点，也可能绕很大的弯路。',
    },
  },

  dijkstra: {
    coreConcept:
      'Dijkstra 算法按距离从近到远逐步确定每个节点的最短距离。它像 BFS 的加权版本，使用优先队列确保每次处理距离最小的节点。',
    keyTerms: [
      {
        term: '距离值 dist(n)',
        definition: '从起点到节点 n 当前已知的最短距离。初始时起点为 0，其余为 ∞。随算法运行逐步更新。',
      },
      {
        term: 'Priority Queue（优先队列）',
        definition: 'Dijkstra 用优先队列按 dist 值排序。每步取出 dist 最小的节点，保证贪心策略的正确性。',
      },
      {
        term: '松弛（Relaxation）',
        definition:
          '检查是否通过当前节点到达邻居的路径更短。如果 dist(当前) + 边权 < dist(邻居)，则更新邻居的距离值。',
      },
      {
        term: 'Open Set（待处理集）',
        definition: '优先队列中的节点，按照当前已知最短距离排序。',
      },
      {
        term: 'Closed Set（已确定集）',
        definition: '已经从优先队列中取出的节点。它们的最短距离已经确定，不会再被更新。',
      },
    ],
    workflow: [
      '设起点距离为 0，所有其他节点距离为 ∞',
      '将起点加入优先队列',
      '从优先队列取出距离最小的节点作为当前节点',
      '如果当前节点是终点 → 回溯路径，算法结束',
      '标记当前节点为已确定',
      '遍历当前节点的 4 个邻居',
      '对每个邻居执行松弛：如果 dist(当前) + 1 < dist(邻居) → 更新距离，加入队列',
      '重复步骤 3，直到找到终点或队列为空（无路径）',
    ],
    characteristics: [
      { label: '最优性', value: '保证找到最短路径（要求边权非负）' },
      { label: '完备性', value: '如果存在路径一定能找到' },
      { label: '时间复杂度', value: 'O(E log V)，使用二叉堆优化' },
      { label: '空间复杂度', value: 'O(V)' },
      { label: '移动方向', value: '4 方向（上下左右），每步代价为 1' },
    ],
    useCases: [
      '加权图中的最短路径（如道路网络）',
      '网络路由协议（OSPF）',
      '所有单源最短路径问题',
      'A* 的特例（当 h(n)=0 时，A* 退化为 Dijkstra）',
    ],
    tooltips: {
      openSet: '优先队列中的待处理节点（按 dist 值排序）。每步取出距离起点最近的节点。',
      closedSet: '已确定最短距离的节点。它们不会被再次处理。',
      path: '从起点到当前节点的最短距离路径长度。Dijkstra 保证最优。',
      totalVisited: '算法总共确定最短距离的节点数。在均匀权重网格上，Dijkstra 与 BFS 搜索范围类似。',
    },
  },
};
