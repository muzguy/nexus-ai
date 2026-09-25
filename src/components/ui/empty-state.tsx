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
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-nexus-800 bg-nexus-950/40 max-w-2xl mx-auto my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-glow">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-nexus-400 max-w-md mt-2 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {actionLabel && onAction && (
            <Button
              variant="glow"
              size="md"
              onClick={onAction}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4" />}
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
