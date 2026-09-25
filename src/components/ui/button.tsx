import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-md min-h-[32px]',
      md: 'h-9 px-4 text-sm gap-2 rounded-lg min-h-[36px]',
      lg: 'h-11 px-6 text-sm font-medium gap-2.5 rounded-xl min-h-[44px]',
    };

    const variantClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-glow transition-all duration-200 border border-indigo-500/30',
      secondary:
        'bg-nexus-850 hover:bg-nexus-800 text-nexus-100 dark:text-nexus-100 hover:text-nexus-50 dark:hover:text-white border border-nexus-800 hover:border-nexus-700 transition-all duration-150',
      outline:
        'bg-transparent hover:bg-nexus-850 text-nexus-300 hover:text-nexus-100 dark:hover:text-white border border-nexus-800 hover:border-nexus-700 transition-all duration-150',
      ghost:
        'bg-transparent hover:bg-nexus-850 text-nexus-400 hover:text-nexus-100 dark:hover:text-white transition-colors duration-150',
      danger:
        'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/30 transition-all duration-150',
      glow:
        'bg-gradient-to-r from-indigo-500 via-accent-violet to-accent-cyan text-white font-medium shadow-glow hover:shadow-glow-cyan hover:opacity-95 transition-all duration-200 border border-white/20',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-nexus-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] select-none touch-manipulation',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
