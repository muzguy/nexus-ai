'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { BrandDna } from '@/components/ui/brand-dna';
import { deriveBrandDna } from '@/lib/brand-dna';
import { ThemeToggle } from './theme-toggle';
import { Dna, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';

export function AppHeader() {
  const {
    project,
    resetToEmptyProject,
    loadSampleProject,
    isBrandDnaOpen,
    setIsBrandDnaOpen,
  } = useBrandProject();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const logoButtonRef = useRef<HTMLButtonElement>(null);

  const dna = useMemo(() => deriveBrandDna(project), [project]);

  const completedStagesCount = Object.values(project.stageStatus).filter(
    (status) => status === 'completed'
  ).length;

  const handleConfirmReset = () => {
    setIsResetDialogOpen(false);
    resetToEmptyProject();
    logoButtonRef.current?.focus();
  };

  const handleCancelReset = () => {
    setIsResetDialogOpen(false);
    logoButtonRef.current?.focus();
  };

  return (
    <>
      <header className="h-14 sm:h-15 border-b border-nexus-800/80 bg-nexus-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Brand Anchor & Project Context */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            ref={logoButtonRef}
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            title="Start new project"
            aria-label="Start new project"
            className="flex items-center gap-2.5 shrink-0 text-left rounded-lg p-1 -m-1 hover:bg-nexus-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70 transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#7F1D1D] via-[#BE123C] to-[#E11D48] text-white border border-rose-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)] shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform">
              <span className="text-white font-black text-xs sm:text-sm tracking-wider font-mono">NX</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-nexus-100 tracking-wider text-sm sm:text-base inline-flex items-baseline group-hover:text-rose-400 transition-colors">
                  <span>NEXUS</span>
                  <span className="text-[0.68em] font-semibold text-rose-600 dark:text-rose-400/90 tracking-normal lowercase ml-0.5 group-hover:text-rose-500 dark:group-hover:text-rose-300 transition-colors select-none">
                    .ai
                  </span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-nexus-900 border border-nexus-800 text-nexus-400 uppercase tracking-widest hidden xs:inline-flex">
                  Studio
                </span>
              </div>
            </div>
          </button>

          <div className="h-4 w-px bg-nexus-800 hidden md:block" />

          {/* Active Project Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono text-nexus-500 uppercase tracking-wider">PROJECT</span>
            <span className="text-xs font-semibold text-nexus-200 max-w-[180px] lg:max-w-[240px] truncate">
              {project.idea.title || project.name || 'Untitled Brand System'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-900 border border-nexus-800 text-nexus-400">
              {completedStagesCount}/7 Locked
            </span>
          </div>
        </div>

        {/* Right: Primary Intelligence Anchor & Grouped Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary Intelligence Anchor: Brand DNA */}
          <button
            type="button"
            onClick={() => setIsBrandDnaOpen(true)}
            title="View persistent Brand DNA"
            aria-label="Open Brand DNA panel"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all cursor-pointer font-mono text-xs font-medium shadow-xs shrink-0 active:scale-98"
          >
            <Dna className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold hidden xs:inline">Brand DNA</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-nexus-950 border border-rose-500/30 text-rose-300 font-mono">
              {dna.definedSignalsCount}/9
            </span>
          </button>

          <div className="h-4 w-px bg-nexus-800" />

          {/* Utility Controls Group */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSampleProject}
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-nexus-400" />}
              title="Load pre-synthesized Aether OS brand system"
              className="h-8 px-2.5 text-xs text-nexus-300 hover:text-nexus-100 hidden sm:inline-flex"
            >
              <span>Sample</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-nexus-400" />}
              title="Start fresh with a clean slate"
              className="h-8 px-2.5 text-xs text-nexus-300 hover:text-nexus-100 hidden sm:inline-flex"
            >
              <span>New</span>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Persistent Brand DNA Slide-over Panel */}
      <BrandDna
        isOpen={isBrandDnaOpen}
        onClose={() => setIsBrandDnaOpen(false)}
      />

      {/* Start New Project Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Start a new project?"
        message="This will clear the current brand project and return you to Discover."
        confirmLabel="Start New Project"
        cancelLabel="Cancel"
        confirmVariant="glow"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </>
  );
}
