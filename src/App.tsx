import { useState } from 'react';

import { Button, EmptyState, Skeleton, SkeletonText, useToast } from '@/components/ui';

function DemoContent() {
  const { toast } = useToast();
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Navigation */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-12 items-center bg-nav-bg px-4">
        <div className="mx-auto flex w-full max-w-container items-center gap-6">
          <span className="text-sm font-semibold text-white">Template</span>
          <nav className="flex gap-4">
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Dashboard
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Projects
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-4 pt-14">
        <div className="space-y-4 py-6">
          {/* Buttons Demo */}
          <section className="rounded-md border border-border bg-surface p-4">
            <h2 className="mb-3 text-base font-semibold text-text">Buttons</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </section>

          {/* Toast Demo */}
          <section className="rounded-md border border-border bg-surface p-4">
            <h2 className="mb-3 text-base font-semibold text-text">Toast Notifications</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => toast('success', 'Changes saved successfully')}
              >
                Success Toast
              </Button>
              <Button variant="danger" onClick={() => toast('error', 'Something went wrong')}>
                Error Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast('warning', 'This action cannot be undone')}
              >
                Warning Toast
              </Button>
            </div>
          </section>

          {/* Skeleton Demo */}
          <section className="rounded-md border border-border bg-surface p-4">
            <h2 className="mb-3 text-base font-semibold text-text">Skeleton Loading</h2>
            <Button variant="outline" onClick={() => setShowSkeleton((s) => !s)}>
              {showSkeleton ? 'Hide' : 'Show'} Skeleton
            </Button>
            {showSkeleton && (
              <div className="mt-3 flex items-start gap-3">
                <Skeleton circle width={40} height={40} />
                <div className="flex-1">
                  <Skeleton className="mb-2" width="40%" height={14} />
                  <SkeletonText lines={2} />
                </div>
              </div>
            )}
          </section>

          {/* Empty State Demo */}
          <section className="rounded-md border border-border bg-surface p-4">
            <h2 className="mb-3 text-base font-semibold text-text">Empty State</h2>
            <EmptyState
              icon={<span>&#128230;</span>}
              title="No projects yet"
              description="Get started by creating your first project."
              action={{
                label: 'New Project',
                onClick: () => toast('success', 'Creating new project...'),
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export function App() {
  return <DemoContent />;
}
