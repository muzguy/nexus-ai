'use client';

import React, { useState, useMemo } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { WORKFLOW_STAGES, WorkflowStage } from '@/types';
import { deriveBrandDna } from '@/lib/brand-dna';
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
  Dna,
  ArrowLeft,
  ArrowRight,
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
    setIsBrandDnaOpen,
    goToNextStage,
    goToPreviousStage,
  } = useBrandProject();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dna = useMemo(() => deriveBrandDna(project), [project]);

  const completedCount = Object.values(project.stageStatus).filter(
    (s) => s === 'completed'
  ).length;

  const currentStageConfig = WORKFLOW_STAGES.find((s) => s.id === activeStage);
  const progressPercentage = Math.round((completedCount / WORKFLOW_STAGES.length) * 100);

  return (
    <div className="md:hidden border-b border-nexus-800/80 bg-nexus-950/90 backdrop-blur-md sticky top-14 z-30">
      {/* Streamlined Single-Bar Mobile Navigation */}
      <div className="h-11 px-3 flex items-center justify-between gap-2">
        {/* Stage Selector Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 text-left min-w-0 flex-1 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500/70 rounded cursor-pointer select-none"
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7F1D1D] via-[#BE123C] to-[#E11D48] text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
            0{currentStageConfig?.stepNumber}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-nexus-100 truncate">
              {currentStageConfig?.shortLabel}
            </span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-nexus-400 transition-transform duration-200 shrink-0',
                isDropdownOpen && 'rotate-180 text-rose-400'
              )}
            />
          </div>
        </button>

        {/* Quick Prev / Next Controls & Brand DNA */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="inline-flex items-center rounded-md border border-nexus-800 bg-nexus-900 p-0.5">
            <button
              type="button"
              onClick={goToPreviousStage}
              disabled={activeStage === 'discover'}
              aria-label="Previous Stage"
              className="p-1 text-nexus-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-nexus-800" />
            <button
              type="button"
              onClick={goToNextStage}
              disabled={activeStage === 'launch'}
              aria-label="Next Stage"
              className="p-1 text-nexus-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Brand DNA Quick Indicator */}
          <button
            type="button"
            onClick={() => setIsBrandDnaOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono font-semibold shrink-0 cursor-pointer active:scale-95 transition-transform"
            title="Open Brand DNA"
            aria-label="Open Brand DNA"
          >
            <Dna className="w-3 h-3 text-rose-400" />
            <span>{dna.definedSignalsCount}/9</span>
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-[2px] bg-nexus-850 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#BE123C] to-[#E11D48] transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Full Stage Dropdown Menu (Collapsible) */}
      {isDropdownOpen && (
        <div className="p-3 bg-nexus-900/95 backdrop-blur-xl border-t border-nexus-800/80 shadow-2xl max-h-80 overflow-y-auto space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-nexus-850 text-[11px] font-mono text-nexus-400">
            <span>PIPELINE WORKFLOW</span>
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
                  'w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer',
                  isActive
                    ? 'bg-nexus-850 text-white border border-rose-600/40'
                    : 'text-nexus-300 hover:bg-nexus-850/60'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'w-6 h-6 rounded flex items-center justify-center text-xs shrink-0 font-mono',
                      isActive
                        ? 'bg-gradient-to-br from-[#7F1D1D] via-[#BE123C] to-[#E11D48] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-nexus-800 text-nexus-300'
                        : 'bg-nexus-800 text-nexus-500'
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
                  <span className="text-[10px] font-mono text-rose-400 shrink-0">DONE</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
