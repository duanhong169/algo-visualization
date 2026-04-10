import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  /** Render as a circle (for avatars) */
  circle?: boolean;
  /** Width — accepts any CSS value */
  width?: string | number;
  /** Height — accepts any CSS value */
  height?: string | number;
}

export function Skeleton({ className, circle, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-border/50',
        circle ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

/** A pre-composed skeleton that mimics a text block with multiple lines. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          // Last line is shorter for a natural look
          style-width={i === lines - 1 ? '60%' : '100%'}
          width={i === lines - 1 ? '60%' : '100%'}
          height={12}
        />
      ))}
    </div>
  );
}
