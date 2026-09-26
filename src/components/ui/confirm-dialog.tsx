'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'glow',
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation (Escape to cancel) & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Focus cancel button or dialog on mount
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onCancel]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-nexus-900 border border-nexus-800 dark:border-indigo-500/30 text-nexus-100 shadow-2xl shadow-indigo-950/40 p-5 sm:p-6 space-y-4 my-auto text-left focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-accent-cyan shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-nexus-400 hover:text-nexus-100 dark:hover:text-white hover:bg-nexus-850 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3
            id="confirm-dialog-title"
            className="text-base sm:text-lg font-bold text-nexus-100 dark:text-white tracking-tight"
          >
            {title}
          </h3>
          <p
            id="confirm-dialog-message"
            className="text-xs sm:text-sm text-nexus-300 leading-relaxed font-sans"
          >
            {message}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            ref={cancelBtnRef}
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs h-9 px-4 min-w-[80px]"
          >
            {cancelLabel}
          </Button>

          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            className="text-xs h-9 px-4"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
