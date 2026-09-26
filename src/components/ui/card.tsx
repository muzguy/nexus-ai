import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'subtle' | 'ghost' | 'elevated' | 'bordered';
  hoverEffect?: boolean;
  active?: boolean;
  glow?: boolean;
  glass?: boolean; // Backward compatibility
}

export function Card({
  className,
  variant = 'glass',
  hoverEffect = false,
  active = false,
  glow = false,
  glass = false,
  children,
  ...props
}: CardProps) {
  // Resolve variant styles with clean surface hierarchy
  const variantClasses = {
    glass:
      'bg-nexus-900/60 backdrop-blur-md border border-nexus-800/60 shadow-xs',
    subtle:
      'bg-nexus-900/30 border border-nexus-800/30 backdrop-blur-xs shadow-none',
    ghost:
      'bg-transparent border-transparent shadow-none',
    elevated:
      'bg-nexus-900/75 backdrop-blur-lg border border-nexus-750/70 shadow-glass-elevated',
    bordered:
      'bg-nexus-900/45 border border-nexus-800/80 shadow-xs',
  };

  const resolvedVariant = glass ? 'glass' : variant;

  return (
    <div
      className={cn(
        'rounded-xl text-nexus-200 transition-all duration-150 relative overflow-hidden w-full box-border',
        variantClasses[resolvedVariant],
        hoverEffect && 'hover:border-nexus-750 hover:bg-nexus-850/50 hover:shadow-subtle cursor-pointer',
        active && 'border-rose-500/50 ring-1 ring-rose-500/30 bg-rose-950/15',
        glow && 'shadow-[0_0_24px_-3px_rgba(190,18,60,0.28)] border-rose-500/35',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3.5 sm:px-6 sm:py-4 border-b border-nexus-800/40 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-sm sm:text-base font-semibold text-nexus-100 dark:text-white tracking-tight flex items-center gap-2 flex-wrap font-sans',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-xs sm:text-sm text-nexus-400 mt-1 leading-relaxed font-sans',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5 sm:p-6 space-y-4 w-full min-w-0 box-border', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3.5 sm:px-6 sm:py-4 bg-nexus-950/30 border-t border-nexus-800/40 flex items-center justify-between text-xs text-nexus-400 gap-2 flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

