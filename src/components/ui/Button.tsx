import { type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1F883D] text-white border border-[rgba(27,31,36,.15)] shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-[#1a7f37] active:bg-[#187733]',
  secondary:
    'bg-bg text-text border border-border shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-[#f3f4f6] active:bg-[#ebecf0]',
  danger:
    'bg-[#CF222E] text-white border border-[rgba(27,31,36,.15)] shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-[#a40e26] active:bg-[#82071e]',
  outline:
    'bg-transparent text-text border border-border hover:bg-[#f3f4f6] active:bg-[#ebecf0]',
  ghost: 'bg-transparent text-primary border-none hover:bg-[#f3f4f6] active:bg-[#ebecf0]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-[3px] text-xs',
  md: 'px-4 py-[5px] text-sm',
  lg: 'px-5 py-[9px] text-sm',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-[background-color] duration-75',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
