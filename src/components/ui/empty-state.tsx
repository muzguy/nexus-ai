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
  icon = <Sparkles className="w-8 h-8 text-indigo-400" />,
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
        'flex flex-col items-center justify-center p-6 sm:p-12 text-center rounded-2xl border border-dashed border-nexus-800 bg-nexus-900/40 dark:bg-nexus-950/40 max-w-2xl mx-auto my-4 sm:my-6 w-full box-border',
        className
      )}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-glow shrink-0">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-nexus-100 dark:text-white tracking-tight">{title}</h3>
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
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px]"
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
