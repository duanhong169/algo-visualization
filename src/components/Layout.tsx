import { Outlet } from 'react-router-dom';

import { ToastProvider } from '@/components/ui';

import { Navbar } from './Navbar';

/** App shell: fixed top nav + scrollable content area. */
export function Layout() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main className="mx-auto max-w-container px-4 pt-14">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
