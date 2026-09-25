'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './theme-toggle';
import { RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';

export function AppHeader() {
  const { project, resetToEmptyProject, loadSampleProject } = useBrandProject();

  const completedStagesCount = Object.values(project.stageStatus).filter(
    (status) => status === 'completed'
  ).length;

  return (
    <header className="h-14 sm:h-16 border-b border-nexus-800 bg-nexus-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-accent-violet to-accent-cyan flex items-center justify-center shadow-glow shrink-0">
            <span className="text-white font-black text-xs sm:text-sm tracking-wider font-mono">NX</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-nexus-100 dark:text-white tracking-wider text-sm sm:text-base">NEXUS</span>
              <Badge variant="cyan" className="text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 uppercase font-mono hidden xs:inline-flex">
                Brand Intelligence
              </Badge>
            </div>
            <p className="text-[10px] sm:text-[11px] text-nexus-400 font-mono tracking-tight -mt-0.5 hidden md:block">
              Multi-Stage Autonomous Brand Architecture
            </p>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-nexus-800 hidden lg:block" />

        {/* Active Project Pill */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-nexus-400 font-mono">PROJECT:</span>
          <span className="text-xs font-semibold text-nexus-100 dark:text-white px-2 py-0.5 rounded bg-nexus-850 border border-nexus-800 max-w-[160px] truncate">
            {project.idea.title || project.name || 'Untitled Brand System'}
          </span>
          {completedStagesCount === 7 ? (
            <Badge variant="emerald" dot className="text-[11px]">
              Ready
            </Badge>
          ) : (
            <Badge variant="primary" className="text-[11px]">
              {completedStagesCount}/7 Done
            </Badge>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={loadSampleProject}
          leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent-cyan" />}
          title="Load pre-synthesized Aether OS brand system"
          className="h-8 px-2 sm:px-3 text-xs"
        >
          <span className="hidden sm:inline">Sample: </span>Aether OS
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetToEmptyProject}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-nexus-400" />}
          title="Start fresh with a clean slate"
          className="h-8 px-2 sm:px-3 text-xs"
        >
          <span className="hidden sm:inline">New Project</span>
        </Button>

        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        <div className="h-5 w-[1px] bg-nexus-800 hidden xl:block" />

        <div className="hidden xl:flex items-center gap-1.5 text-xs text-nexus-400 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Cognitive Graph v1.0</span>
        </div>
      </div>
    </header>
  );
}
