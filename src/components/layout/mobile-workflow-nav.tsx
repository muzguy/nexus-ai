'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { WORKFLOW_STAGES, WorkflowStage } from '@/types';
import { cn } from '@/lib/utils';
import {
  Compass,
  Crosshair,
  ShieldAlert,
  Flame,
  Palette,
  ShieldCheck,
  Rocket,
  Check,
  ChevronDown,
  Layers,
  Dna,
} from 'lucide-react';

const STAGE_ICONS: Record<WorkflowStage, React.ReactNode> = {
  discover: <Compass className="w-3.5 h-3.5" />,
  position: <Crosshair className="w-3.5 h-3.5" />,
  challenge: <ShieldAlert className="w-3.5 h-3.5" />,
  shape: <Flame className="w-3.5 h-3.5" />,
  visualize: <Palette className="w-3.5 h-3.5" />,
  consistency: <ShieldCheck className="w-3.5 h-3.5" />,
  launch: <Rocket className="w-3.5 h-3.5" />,
};

export function MobileWorkflowNav() {
  const {
    project,
    activeStage,
    setActiveStage,
    canAdvanceToStage,
    setIsBrandDnaOpen,
  } = useBrandProject();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const completedCount = Object.values(project.stageStatus).filter(
    (s) => s === 'completed'
  ).length;

  const currentStageConfig = WORKFLOW_STAGES.find((s) => s.id === activeStage);
  const progressPercentage = Math.round((completedCount / WORKFLOW_STAGES.length) * 100);

  // Auto-scroll active item into view when activeStage changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeStage]);

  return (
    <div className="md:hidden border-b border-nexus-800 bg-nexus-950/95 sticky top-14 z-30 backdrop-blur-md">
      {/* Top compact bar: Active stage summary + Progress + Dropdown toggle */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-nexus-850">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 text-left min-w-0 flex-1 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
        >
          <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            {STAGE_ICONS[activeStage]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-nexus-100 dark:text-white truncate">
                {currentStageConfig?.shortLabel}
              </span>
              <span className="text-[10px] font-mono text-nexus-400">
                ({currentStageConfig?.stepNumber}/7)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <span className="text-[11px] font-mono font-medium text-accent-cyan">
              {progressPercentage}%
            </span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-nexus-400 transition-transform duration-200',
                isDropdownOpen && 'rotate-180 text-white'
              )}
            />
          </div>
        </button>

        {/* Mobile Brand DNA Trigger */}
        <button
          type="button"
          onClick={() => setIsBrandDnaOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/35 bg-indigo-500/10 text-accent-cyan text-xs font-mono font-semibold shrink-0 cursor-pointer active:scale-95 transition-transform"
          title="Open Brand DNA"
          aria-label="Open Brand DNA"
        >
          <Dna className="w-3.5 h-3.5 text-accent-cyan" />
          <span>DNA</span>
        </button>
      </div>

      {/* Progress line */}
      <div className="w-full h-1 bg-nexus-850 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-accent-violet to-accent-cyan transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Horizontal Scrollable Stage Tabs */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 p-2 px-3 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {WORKFLOW_STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          const status = project.stageStatus[stage.id];
          const isCompleted = status === 'completed';

          return (
            <button
              key={stage.id}
              data-active={isActive}
              onClick={() => {
                setActiveStage(stage.id);
                setIsDropdownOpen(false);
              }}
              className={cn(
                'min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all select-none border',
                isActive
                  ? 'bg-nexus-850 text-nexus-100 dark:text-white border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                  : isCompleted
                  ? 'bg-nexus-900/60 text-nexus-300 border-nexus-800 hover:border-nexus-700'
                  : 'bg-nexus-950/60 text-nexus-400 border-nexus-850 hover:border-nexus-800'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-nexus-400'
                )}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : stage.stepNumber}
              </div>
              <span>{stage.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Full Stage Dropdown Menu (Collapsible) */}
      {isDropdownOpen && (
        <div className="p-3 bg-nexus-900 border-t border-nexus-800 shadow-xl max-h-80 overflow-y-auto space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-nexus-850 text-[11px] font-mono text-nexus-400">
            <span>ALL WORKFLOW STAGES</span>
            <span className="text-nexus-300">{completedCount} of 7 Completed</span>
          </div>

          {WORKFLOW_STAGES.map((stage) => {
            const isActive = activeStage === stage.id;
            const status = project.stageStatus[stage.id];
            const isCompleted = status === 'completed';

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(stage.id);
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  'w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors',
                  isActive
                    ? 'bg-nexus-850 text-white border border-indigo-500/40'
                    : 'text-nexus-300 hover:bg-nexus-850/60'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'w-6 h-6 rounded flex items-center justify-center text-xs shrink-0',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-nexus-800 text-nexus-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : STAGE_ICONS[stage.id]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{stage.label}</p>
                    <p className="text-[10px] text-nexus-400 truncate">{stage.tagline}</p>
                  </div>
                </div>

                {isCompleted && (
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">DONE</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
