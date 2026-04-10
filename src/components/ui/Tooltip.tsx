import { useState, useRef, useCallback } from 'react';

import { cn } from '@/lib/utils';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline tooltip — uses fixed positioning to avoid overflow clipping.
 * Shows below the trigger element, left-aligned to prevent edge cutoff.
 */
export function Tooltip({ text, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: Math.max(8, rect.left),
    });
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <span
      ref={triggerRef}
      className={cn('inline-flex cursor-help', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <span
          className="fixed z-50 max-w-[280px] rounded-md bg-nav-bg px-3 py-2 text-sm leading-relaxed text-white shadow-lg"
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
