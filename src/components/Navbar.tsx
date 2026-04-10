import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-12 items-center bg-nav-bg px-4">
      <div className="mx-auto flex w-full max-w-container items-center gap-6">
        <NavLink to="/" className="text-sm font-semibold text-white">
          AlgoViz
        </NavLink>
        <nav className="flex flex-1 gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn('text-sm text-white/70 hover:text-white', isActive && 'text-white')
            }
          >
            Algorithms
          </NavLink>
        </nav>
        <a
          href="https://github.com/duanhong169/algo-visualization"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/70 hover:text-white"
          title="View source on GitHub"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
