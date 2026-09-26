import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'ruby' | 'crimson' | 'outline';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-nexus-850/80 text-nexus-300 border-nexus-800',
    primary: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    ruby: 'bg-rose-950/40 text-rose-300 border-rose-500/30',
    crimson: 'bg-red-950/40 text-red-300 border-red-500/30',
    cyan: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    emerald: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
    outline: 'bg-transparent text-nexus-400 border-nexus-800',
  };

  const dotColors = {
    default: 'bg-nexus-400',
    primary: 'bg-rose-400',
    ruby: 'bg-rose-500',
    crimson: 'bg-red-500',
    cyan: 'bg-rose-400',
    emerald: 'bg-rose-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-500 dark:bg-rose-400',
    outline: 'bg-nexus-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none max-w-full',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}
