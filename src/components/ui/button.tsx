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
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg min-h-[32px]',
      md: 'h-9 px-4 text-xs sm:text-sm gap-2 rounded-lg min-h-[36px]',
      lg: 'h-11 px-5 sm:px-6 text-sm font-semibold gap-2.5 rounded-xl min-h-[44px]',
    };

    const variantClasses = {
      primary:
        'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium shadow-xs hover:shadow-glow transition-all duration-150 border border-emerald-500/40',
      secondary:
        'bg-nexus-850 hover:bg-nexus-800 text-nexus-200 dark:text-nexus-200 hover:text-white dark:hover:text-white border border-nexus-800 hover:border-nexus-750 transition-all duration-150 shadow-xs',
      outline:
        'bg-transparent hover:bg-nexus-850/80 text-nexus-300 hover:text-white dark:hover:text-white border border-nexus-800 hover:border-nexus-750 transition-all duration-150',
      ghost:
        'bg-transparent hover:bg-nexus-850 text-nexus-400 hover:text-white dark:hover:text-white transition-colors duration-150',
      danger:
        'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 transition-all duration-150',
      glow:
        'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-xs hover:shadow-glow transition-all duration-150 border border-emerald-400/30',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-nexus-950 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none active:scale-[0.99] select-none touch-manipulation cursor-pointer',
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
