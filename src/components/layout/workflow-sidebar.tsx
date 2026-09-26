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
    <aside className="hidden md:flex w-72 border-r border-nexus-800 bg-nexus-950/60 flex-col shrink-0">
      {/* Workflow Progress Header */}
      <div className="p-5 border-b border-nexus-800/80 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-nexus-400 mb-2">
            <span>PIPELINE PROGRESS</span>
            <span className="text-nexus-100 dark:text-white font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-nexus-850 rounded-full overflow-hidden border border-nexus-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-accent-violet to-accent-cyan transition-all duration-500 rounded-full shadow-glow"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-nexus-500 mt-2 font-mono">
            {completedCount} of 7 cognitive stages locked
          </p>
        </div>

        {/* Brand DNA Quick Access Trigger */}
        <button
          type="button"
          onClick={() => setIsBrandDnaOpen(true)}
          title="Open persistent Brand DNA panel"
          className="w-full flex items-center justify-between p-2 rounded-xl border border-indigo-500/35 bg-indigo-500/10 hover:bg-indigo-500/20 text-nexus-100 transition-all font-mono text-xs cursor-pointer group shadow-xs select-none"
        >
          <div className="flex items-center gap-2">
            <Dna className="w-3.5 h-3.5 text-accent-cyan group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-accent-cyan">Brand DNA</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-nexus-900 border border-nexus-700 text-nexus-300">
            {dna.definedSignalsCount}/9 · {dna.maturityLabel}
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {WORKFLOW_STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          const status = project.stageStatus[stage.id];
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in_progress';
          const isAccessible = canAdvanceToStage(stage.id);

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group relative select-none',
                isActive
                  ? 'bg-nexus-850 border border-indigo-500/50 shadow-sm text-nexus-100 dark:text-white'
                  : 'hover:bg-nexus-900/60 text-nexus-400 hover:text-nexus-100 dark:hover:text-white border border-transparent'
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors mt-0.5',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : isInProgress
                    ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 animate-pulse'
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
                      'text-xs font-semibold tracking-tight truncate',
                      isActive ? 'text-nexus-100 dark:text-white font-bold' : 'text-nexus-300'
                    )}
                  >
                    {stage.shortLabel}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">
                      DONE
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-[10px] text-accent-cyan font-mono animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-nexus-400 truncate mt-0.5 font-sans">
                  {stage.tagline}
                </p>
              </div>

              {isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / System Status */}
      <div className="p-4 border-t border-nexus-800/80 bg-nexus-950/80">
        <div className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-850 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow" />
            <span className="text-nexus-300">Nexus Pipeline</span>
          </div>
          <span className="text-nexus-500">v1.0 Mock</span>
        </div>
      </div>
    </aside>
  );
}
