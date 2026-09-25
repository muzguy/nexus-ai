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
        'rounded-xl bg-nexus-900/80 backdrop-blur-sm border border-nexus-800 text-nexus-100 transition-all duration-200 shadow-sm relative overflow-hidden',
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
      className={cn('px-5 py-4 border-b border-nexus-800/80 flex items-center justify-between', className)}
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
      className={cn('text-base font-semibold text-white tracking-tight flex items-center gap-2', className)}
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
    <p className={cn('text-xs text-nexus-400 mt-0.5', className)} {...props}>
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
    <div className={cn('p-5 space-y-4', className)} {...props}>
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
      className={cn('px-5 py-3.5 bg-nexus-950/40 border-t border-nexus-800/80 flex items-center justify-between text-xs text-nexus-400', className)}
      {...props}
    >
      {children}
    </div>
  );
}
