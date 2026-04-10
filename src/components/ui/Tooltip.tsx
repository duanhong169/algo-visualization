import { cn } from '@/lib/utils';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline tooltip — shows text on hover via pure CSS.
 * Wraps children in a relative container with an absolute tooltip.
 */
export function Tooltip({ text, children, className }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex cursor-help', className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-max max-w-[240px] -translate-x-1/2 rounded-md bg-nav-bg px-2.5 py-1.5 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
        {/* Arrow */}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-nav-bg" />
      </span>
    </span>
  );
}
