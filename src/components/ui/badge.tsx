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
    default: 'bg-nexus-850/80 text-nexus-800 dark:text-nexus-200 border-nexus-800/60',
    primary: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    ruby: 'bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-500/35',
    crimson: 'bg-red-950/30 text-red-700 dark:text-red-300 border-red-500/35',
    cyan: 'bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    outline: 'bg-transparent text-nexus-700 dark:text-nexus-300 border-nexus-800/80',
  };

  const dotColors = {
    default: 'bg-nexus-500 dark:bg-nexus-400',
    primary: 'bg-rose-600 dark:bg-rose-400',
    ruby: 'bg-rose-600 dark:bg-rose-400',
    crimson: 'bg-red-600 dark:bg-red-400',
    cyan: 'bg-sky-600 dark:bg-sky-400',
    emerald: 'bg-emerald-600 dark:bg-emerald-400',
    amber: 'bg-amber-600 dark:bg-amber-400',
    rose: 'bg-rose-600 dark:bg-rose-400',
    outline: 'bg-nexus-500 dark:bg-nexus-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none max-w-full font-sans',
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
