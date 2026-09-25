'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Users,
  Target,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Compass,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function DiscoverStage() {
  const { project, updateIdea, runCurrentStageAction, isExecutingStage, setActiveStage } = useBrandProject();
  const discovery = project.discovery;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Step 1: Raw Idea Input Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Compass className="w-4 h-4 text-indigo-400" />
              Foundational Idea & Parameters
            </CardTitle>
            <CardDescription>
              Provide the raw essence of your startup, product, or creator project. NEXUS will deconstruct it into structured strategic intelligence.
            </CardDescription>
          </div>
          <Badge variant="cyan" dot className="font-mono text-[11px]">
            Input Layer
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Product / Concept Name"
              placeholder="e.g. Aether OS, Nexus, Lumina"
              value={project.idea.title}
              onChange={(e) => updateIdea({ title: e.target.value })}
            />
            <Input
              label="Target Market / Audience Clues"
              placeholder="e.g. Technical founders, design engineers, creator studios"
              value={project.idea.targetMarketNotes || ''}
              onChange={(e) => updateIdea({ targetMarketNotes: e.target.value })}
            />
          </div>

          <Textarea
            label="Raw Concept & Value Proposition"
            hint="Describe what it does, why it exists, and who it helps"
            placeholder="e.g. An autonomous brand intelligence platform that turns messy thoughts into living design and narrative architectures..."
            rows={3}
            value={project.idea.rawConcept}
            onChange={(e) => updateIdea({ rawConcept: e.target.value })}
          />

          <Textarea
            label="Founder Context & Personal Conviction (Optional)"
            hint="Unfair advantages, backstory, or unique philosophical beliefs"
            placeholder="e.g. Built by ex-design leads frustrated with generic AI templates..."
            rows={2}
            value={project.idea.founderContext || ''}
            onChange={(e) => updateIdea({ founderContext: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Step 2: Structured Discovery Output */}
      {!discovery ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-indigo-400" />}
          title="Discovery Intelligence Uninitialized"
          description="Click 'Synthesize Discovery Intelligence' above or below to deconstruct your raw concept into target audience profiles, problem space dynamics, and strategic constraints."
          actionLabel="Synthesize Discovery Intelligence"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      ) : (
        <div className="space-y-6">
          {/* Executive Discovery Summary */}
          <div className="p-5 rounded-xl bg-nexus-900/90 border border-indigo-500/30 shadow-glow relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-glow-cyan" />
              <h4 className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">
                Discovery Synthesis Summary
              </h4>
            </div>
            <p className="text-sm text-nexus-100 leading-relaxed font-sans">
              {discovery.summary}
            </p>
          </div>

          {/* 4-Column Grid: Audience, Problem, Goals, Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Audience Profile */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Users className="w-4 h-4 text-accent-cyan" />
                  Audience Profile
                </CardTitle>
                <Badge variant="cyan" className="text-[10px] font-mono">
                  Segment
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Primary Persona
                  </span>
                  <p className="text-sm font-semibold text-nexus-100 dark:text-white">
                    {discovery.audience.primarySegment}
                  </p>
                  {discovery.audience.secondarySegment && (
                    <p className="text-xs text-nexus-400 mt-0.5">
                      Secondary: {discovery.audience.secondarySegment}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1.5">
                    Critical Pain Points
                  </span>
                  <ul className="space-y-1.5 text-xs text-nexus-300">
                    {discovery.audience.painPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1.5">
                    Core Desires & Urgency
                  </span>
                  <ul className="space-y-1.5 text-xs text-nexus-300">
                    {discovery.audience.desires.map((desire, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{desire}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Problem Space */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Problem Space & Market Failure
                </CardTitle>
                <Badge variant="amber" className="text-[10px] font-mono">
                  Friction
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    The Core Problem
                  </span>
                  <p className="text-xs text-nexus-200 leading-relaxed">
                    {discovery.problem.coreProblem}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Why Incumbents & Current Tools Fail
                  </span>
                  <p className="text-xs text-nexus-300 leading-relaxed bg-nexus-950/60 p-3 rounded-lg border border-nexus-850">
                    {discovery.problem.marketFailure}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1.5">
                    Sub-Optimal Workarounds Today
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {discovery.problem.currentWorkarounds.map((w, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-nexus-850 border border-nexus-800 text-nexus-300"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Goals & Metric */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Target className="w-4 h-4 text-emerald-400" />
                  Goals & Category Vision
                </CardTitle>
                <Badge variant="emerald" className="text-[10px] font-mono">
                  Trajectory
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Immediate Launch Milestone
                  </span>
                  <p className="text-xs text-nexus-200">
                    {discovery.goals.immediateLaunchGoal}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    Long-Term Category Vision
                  </span>
                  <p className="text-xs text-nexus-200">
                    {discovery.goals.longTermVision}
                  </p>
                </div>

                <div className="pt-2 border-t border-nexus-800/60">
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                    North Star Brand Metric
                  </span>
                  <span className="text-xs font-mono font-medium text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 inline-block">
                    {discovery.goals.keyMetric}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Constraints & Non-Negotiables */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Constraints & Non-Negotiables
                </CardTitle>
                <Badge variant="rose" className="text-[10px] font-mono">
                  Guardrails
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1.5">
                    Mandatory Non-Negotiables
                  </span>
                  <ul className="space-y-1.5 text-xs text-nexus-300">
                    {discovery.constraints.nonNegotiables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {discovery.constraints.budgetOrResourceLimits && (
                  <div>
                    <span className="text-[11px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                      Resource Context
                    </span>
                    <p className="text-xs text-nexus-300">
                      {discovery.constraints.budgetOrResourceLimits}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Open Questions */}
          <Card>
            <CardHeader>
              <CardTitle>
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Strategic Open Questions & Working Hypotheses
              </CardTitle>
              <Badge variant="primary" className="text-[10px] font-mono">
                Reasoning Log
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discovery.openQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold text-nexus-100 dark:text-white leading-snug">
                        {q.question}
                      </p>
                      <Badge
                        variant={q.status === 'validated' ? 'emerald' : 'amber'}
                        className="text-[10px] uppercase font-mono shrink-0"
                      >
                        {q.status}
                      </Badge>
                    </div>
                    {q.hypothesis && (
                      <div className="text-xs text-nexus-400 bg-nexus-900/60 p-2 rounded border border-nexus-850">
                        <span className="text-nexus-500 font-mono">Hypothesis: </span>
                        {q.hypothesis}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage Completion & Advance Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-nexus-900/90 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Discovery Phase Validated
                </h4>
                <p className="text-xs text-nexus-300">
                  Core concept and audience parameters synthesized. Ready to generate 3 strategic positioning directions.
                </p>
              </div>
            </div>
            <Button
              variant="glow"
              size="md"
              onClick={() => setActiveStage('position')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-[36px]"
            >
              Continue to Position Stage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
