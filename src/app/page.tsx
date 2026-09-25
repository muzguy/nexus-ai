'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { AppHeader } from '@/components/layout/app-header';
import { WorkflowSidebar } from '@/components/layout/workflow-sidebar';
import { MobileWorkflowNav } from '@/components/layout/mobile-workflow-nav';
import { StageHeader } from '@/components/layout/stage-header';
import { DiscoverStage } from '@/components/stages/discover-stage';
import { PositionStage } from '@/components/stages/position-stage';
import { ChallengeStage } from '@/components/stages/challenge-stage';
import { ShapeStage } from '@/components/stages/shape-stage';
import { VisualizeStage } from '@/components/stages/visualize-stage';
import { ConsistencyStage } from '@/components/stages/consistency-stage';
import { LaunchStage } from '@/components/stages/launch-stage';
import { AlertBanner } from '@/components/ui/alert-banner';

export default function NexusWorkspacePage() {
  const { activeStage, error, clearError, runCurrentStageAction } = useBrandProject();

  const renderActiveStageWorkspace = () => {
    switch (activeStage) {
      case 'discover':
        return <DiscoverStage />;
      case 'position':
        return <PositionStage />;
      case 'challenge':
        return <ChallengeStage />;
      case 'shape':
        return <ShapeStage />;
      case 'visualize':
        return <VisualizeStage />;
      case 'consistency':
        return <ConsistencyStage />;
      case 'launch':
        return <LaunchStage />;
      default:
        return <DiscoverStage />;
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col w-full overflow-x-hidden">
      {/* Top Application Header */}
      <AppHeader />

      {/* Mobile-only compact workflow navigation */}
      <MobileWorkflowNav />

      {/* Main Workflow Shell */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left Workflow Progression Sidebar (desktop) */}
        <WorkflowSidebar />

        {/* Central Workspace Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-nexus-950/40 w-full min-w-0">
          <StageHeader />

          {error && (
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 max-w-7xl mx-auto w-full">
              <AlertBanner
                variant="danger"
                title="Stage Execution Error"
                message={error}
                action={{
                  label: 'Retry',
                  onClick: runCurrentStageAction,
                }}
                onDismiss={clearError}
              />
            </div>
          )}

          <div className="flex-1 pb-16 w-full">
            {renderActiveStageWorkspace()}
          </div>
        </main>
      </div>
    </div>
  );
}
