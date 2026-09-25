import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertBannerProps {
  variant?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export function AlertBanner({
  variant = 'info',
  title,
  message,
  className,
}: AlertBannerProps) {
  const variantConfig = {
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200',
      icon: <Info className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
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
        'p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm leading-relaxed w-full box-border',
        bg,
        className
      )}
    >
      {icon}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-nexus-100 dark:text-white mb-0.5">{title}</h4>}
        <p className="opacity-90 break-words">{message}</p>
      </div>
    </div>
  );
}
