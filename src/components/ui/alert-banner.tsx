import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { Button } from './button';

export interface AlertBannerProps {
  variant?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  message: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function AlertBanner({
  variant = 'info',
  title,
  message,
  className,
  action,
  onDismiss,
}: AlertBannerProps) {
  const variantConfig = {
    info: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      icon: <Info className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
      icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
    },
  };

  const { bg, icon } = variantConfig[variant];

  return (
    <div
      className={cn(
        'p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm leading-relaxed w-full box-border',
        bg,
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold text-nexus-100 dark:text-white mb-0.5">{title}</h4>}
          <p className="opacity-90 break-words">{message}</p>
        </div>
      </div>
      {(action || onDismiss) && (
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="text-xs h-7 px-3 bg-white/5 hover:bg-white/10"
            >
              {action.label}
            </Button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-md text-nexus-400 hover:text-nexus-200 dark:hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
