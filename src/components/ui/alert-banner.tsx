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
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    },
  };

  const { bg, icon } = variantConfig[variant];

  return (
    <div
      className={cn(
        'p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed',
        bg,
        className
      )}
    >
      {icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold text-white mb-0.5">{title}</h4>}
        <p className="opacity-90">{message}</p>
      </div>
    </div>
  );
}
