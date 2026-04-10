# AlgoViz — Algorithm Visualization

Interactive algorithm visualization tool that helps you understand pathfinding algorithms through animated, step-by-step exploration.

## Features

- **4 Pathfinding Algorithms** — A\*, BFS, DFS, Dijkstra with real-time visualization
- **Canvas Grid Renderer** — Efficient canvas-based rendering, supports large grids (up to 80×130)
- **Interactive Grid Editor** — Draw walls, place start/end points with click & drag
- **Playback Controls** — Play/pause, step forward/backward, speed presets, progress scrubber
- **Maze Generation** — Recursive backtracker (perfect maze) and random wall scatter
- **Algorithm Education** — Detailed explanations of each algorithm's concepts, workflow, and terminology
- **Step-by-Step Explainer** — Real-time Chinese explanations of what the algorithm is doing and why
- **Tooltip Hints** — Hover over stats (Open/Closed/Path) to see algorithm-specific definitions
- **Color Legend** — Visual guide for grid cell states
- **Keyboard Shortcuts** — Space (play/pause), ←→ (step), R (reset)
- **Dark Mode** — Automatic detection via `prefers-color-scheme`
- **5 Grid Size Levels** — From 15×25 to 80×130

## Tech Stack

- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 + `@tailwindcss/vite`
- Vite 8
- Canvas API for grid rendering
- React Router v7

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run tests |

## Project Structure

```
src/
├── components/          # Shared UI (Button, Toast, Tooltip, Layout, Navbar)
├── features/
│   ├── home/            # Algorithm catalog home page
│   └── pathfinding/     # Pathfinding visualization feature
│       ├── algorithms/  # Pure algorithm implementations (A*, BFS, DFS, Dijkstra)
│       ├── components/  # GridCanvas, PlaybackControls, StatsPanel, etc.
│       ├── hooks/       # useVisualization, useGridEditor, useCanvasRenderer
│       ├── constants/   # Colors, grid presets, algorithm education data
│       ├── types/       # Grid, AlgorithmStep, Position types
│       └── utils/       # Grid helpers, maze generators
├── constants/           # Algorithm catalog
├── types/               # Shared types
└── router.tsx           # Route configuration
```

## Adding a New Algorithm

1. Create `src/features/pathfinding/algorithms/yourAlgo.ts` implementing `PathfindingAlgorithm`
2. Register it in `src/features/pathfinding/algorithms/index.ts`
3. Add catalog entry in `src/constants/algorithms.ts`
4. Add education data in `src/features/pathfinding/constants/algorithmEducation.ts`

## License

MIT
