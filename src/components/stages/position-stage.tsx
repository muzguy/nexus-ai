'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { Crosshair, ArrowRight, ShieldCheck, Scale, Zap, Compass } from 'lucide-react';

export function PositionStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const positioning = project.positioning;
  const hasDiscovery = Boolean(project.discovery);

  if (!hasDiscovery) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <AlertBanner
          variant="warning"
          title="Prerequisite Missing"
          message="Positioning directions must be synthesized from structured discovery data. Please complete the Discover stage first."
        />
        <EmptyState
          icon={<Compass className="w-8 h-8 text-amber-400" />}
          title="Discovery Data Required"
          description="Return to Stage 1 (Discover) to define your core product concept and audience dynamics."
          actionLabel="Go to Discover Stage"
          onAction={() => setActiveStage('discover')}
        />
      </div>
    );
  }

  if (!positioning || positioning.directions.length === 0) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={<Crosshair className="w-8 h-8 text-indigo-400" />}
          title="Positioning Directions Uninitialized"
          description="NEXUS will generate 3 strategically divergent market vectors based on your discovery findings, with distinct value propositions, competitive moats, and explicit trade-offs."
          actionLabel="Generate 3 Positioning Directions"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Strategic Rationale Banner */}
      <div className="p-5 rounded-xl bg-nexus-900/90 border border-indigo-500/30 flex items-start gap-4 shadow-glow">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-accent-cyan">
          <Crosshair className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider mb-1">
            Strategic Divergence Thesis
          </h3>
          <p className="text-sm text-nexus-200 leading-relaxed font-sans">
            {positioning.rationale}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setActiveStage('challenge')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Challenge Stage
        </Button>
      </div>

      {/* 3 Strategically Divergent Directions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {positioning.directions.map((direction, idx) => {
          const isSelected = project.selectedDirection?.id === direction.id;

          return (
            <Card
              key={direction.id}
              className={`flex flex-col h-full border ${
                isSelected ? 'border-accent-cyan ring-1 ring-accent-cyan shadow-glow-cyan' : 'border-nexus-800'
              }`}
            >
              <CardHeader className="bg-nexus-950/60 pb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">
                      Vector 0{idx + 1}
                    </span>
                    {isSelected && (
                      <Badge variant="cyan" dot className="text-[10px] font-mono">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white">
                    {direction.name}
                  </CardTitle>
                  <CardDescription className="text-nexus-400 font-mono text-[11px] mt-1">
                    {direction.archetype}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4 pt-4">
                {/* Tagline concept */}
                <div className="p-3 rounded-lg bg-nexus-950/70 border border-nexus-850">
                  <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Concept Tagline
                  </span>
                  <p className="text-xs font-medium text-white italic">
                    &ldquo;{direction.taglineConcept}&rdquo;
                  </p>
                </div>

                {/* Value Proposition */}
                <div>
                  <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Value Proposition
                  </span>
                  <p className="text-xs text-nexus-200 leading-relaxed">
                    {direction.valueProposition}
                  </p>
                </div>

                {/* Target Segment */}
                <div>
                  <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Target Segment Focus
                  </span>
                  <p className="text-xs text-nexus-300">
                    {direction.targetSegment}
                  </p>
                </div>

                {/* Competitive Moat */}
                <div>
                  <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-accent-cyan" />
                    Competitive Moat
                  </span>
                  <p className="text-xs text-nexus-200">
                    {direction.competitiveMoat}
                  </p>
                </div>

                {/* Strategic Trade-Off */}
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                  <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Scale className="w-3 h-3 text-rose-400" />
                    Strategic Sacrifice / Trade-off
                  </span>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {direction.strategicTradeoff}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveStage('challenge')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Stress-Test & Critique
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
