import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Sparkles } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <Sparkles className="w-6 h-6 text-emerald-400" />,
  title,
  description,
  actionLabel,
  onAction,
  isLoading = false,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-nexus-800 bg-nexus-900 shadow-md max-w-2xl mx-auto my-6 sm:my-8 w-full box-border relative overflow-hidden',
        className
      )}
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-nexus-850 border border-nexus-800 flex items-center justify-center mb-4 shadow-xs shrink-0 text-emerald-400 ring-1 ring-emerald-500/20">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-nexus-100 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-nexus-400 max-w-md mt-2 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full sm:w-auto">
          {actionLabel && onAction && (
            <Button
              variant="glow"
              size="md"
              onClick={onAction}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] px-5"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
