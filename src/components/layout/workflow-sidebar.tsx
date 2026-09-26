'use client';

import React, { useMemo } from 'react';
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
  Lock,
  ChevronRight,
  Dna,
} from 'lucide-react';

const STAGE_ICONS: Record<WorkflowStage, React.ReactNode> = {
  discover: <Compass className="w-4 h-4" />,
  position: <Crosshair className="w-4 h-4" />,
  challenge: <ShieldAlert className="w-4 h-4" />,
  shape: <Flame className="w-4 h-4" />,
  visualize: <Palette className="w-4 h-4" />,
  consistency: <ShieldCheck className="w-4 h-4" />,
  launch: <Rocket className="w-4 h-4" />,
};

export function WorkflowSidebar() {
  const {
    project,
    activeStage,
    setActiveStage,
    canAdvanceToStage,
    setIsBrandDnaOpen,
  } = useBrandProject();

  const dna = useMemo(() => deriveBrandDna(project), [project]);

  const completedCount = Object.values(project.stageStatus).filter(
    (s) => s === 'completed'
  ).length;

  const progressPercentage = Math.round((completedCount / WORKFLOW_STAGES.length) * 100);

  return (
    <aside className="hidden md:flex w-64 lg:w-72 border-r border-nexus-800 bg-nexus-950 flex-col shrink-0">
      {/* Workflow Progress Header */}
      <div className="p-4 sm:p-5 border-b border-nexus-800 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-nexus-500 tracking-wider mb-1.5 uppercase">
            <span>COGNITIVE PIPELINE</span>
            <span className="text-nexus-300 font-semibold">{completedCount} of 7 Locked</span>
          </div>
          <div className="w-full h-1 bg-nexus-850 rounded-full overflow-hidden border border-nexus-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Brand DNA Depth Indicator (Calm intelligence meter, not a duplicate primary CTA) */}
        <button
          type="button"
          onClick={() => setIsBrandDnaOpen(true)}
          title="Open persistent Brand DNA panel"
          className="w-full flex items-center justify-between p-2 rounded-lg bg-nexus-900 border border-nexus-850 hover:border-nexus-800 transition-colors text-left cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Dna className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="text-xs text-nexus-300 font-medium truncate">Brand DNA</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 shrink-0">
            {dna.definedSignalsCount}/9 · {dna.maturityLabel}
          </span>
        </button>
      </div>

      {/* Deliberate Cognitive Stage Workflow */}
      <nav className="flex-1 p-2.5 sm:p-3 space-y-1 overflow-y-auto">
        {WORKFLOW_STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          const status = project.stageStatus[stage.id];
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in_progress';

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                'w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-start gap-2.5 group relative select-none cursor-pointer',
                isActive
                  ? 'bg-nexus-900 border border-emerald-500/40 shadow-xs text-nexus-100'
                  : 'hover:bg-nexus-900/60 text-nexus-400 hover:text-nexus-200 border border-transparent'
              )}
            >
              {/* Step indicator node */}
              <div
                className={cn(
                  'w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs transition-colors mt-0.5 font-mono',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isInProgress
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse'
                    : 'bg-nexus-850 text-nexus-500 border border-nexus-800'
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  STAGE_ICONS[stage.id]
                )}
              </div>

              {/* Stage labels */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs tracking-tight truncate',
                      isActive ? 'font-bold text-nexus-100' : 'font-medium text-nexus-300'
                    )}
                  >
                    {stage.shortLabel}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                  {isInProgress && !isActive && (
                    <span className="text-[10px] text-emerald-400 font-mono animate-pulse">RUN</span>
                  )}
                </div>
                <p
                  className={cn(
                    'text-[11px] truncate font-sans',
                    isActive ? 'text-emerald-400/90' : 'text-nexus-500'
                  )}
                >
                  {stage.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / System Status */}
      <div className="p-3 border-t border-nexus-800 bg-nexus-950">
        <div className="px-3 py-2 rounded-lg bg-nexus-900 border border-nexus-850 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-nexus-300">Cognitive Pipeline</span>
          </div>
          <span className="text-nexus-500">v1.0</span>
        </div>
      </div>
    </aside>
  );
}
