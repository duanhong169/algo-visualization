import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { HomePage } from '@/features/home/HomePage';
import { PathfindingPage } from '@/features/pathfinding/PathfindingPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'pathfinding/:algorithmId', element: <PathfindingPage /> },
    ],
  },
]);
