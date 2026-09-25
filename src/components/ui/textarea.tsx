import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full min-w-0 space-y-1.5">
        {label && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold text-nexus-200 uppercase tracking-wider"
            >
              {label}
            </label>
            {hint && <span className="text-xs text-nexus-400">{hint}</span>}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full max-w-full box-border px-3.5 py-2.5 text-sm bg-nexus-900 dark:bg-nexus-950/70 text-nexus-100 placeholder:text-nexus-400 rounded-lg border border-nexus-800 transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-nexus-850 leading-relaxed resize-y',
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

Textarea.displayName = 'Textarea';
