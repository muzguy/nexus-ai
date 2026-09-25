'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { AppHeader } from '@/components/layout/app-header';
import { WorkflowSidebar } from '@/components/layout/workflow-sidebar';
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
  const { activeStage, error } = useBrandProject();

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
    <div className="min-h-screen bg-nexus-950 flex flex-col">
      {/* Top Application Header */}
      <AppHeader />

      {/* Main Workflow Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workflow Progression Sidebar */}
        <WorkflowSidebar />

        {/* Central Workspace Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-nexus-950/40">
          <StageHeader />

          {error && (
            <div className="px-6 pt-6 max-w-7xl mx-auto w-full">
              <AlertBanner
                variant="danger"
                title="Stage Execution Error"
                message={error}
              />
            </div>
          )}

          <div className="flex-1 pb-16">
            {renderActiveStageWorkspace()}
          </div>
        </main>
      </div>
    </div>
  );
}
