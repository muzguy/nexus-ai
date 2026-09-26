'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { WORKFLOW_STAGES } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageHeaderProps {
  actionLabel?: string;
  actionDisabled?: boolean;
}

export function StageHeader({ actionLabel, actionDisabled = false }: StageHeaderProps) {
  const {
    project,
    activeStage,
    isExecutingStage,
    executionProgress,
    runCurrentStageAction,
    goToNextStage,
    goToPreviousStage,
  } = useBrandProject();

  const currentStageConfig = WORKFLOW_STAGES.find((s) => s.id === activeStage);
  const status = project.stageStatus[activeStage];
  const isCompleted = status === 'completed';

  const defaultActionLabels: Record<string, string> = {
    discover: isCompleted ? 'Re-run Discovery Analysis' : 'Synthesize Discovery Intelligence',
    position: isCompleted ? 'Regenerate Positioning Directions' : 'Generate 3 Positioning Directions',
    challenge: isCompleted ? 'Re-run Adversarial Stress-Test' : 'Stress-Test & Challenge Directions',
    shape: isCompleted ? 'Regenerate Brand Identity & Voice' : 'Shape Identity, Naming & Voice',
    visualize: isCompleted ? 'Regenerate Visual Design Brief' : 'Generate Visual Design Brief',
    consistency: isCompleted ? 'Re-run Guardian Consistency Audit' : 'Run Consistency Guardian Audit',
    launch: isCompleted ? 'Regenerate Launch Assets' : 'Generate Launch Kit & GTM Assets',
  };

  const label = actionLabel || defaultActionLabels[activeStage] || 'Run Stage Agent';

  return (
    <div className="border-b border-nexus-800/80 bg-nexus-900/80 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 w-full shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        {/* Stage Masthead & Context */}
        <div className="space-y-1.5 max-w-2xl min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono text-rose-400 font-semibold tracking-wider uppercase">
              Stage 0{currentStageConfig?.stepNumber} of 07
            </span>
            <div className="h-3 w-px bg-nexus-800 hidden xs:block" />
            <Badge
              variant={
                isCompleted
                  ? 'ruby'
                  : status === 'in_progress'
                  ? 'primary'
                  : status === 'needs_review'
                  ? 'amber'
                  : 'default'
              }
              dot
              className="text-[10px] sm:text-[11px] font-mono capitalize"
            >
              {isCompleted ? 'Locked' : status.replace('_', ' ')}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-nexus-100 tracking-tight break-words">
            {currentStageConfig?.label}
          </h1>

          <p className="text-xs sm:text-sm text-nexus-300 leading-relaxed font-sans">
            {currentStageConfig?.description}
          </p>
        </div>

        {/* Stage Navigation & Dominant Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-1 lg:pt-0">
          {/* Paired Prev / Next Segmented Control */}
          <div className="inline-flex items-center rounded-lg border border-nexus-800/80 bg-nexus-850/80 backdrop-blur-xs p-0.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={goToPreviousStage}
              disabled={activeStage === 'discover'}
              title="Previous Stage"
              className="h-8 px-2.5 text-xs text-nexus-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="h-3.5 w-px bg-nexus-800" />
            <button
              type="button"
              onClick={goToNextStage}
              disabled={activeStage === 'launch'}
              title="Next Stage"
              className="h-8 px-2.5 text-xs text-nexus-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Single Dominant Stage Action CTA */}
          <Button
            variant="glow"
            size="md"
            onClick={runCurrentStageAction}
            isLoading={isExecutingStage}
            disabled={actionDisabled}
            leftIcon={<Sparkles className="w-4 h-4 text-white" />}
            className="w-full sm:w-auto h-9 text-xs sm:text-sm px-4 rounded-lg"
          >
            {label}
          </Button>
        </div>
      </div>

      {/* Real-time execution progress indicator */}
      {isExecutingStage && (
        <div className="mt-4 pt-3 border-t border-nexus-800 flex items-center justify-between gap-3 text-xs font-mono text-nexus-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-nexus-200 truncate">{executionProgress || 'NEXUS cognitive synthesis in progress...'}</span>
          </div>
          <span className="text-[10px] text-rose-400 font-mono shrink-0 uppercase tracking-widest animate-pulse">Running</span>
        </div>
      )}
    </div>
  );
}
