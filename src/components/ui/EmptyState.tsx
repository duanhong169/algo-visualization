import { cn } from '@/lib/utils';

import { Button } from './Button';
import type { ButtonProps } from './Button';

export interface EmptyStateProps {
  /** Icon or illustration — renders above the title */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && <div className="mb-4 text-4xl text-text-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>}
      {action && (
        <div className="mt-4">
          <Button variant={action.variant ?? 'primary'} onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
