import { createContext, useCallback, useContext, useState } from 'react';

import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const typeStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-l-success',
  error: 'border-l-4 border-l-danger',
  warning: 'border-l-4 border-l-warning',
};

const typeIcons: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  warning: '!',
};

/** Wrap your app with this provider to enable toasts. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — fixed top-right */}
      <div className="pointer-events-none fixed right-4 top-14 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text shadow-lg',
              typeStyles[t.type],
            )}
          >
            <span className="font-bold">{typeIcons[t.type]}</span>
            <span className="flex-1">{t.message}</span>
            <button
              className="ml-2 text-text-muted hover:text-text"
              onClick={() => dismiss(t.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook to trigger toast notifications. Must be used within a ToastProvider. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
