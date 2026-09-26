'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { WhyThisProps } from '@/types/explainability';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListenButton } from '@/components/ui/listen-button';
import { speechManager } from '@/lib/speech/speech-manager';
import {
  HelpCircle,
  X,
  Target,
  Sparkles,
  Layers,
  Scale,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function WhyThis({
  stageBadge = 'Strategic Intelligence',
  title = 'Strategic Rationale',
  decision,
  decisionSubtitle,
  inputs = [],
  reasoning,
  tradeoff,
  consideration,
  triggerLabel = 'Why this?',
  triggerVariant = 'button',
  className = '',
}: WhyThisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listenId = useRef(`why-this-${Math.random().toString(36).slice(2, 9)}`).current;

  // Format clean strategic explanation text for voice playback
  const speechContent = useMemo(() => {
    const parts: string[] = [];
    if (decision) parts.push(`Decision: ${decision}`);
    if (decisionSubtitle) parts.push(decisionSubtitle);
    if (reasoning) parts.push(`Strategic reasoning: ${reasoning}`);
    if (tradeoff) parts.push(`Trade-offs and guardrails: ${tradeoff}`);
    if (consideration) parts.push(`Considerations: ${consideration}`);
    return parts.join('. ');
  }, [decision, decisionSubtitle, reasoning, tradeoff, consideration]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup speech when component unmounts
  useEffect(() => {
    return () => {
      speechManager.stopIfActive(listenId);
    };
  }, [listenId]);

  // Keyboard navigation, scroll locking & speech cleanup
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechManager.stopIfActive(listenId);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, listenId]);

  const handleClose = () => {
    speechManager.stopIfActive(listenId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Trigger button styling variants
  let triggerButtonContent: React.ReactNode;
  let triggerClasses = '';

  if (triggerVariant === 'icon') {
    triggerClasses =
      'inline-flex items-center justify-center w-6 h-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all cursor-pointer shrink-0';
    triggerButtonContent = <HelpCircle className="w-3.5 h-3.5" />;
  } else if (triggerVariant === 'compact') {
    triggerClasses =
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm';
    triggerButtonContent = (
      <>
        <HelpCircle className="w-3 h-3 text-accent-cyan shrink-0" />
        <span>{triggerLabel}</span>
      </>
    );
  } else {
    // Default 'button'
    triggerClasses =
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border border-indigo-500/35 bg-indigo-500/10 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/60 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm';
    triggerButtonContent = (
      <>
        <HelpCircle className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
        <span>{triggerLabel}</span>
      </>
    );
  }

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-this-title"
        aria-describedby="why-this-decision"
        className="relative w-full max-w-xl rounded-2xl bg-nexus-900 border border-nexus-800 dark:border-indigo-500/30 text-nexus-100 shadow-2xl shadow-indigo-950/40 p-4 sm:p-6 space-y-4 my-auto text-left focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-nexus-800 pb-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" className="text-[10px] font-mono uppercase">
                {stageBadge}
              </Badge>
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
                Explainability Layer
              </span>
            </div>
            <h3
              id="why-this-title"
              className="text-base sm:text-lg font-bold text-nexus-100 dark:text-white tracking-tight flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-accent-cyan shrink-0" />
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ListenButton
              id={listenId}
              text={speechContent}
              label="Listen"
              size="xs"
              variant="compact"
              stopOnUnmount={true}
            />
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-nexus-400 hover:text-nexus-100 dark:hover:text-white hover:bg-nexus-800 transition-colors shrink-0"
              aria-label="Close explanation dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Decision Section */}
          <div className="p-3.5 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
              Generated Decision
            </span>
            <p
              id="why-this-decision"
              className="text-sm sm:text-base font-bold text-nexus-100 dark:text-white leading-snug break-words"
            >
              {decision}
            </p>
            {decisionSubtitle && (
              <p className="text-xs text-nexus-300 leading-relaxed italic break-words">
                {decisionSubtitle}
              </p>
            )}
          </div>

          {/* 2. Key Influencing Context & Inputs */}
          {inputs.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 dark:text-indigo-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Influenced By Upstream Context
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inputs.map((inp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-nexus-950/40 border border-nexus-850 space-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-nexus-400 uppercase block font-semibold">
                      {inp.label}
                    </span>
                    <p className="text-xs text-nexus-200 leading-relaxed break-words font-medium">
                      {inp.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Strategic Rationale */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Strategic Reasoning
            </span>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm text-nexus-200 leading-relaxed font-sans">
              {reasoning}
            </div>
          </div>

          {/* 4. Tradeoffs & Guardrails */}
          {(tradeoff || consideration) && (
            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                Strategic Sacrifice &amp; Guardrails
              </span>
              {tradeoff && (
                <p className="text-xs text-rose-700 dark:text-rose-200/90 leading-relaxed">
                  {tradeoff}
                </p>
              )}
              {consideration && (
                <p className="text-[11px] font-mono text-nexus-400 mt-1 italic">
                  {consideration}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-nexus-800 flex items-center justify-between text-xs text-nexus-400 flex-wrap gap-2">
          <span className="text-[11px] font-mono text-nexus-400 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            Grounded in active project context
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="text-xs h-8 px-3"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${triggerClasses} ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={triggerLabel || 'Explain why this decision was made'}
      >
        {triggerButtonContent}
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
