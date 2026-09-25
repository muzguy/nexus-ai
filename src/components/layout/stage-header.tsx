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
    <div className="border-b border-nexus-800/80 bg-nexus-900/40 backdrop-blur-sm p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Stage Title and Context */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
              Stage 0{currentStageConfig?.stepNumber} / 07
            </span>
            <div className="h-3 w-[1px] bg-nexus-800" />
            <Badge
              variant={
                isCompleted
                  ? 'emerald'
                  : status === 'in_progress'
                  ? 'cyan'
                  : status === 'needs_review'
                  ? 'amber'
                  : 'default'
              }
              dot
              className="text-[11px] font-mono capitalize"
            >
              {status.replace('_', ' ')}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {currentStageConfig?.label}
          </h1>

          <p className="text-sm text-nexus-300 leading-relaxed">
            {currentStageConfig?.description}
          </p>
        </div>

        {/* Stage Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStage}
              disabled={activeStage === 'discover'}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              title="Previous Stage"
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextStage}
              disabled={activeStage === 'launch'}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              title="Next Stage"
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
          >
            {label}
          </Button>
        </div>
      </div>

      {/* Real-time execution progress indicator */}
      {isExecutingStage && (
        <div className="mt-4 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-200 font-mono animate-pulse">
          <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-glow-cyan animate-ping" />
          <span>{executionProgress || 'Processing stage intelligence...'}</span>
        </div>
      )}
    </div>
  );
}
