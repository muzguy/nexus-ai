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
    <div className="border-b border-nexus-800 bg-nexus-900 p-4 sm:p-6 lg:p-8 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        {/* Stage Title and Context */}
        <div className="space-y-1.5 max-w-2xl min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              Stage 0{currentStageConfig?.stepNumber} / 07
            </span>
            <div className="h-3 w-[1px] bg-nexus-800 hidden xs:block" />
            <Badge
              variant={
                isCompleted
                  ? 'emerald'
                  : status === 'in_progress'
                  ? 'primary'
                  : status === 'needs_review'
                  ? 'amber'
                  : 'default'
              }
              dot
              className="text-[10px] sm:text-[11px] font-mono capitalize"
            >
              {status.replace('_', ' ')}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-nexus-100 dark:text-white tracking-tight break-words">
            {currentStageConfig?.label}
          </h1>

          <p className="text-xs sm:text-sm text-nexus-300 leading-relaxed">
            {currentStageConfig?.description}
          </p>
        </div>

        {/* Stage Actions Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={goToPreviousStage}
              disabled={activeStage === 'discover'}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              title="Previous Stage"
              className="flex-1 sm:flex-initial h-10 sm:h-9 text-xs"
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={goToNextStage}
              disabled={activeStage === 'launch'}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              title="Next Stage"
              className="flex-1 sm:flex-initial h-10 sm:h-9 text-xs"
            >
              Next
            </Button>
          </div>

          <Button
            variant="glow"
            size="md"
            onClick={runCurrentStageAction}
            isLoading={isExecutingStage}
            disabled={actionDisabled}
            leftIcon={<Sparkles className="w-4 h-4 text-white" />}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] text-xs sm:text-sm px-4"
          >
            {label}
          </Button>
        </div>
      </div>

      {/* Real-time execution progress indicator */}
      {isExecutingStage && (
        <div className="mt-4 p-3 rounded-xl bg-nexus-900 border border-emerald-500/30 flex items-center gap-3 text-xs text-nexus-200 font-mono shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="break-words min-w-0">{executionProgress || 'NEXUS cognitive synthesis in progress...'}</span>
        </div>
      )}
    </div>
  );
}
