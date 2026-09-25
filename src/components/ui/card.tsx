import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  active?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  hoverEffect = false,
  active = false,
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-nexus-900 border border-nexus-800 text-nexus-200 transition-all duration-200 shadow-sm relative overflow-hidden w-full',
        hoverEffect && 'hover:border-nexus-700 hover:bg-nexus-850/90 hover:shadow-md cursor-pointer',
        active && 'border-indigo-500/60 ring-1 ring-indigo-500/40 bg-nexus-850/90',
        glow && 'shadow-glow border-indigo-500/40',
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
        'px-4 py-3 sm:px-5 sm:py-4 border-b border-nexus-800 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap',
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
        'text-sm sm:text-base font-semibold text-nexus-100 dark:text-white tracking-tight flex items-center gap-2 flex-wrap',
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
    <p className={cn('text-xs text-nexus-400 mt-0.5 leading-normal', className)} {...props}>
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
    <div className={cn('p-4 sm:p-5 space-y-4 w-full min-w-0', className)} {...props}>
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
        'px-4 py-3 sm:px-5 sm:py-3.5 bg-nexus-950/40 border-t border-nexus-800 flex items-center justify-between text-xs text-nexus-400 gap-2 flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
