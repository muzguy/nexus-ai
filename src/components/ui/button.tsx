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
      sm: 'h-8.5 px-3 text-xs gap-1.5 rounded-lg min-h-[36px]',
      md: 'h-9.5 sm:h-10 px-4 text-xs sm:text-sm gap-2 rounded-lg min-h-[40px]',
      lg: 'h-11 px-5 sm:px-6 text-sm font-semibold gap-2.5 rounded-xl min-h-[44px]',
    };

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-[#7F1D1D] via-[#BE123C] to-[#E11D48] hover:from-[#991B1B] hover:via-[#E11D48] hover:to-[#EF4444] text-white font-medium shadow-xs hover:shadow-[0_4px_16px_rgba(190,18,60,0.28)] transition-all duration-200 border border-rose-400/35 active:scale-[0.98]',
      secondary:
        'bg-nexus-900/80 hover:bg-nexus-850 text-nexus-200 hover:text-nexus-100 dark:hover:text-white border border-nexus-800/80 hover:border-nexus-700/90 backdrop-blur-md transition-all duration-150 shadow-xs active:scale-[0.98]',
      outline:
        'bg-transparent hover:bg-nexus-900/60 text-nexus-300 hover:text-nexus-100 dark:hover:text-white border border-nexus-800 hover:border-nexus-700 backdrop-blur-xs transition-all duration-150 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-nexus-900/60 text-nexus-400 hover:text-nexus-100 dark:hover:text-white transition-colors duration-150 active:scale-[0.98]',
      danger:
        'bg-rose-950/40 hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-800/40 hover:border-rose-700/50 transition-all duration-150 active:scale-[0.98]',
      glow:
        'bg-gradient-to-r from-[#7F1D1D] via-[#BE123C] to-[#E11D48] hover:from-[#991B1B] hover:via-[#E11D48] hover:to-[#EF4444] text-white font-semibold shadow-xs hover:shadow-[0_4px_20px_rgba(190,18,60,0.32)] transition-all duration-200 border border-rose-400/35 hover:border-rose-300/55 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-nexus-950 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none active:scale-[0.99] select-none touch-manipulation cursor-pointer',
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

