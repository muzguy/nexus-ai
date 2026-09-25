'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Crosshair,
} from 'lucide-react';

export function ChallengeStage() {
  const {
    project,
    setActiveStage,
    selectPositioningDirection,
  } = useBrandProject();

  const positioning = project.positioning;
  const selectedDirection = project.selectedDirection;

  if (!positioning || positioning.directions.length === 0) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisite Missing"
          message="No positioning directions have been generated yet. Please generate positioning directions first."
        />
        <EmptyState
          icon={<Crosshair className="w-8 h-8 text-amber-500" />}
          title="Generate Positions First"
          description="Positioning directions must be synthesized before the Adversarial Critic can challenge and stress-test them."
          actionLabel="Go to Positioning Stage"
          onAction={() => setActiveStage('position')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Overview & Human Decision Notice */}
      <div className="p-4 sm:p-5 rounded-xl bg-nexus-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glow">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-500 dark:text-rose-400 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-mono font-semibold text-rose-500 dark:text-rose-300 uppercase tracking-wider">
                Adversarial Stress-Test & Human Decision Node
              </h3>
              <Badge variant="rose" className="text-[10px] font-mono">
                Stage 03 & 04
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-nexus-200 mt-1 leading-relaxed">
              Every direction has been audited for clichés, weak assumptions, and audience mismatch. Choose the single winning direction to anchor your brand identity, visual brief, and launch kit.
            </p>
          </div>
        </div>

        {selectedDirection && (
          <Button
            variant="glow"
            size="md"
            onClick={() => setActiveStage('shape')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full md:w-auto shrink-0 min-h-[44px] sm:min-h-[36px]"
          >
            Advance to Shape Stage
          </Button>
        )}
      </div>

      {/* Selected Direction Callout (if already selected) */}
      {selectedDirection && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                Human Selection Locked
              </span>
              <p className="text-sm font-bold text-nexus-100 dark:text-white">
                {selectedDirection.name} — &ldquo;{selectedDirection.taglineConcept}&rdquo;
              </p>
            </div>
          </div>
          <Badge variant="emerald" dot className="text-xs font-mono shrink-0">
            Active Strategic Anchor
          </Badge>
        </div>
      )}

      {/* 3 Directions with Adversarial Critique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {positioning.directions.map((direction, idx) => {
          const isSelected = selectedDirection?.id === direction.id;
          const critique = direction.critique;

          return (
            <Card
              key={direction.id}
              className={`flex flex-col h-full transition-all ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-glow bg-nexus-900'
                  : 'border-nexus-800 hover:border-nexus-700'
              }`}
            >
              {/* Header */}
              <CardHeader className="bg-nexus-950/70 pb-3">
                <div className="w-full min-w-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">
                      Vector 0{idx + 1}
                    </span>
                    <Badge
                      variant={
                        critique?.strategicViability === 'high'
                          ? 'emerald'
                          : critique?.strategicViability === 'moderate'
                          ? 'amber'
                          : 'rose'
                      }
                      className="text-[10px] font-mono capitalize"
                    >
                      {critique?.strategicViability.replace('_', ' ') || 'Audited'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg text-nexus-100 dark:text-white">
                    {direction.name}
                  </CardTitle>
                  <CardDescription className="text-nexus-400 text-xs mt-1">
                    {direction.archetype}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4 pt-4 text-xs">
                {/* Value prop snapshot */}
                <p className="text-nexus-300 leading-relaxed italic bg-nexus-950/40 p-2.5 rounded-lg border border-nexus-850">
                  &ldquo;{direction.valueProposition}&rdquo;
                </p>

                {/* Scores: Cliché Risk & Differentiation */}
                {critique && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-nexus-950/60 border border-nexus-850">
                    <div>
                      <span className="text-[10px] font-mono text-nexus-400 block mb-1">
                        Cliché Risk
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-base font-bold font-mono ${
                            critique.clicheRiskScore <= 3
                              ? 'text-emerald-500 dark:text-emerald-400'
                              : critique.clicheRiskScore <= 6
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-rose-500 dark:text-rose-400'
                          }`}
                        >
                          {critique.clicheRiskScore}
                        </span>
                        <span className="text-[10px] text-nexus-400 font-mono">/ 10</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-nexus-400 block mb-1">
                        Differentiation
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-base font-bold font-mono ${
                            critique.differentiationScore >= 7
                              ? 'text-emerald-500 dark:text-emerald-400'
                              : critique.differentiationScore >= 5
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-rose-500 dark:text-rose-400'
                          }`}
                        >
                          {critique.differentiationScore}
                        </span>
                        <span className="text-[10px] text-nexus-400 font-mono">/ 10</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adversarial Critique Details */}
                {critique && (
                  <div className="space-y-3">
                    {/* Cliché notes */}
                    <div>
                      <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                        Critic Analysis
                      </span>
                      <p className="text-nexus-300 leading-relaxed">
                        {critique.clicheNotes}
                      </p>
                    </div>

                    {/* Weak Assumptions */}
                    {critique.weakAssumptions.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Weak Assumptions
                        </span>
                        <ul className="space-y-1 text-nexus-300">
                          {critique.weakAssumptions.map((wa, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{wa}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Overall Verdict */}
                    <div className="p-3 rounded-lg bg-nexus-850/80 border border-nexus-800">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                        Adversarial Verdict
                      </span>
                      <p className="text-nexus-200 leading-relaxed font-medium">
                        {critique.challengeVerdict}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Human Selection Button */}
              <CardFooter className="pt-3">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="md"
                  className="w-full text-xs min-h-[44px]"
                  onClick={() => selectPositioningDirection(direction)}
                  leftIcon={
                    isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    )
                  }
                >
                  {isSelected ? 'Winning Direction Selected' : 'Choose This Strategic Path'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
