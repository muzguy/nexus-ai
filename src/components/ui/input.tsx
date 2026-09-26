import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full min-w-0 space-y-1.5">
        {label && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold text-nexus-200 uppercase tracking-wider"
            >
              {label}
            </label>
            {hint && <span className="text-xs text-nexus-400">{hint}</span>}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full max-w-full box-border px-3.5 py-2 text-sm bg-nexus-850/80 backdrop-blur-xs text-nexus-100 placeholder:text-nexus-500 rounded-lg border border-nexus-800 transition-all focus:outline-none focus:border-rose-600/70 focus:ring-1 focus:ring-rose-600/30 focus:shadow-[0_0_12px_-2px_rgba(190,18,60,0.18)] disabled:opacity-40 disabled:bg-nexus-900 min-h-[44px] sm:min-h-[38px]',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
