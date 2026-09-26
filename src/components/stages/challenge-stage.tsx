'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import { cn } from '@/lib/utils';
import {
  Swords,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Crosshair,
  Scale,
  Zap,
  Target,
  LayoutGrid,
  Columns3,
  Flame,
  ShieldCheck,
} from 'lucide-react';

export function ChallengeStage() {
  const {
    project,
    setActiveStage,
    selectPositioningDirection,
  } = useBrandProject();

  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

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
          description="Positioning directions must be synthesized before the Brand Battle and Adversarial Critic can challenge and compare them."
          actionLabel="Go to Positioning Stage"
          onAction={() => setActiveStage('position')}
        />
      </div>
    );
  }

  // Vector accents for visual distinction
  const vectorAccents = [
    {
      badge: 'text-nexus-300',
      border: 'border-nexus-700',
      bgTag: 'bg-nexus-850',
      tagText: 'Vector 01',
    },
    {
      badge: 'text-rose-400',
      border: 'border-rose-500/30',
      bgTag: 'bg-rose-500/10',
      tagText: 'Vector 02',
    },
    {
      badge: 'text-nexus-300',
      border: 'border-nexus-700',
      bgTag: 'bg-nexus-850',
      tagText: 'Vector 03',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border animate-fadeIn">
      {/* 1. BRAND BATTLE COMMAND HEADER */}
      <div className="p-4 sm:p-6 rounded-2xl bg-nexus-900 border border-nexus-800 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-xs">
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
            <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
                BRAND BATTLE
              </span>
              <Badge variant="ruby" className="text-[10px] font-mono uppercase">
                Stage 03 · Strategic Decision Node
              </Badge>
              {selectedDirection && (
                <Badge variant="ruby" dot className="text-[10px] font-mono">
                  Anchor Locked
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-nexus-100 dark:text-white tracking-tight break-words">
              Three strategic paths. One direction to build.
            </h1>
            <p className="text-xs sm:text-sm text-nexus-300 max-w-3xl leading-relaxed font-sans">
              Every direction has been synthesized for strategic divergence and stress-tested by the Adversarial Critic. 
              The direction you choose becomes the binding strategic anchor for your Brand Identity, Visual Design System, Consistency Guardian, and Launch Kit.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* View mode toggle: Detailed Cards vs Comparison Matrix */}
          <div className="inline-flex rounded-lg bg-nexus-950/80 p-0.5 border border-nexus-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn(
                'px-2.5 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer',
                viewMode === 'cards'
                  ? 'bg-nexus-850 text-nexus-100 dark:text-white font-semibold shadow-xs'
                  : 'text-nexus-400 hover:text-nexus-200'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>3 Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={cn(
                'px-2.5 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer',
                viewMode === 'matrix'
                  ? 'bg-nexus-850 text-nexus-100 dark:text-white font-semibold shadow-xs'
                  : 'text-nexus-400 hover:text-nexus-200'
              )}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
          </div>

          {selectedDirection && (
            <Button
              variant="glow"
              size="md"
              onClick={() => setActiveStage('shape')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] text-xs font-semibold"
            >
              Advance to Shape Stage
            </Button>
          )}
        </div>
      </div>

      {/* 2. COGNITIVE PIPELINE TRAIL (Positioning -> AI Critique -> Human Decision) */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-nexus-950/60 border border-nexus-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-nexus-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-nexus-300 font-semibold flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            1. Positioning Divergence
          </span>
          <span className="text-nexus-600">→</span>
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            2. Adversarial AI Critique
          </span>
          <span className="text-nexus-600">→</span>
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            3. Human Decision Node
          </span>
        </div>
        <span className="text-[11px] text-nexus-500">
          Human-in-the-Loop Strategic Checkpoint
        </span>
      </div>

      {/* 3. SELECTED DIRECTION CONFIRMATION & DOWNSTREAM CONTINUITY */}
      {selectedDirection && (
        <div className="p-4 sm:p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                  Active Strategic Anchor Locked
                </span>
                <p className="text-sm sm:text-base font-bold text-nexus-100 dark:text-white truncate">
                  {selectedDirection.name} — &ldquo;{selectedDirection.taglineConcept}&rdquo;
                </p>
              </div>
            </div>
            <Badge variant="ruby" dot className="text-xs font-mono shrink-0 self-start sm:self-auto">
              Strategic Anchor
            </Badge>
          </div>

          {/* Downstream continuity trail */}
          <div className="pt-2 border-t border-rose-500/20 text-xs">
            <span className="text-[10px] font-mono uppercase text-nexus-400 block mb-1.5 font-semibold">
              Downstream Strategic Flow:
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                {selectedDirection.name}
              </span>
              <span className="text-rose-400">↓</span>
              <span className="px-2 py-0.5 rounded bg-nexus-900 border border-nexus-800 text-nexus-300">
                Shape (Personality &amp; Naming)
              </span>
              <span className="text-nexus-500">↓</span>
              <span className="px-2 py-0.5 rounded bg-nexus-900 border border-nexus-800 text-nexus-300">
                Visualize (Design System)
              </span>
              <span className="text-nexus-500">↓</span>
              <span className="px-2 py-0.5 rounded bg-nexus-900 border border-nexus-800 text-nexus-300">
                Guardian (Integrity Audit)
              </span>
              <span className="text-nexus-500">↓</span>
              <span className="px-2 py-0.5 rounded bg-nexus-900 border border-nexus-800 text-nexus-300">
                Launch (GTM Kit)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4A. VIEW MODE: 3 STRATEGIC DIRECTION CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {positioning.directions.map((direction, idx) => {
            const isSelected = selectedDirection?.id === direction.id;
            const critique = direction.critique;
            const accent = vectorAccents[idx % vectorAccents.length];

            return (
              <Card
                key={direction.id}
                className={cn(
                  'flex flex-col h-full transition-all duration-150',
                  isSelected
                    ? 'border-rose-600/50 ring-1 ring-rose-500/30 bg-rose-950/15 shadow-xs'
                    : 'border-nexus-800 hover:border-nexus-700'
                )}
              >
                {/* Header */}
                <CardHeader className="bg-nexus-950/70 pb-3 border-b border-nexus-800/60">
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-[11px] font-mono font-semibold uppercase', accent.badge)}>
                          {accent.tagText}
                        </span>
                        <WhyThis
                          stageBadge={`Stage 03 · ${accent.tagText}`}
                          title={`Why ${direction.name}?`}
                          decision={`${direction.name} (${direction.archetype})`}
                          decisionSubtitle={`"${direction.taglineConcept}"`}
                          inputs={[
                            { label: 'Target Segment Focus', value: direction.targetSegment },
                            { label: 'Core Problem Solved', value: project.discovery?.problem.coreProblem || 'Discovered need' },
                            ...(project.discovery?.audience.painPoints?.length
                              ? [{ label: 'Primary Pain Point', value: project.discovery.audience.painPoints[0] }]
                              : []),
                          ]}
                          reasoning={`Engineered to deliver: "${direction.valueProposition}". Establishes an asymmetric structural moat through ${direction.competitiveMoat.toLowerCase()}, anchored on ${direction.keyDifferentiator.toLowerCase()}.`}
                          tradeoff={direction.strategicTradeoff}
                          consideration={critique?.challengeVerdict || critique?.clicheNotes}
                          triggerVariant="compact"
                        />
                      </div>

                      {critique ? (
                        <Badge
                          variant={
                            critique.strategicViability === 'high'
                              ? 'emerald'
                              : critique.strategicViability === 'moderate'
                              ? 'amber'
                              : 'rose'
                          }
                          className="text-[10px] font-mono capitalize"
                        >
                          {critique.strategicViability.replace('_', ' ')}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-[10px] font-mono">
                          Audited
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-base sm:text-lg text-nexus-100 dark:text-white">
                      {direction.name}
                    </CardTitle>
                    <CardDescription className="text-nexus-400 font-mono text-xs mt-0.5">
                      Character: {direction.archetype}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 pt-4 text-xs">
                  {/* Core Philosophy & Value Proposition */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block font-semibold">
                      Core Strategic Philosophy
                    </span>
                    <p className="text-nexus-100 dark:text-white font-medium italic bg-nexus-950/60 p-2.5 rounded-lg border border-nexus-850 leading-relaxed">
                      &ldquo;{direction.taglineConcept}&rdquo;
                    </p>
                    <p className="text-nexus-300 leading-relaxed pt-1">
                      {direction.valueProposition}
                    </p>
                  </div>

                  {/* Target Audience Fit */}
                  <div className="space-y-1 pt-1 border-t border-nexus-850">
                    <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-accent-cyan" />
                      Target Audience Fit
                    </span>
                    <p className="text-nexus-200 leading-relaxed">
                      {direction.targetSegment}
                    </p>
                  </div>

                  {/* Primary Advantage & Competitive Moat */}
                  <div className="space-y-1 pt-1 border-t border-nexus-850">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-accent-cyan" />
                      Primary Advantage &amp; Moat
                    </span>
                    <p className="text-nexus-200 leading-relaxed">
                      {direction.competitiveMoat}
                    </p>
                    <p className="text-[11px] font-mono text-nexus-400 pt-0.5">
                      <strong className="text-nexus-300">Differentiator: </strong>
                      {direction.keyDifferentiator}
                    </p>
                  </div>

                  {/* Main Tradeoff / What is Sacrificed */}
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <Scale className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                      Deliberate Strategic Sacrifice
                    </span>
                    <p className="text-rose-700 dark:text-rose-200/90 leading-relaxed">
                      {direction.strategicTradeoff}
                    </p>
                  </div>

                  {/* Adversarial AI Critique Section */}
                  <div className="pt-2 border-t border-nexus-850 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        Adversarial AI Stress-Test
                      </span>
                      {critique && (
                        <span className="text-[10px] font-mono text-nexus-400">
                          Diff: {critique.differentiationScore}/10 | Cliché: {critique.clicheRiskScore}/10
                        </span>
                      )}
                    </div>

                    {critique ? (
                      <div className="space-y-2">
                        {/* Critic notes */}
                        <p className="text-nexus-300 leading-relaxed text-[11px] bg-nexus-950/40 p-2 rounded border border-nexus-850">
                          {critique.clicheNotes}
                        </p>

                        {/* Weak Assumptions */}
                        {critique.weakAssumptions.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              Key Vulnerable Assumption:
                            </span>
                            <p className="text-[11px] text-nexus-300 italic pl-2 border-l border-amber-500/30">
                              {critique.weakAssumptions[0]}
                            </p>
                          </div>
                        )}

                        {/* Challenge verdict */}
                        <div className="p-2.5 rounded-lg bg-nexus-850/80 border border-nexus-800 text-[11px]">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-0.5">
                            Adversarial Verdict:
                          </span>
                          <p className="text-nexus-200 leading-snug font-medium">
                            {critique.challengeVerdict}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-nexus-950/40 border border-nexus-850 text-nexus-400 text-center font-mono text-[11px]">
                        Adversarial critique pending execution
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Human Selection Button */}
                <CardFooter className="pt-3 border-t border-nexus-850 bg-nexus-950/40">
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="md"
                    className={cn(
                      'w-full text-xs min-h-[44px] transition-all font-semibold',
                      isSelected
                        ? 'bg-gradient-to-r from-[#7F1D1D] via-[#BE123C] to-[#E11D48] text-white border-rose-400/40 shadow-sm'
                        : 'hover:border-nexus-700'
                    )}
                    onClick={() => selectPositioningDirection(direction)}
                    aria-pressed={isSelected}
                    leftIcon={
                      isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      )
                    }
                  >
                    {isSelected ? 'Selected direction' : 'Choose this direction'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4B. VIEW MODE: COMPARISON MATRIX */}
      {viewMode === 'matrix' && (
        <Card className="border-nexus-800 overflow-hidden">
          <CardHeader className="bg-nexus-950/80 border-b border-nexus-800 pb-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Columns3 className="w-4 h-4 text-accent-cyan" />
                  Strategic Tradeoff Comparison Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Direct side-by-side comparison across audience, moat, character, and deliberate sacrifices.
                </CardDescription>
              </div>
              <Badge variant="cyan" className="text-[10px] font-mono">
                Qualitative Analysis
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-nexus-800 bg-nexus-950/90 text-nexus-300 font-mono text-[11px]">
                  <th className="p-3.5 w-1/4 uppercase tracking-wider font-semibold text-nexus-400">
                    Dimension
                  </th>
                  {positioning.directions.map((dir, idx) => {
                    const isSelected = selectedDirection?.id === dir.id;
                    const accent = vectorAccents[idx % vectorAccents.length];

                    return (
                      <th
                        key={dir.id}
                        className={cn(
                          'p-3.5 w-1/4 font-semibold transition-colors',
                          isSelected
                            ? 'bg-emerald-500/10 text-emerald-400 border-x border-emerald-500/30'
                            : 'text-nexus-100 dark:text-white'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={cn('text-[10px] font-mono uppercase', accent.badge)}>
                            Vector 0{idx + 1}
                          </span>
                          {isSelected && (
                            <Badge variant="emerald" dot className="text-[9px] font-mono">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <div className="font-bold text-sm tracking-tight">{dir.name}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-800/80">
                {/* Row: Character & Archetype */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Personality Character
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-200 font-medium',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.archetype}
                    </td>
                  ))}
                </tr>

                {/* Row: Core Philosophy */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Core Transformation
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-200 leading-relaxed',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      <span className="italic block mb-1 font-medium text-nexus-100 dark:text-white">
                        &ldquo;{dir.taglineConcept}&rdquo;
                      </span>
                      {dir.valueProposition}
                    </td>
                  ))}
                </tr>

                {/* Row: Target Audience Fit */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Target Buyer Segment
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-200 leading-relaxed',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.targetSegment}
                    </td>
                  ))}
                </tr>

                {/* Row: Advantage / Moat */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Competitive Moat
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-200 leading-relaxed',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.competitiveMoat}
                    </td>
                  ))}
                </tr>

                {/* Row: Differentiator */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Key Differentiator
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-200 leading-relaxed',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.keyDifferentiator}
                    </td>
                  ))}
                </tr>

                {/* Row: Strategic Sacrifice */}
                <tr className="hover:bg-nexus-900/40 bg-rose-500/5">
                  <td className="p-3.5 font-mono text-rose-500 dark:text-rose-400 font-semibold">
                    Intentional Sacrifice
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-rose-700 dark:text-rose-200/90 leading-relaxed font-medium',
                        selectedDirection?.id === dir.id && 'bg-rose-500/10 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.strategicTradeoff}
                    </td>
                  ))}
                </tr>

                {/* Row: Adversarial Verdict */}
                <tr className="hover:bg-nexus-900/40">
                  <td className="p-3.5 font-mono text-nexus-400 font-medium">
                    Critic Verdict
                  </td>
                  {positioning.directions.map((dir) => (
                    <td
                      key={dir.id}
                      className={cn(
                        'p-3.5 text-nexus-300 leading-relaxed text-[11px]',
                        selectedDirection?.id === dir.id && 'bg-emerald-500/5 border-x border-emerald-500/20'
                      )}
                    >
                      {dir.critique ? (
                        <div>
                          <Badge
                            variant={
                              dir.critique.strategicViability === 'high'
                                ? 'emerald'
                                : dir.critique.strategicViability === 'moderate'
                                ? 'amber'
                                : 'rose'
                            }
                            className="text-[9px] font-mono mb-1 capitalize"
                          >
                            Viability: {dir.critique.strategicViability.replace('_', ' ')}
                          </Badge>
                          <p className="line-clamp-3 text-nexus-200">{dir.critique.challengeVerdict}</p>
                        </div>
                      ) : (
                        <span className="text-nexus-500 font-mono">Pending critique</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: Selection Action */}
                <tr className="bg-nexus-950/90">
                  <td className="p-3.5 font-mono text-nexus-400 font-semibold">
                    Action
                  </td>
                  {positioning.directions.map((dir) => {
                    const isSelected = selectedDirection?.id === dir.id;

                    return (
                      <td
                        key={dir.id}
                        className={cn(
                          'p-3.5',
                          isSelected && 'bg-rose-500/10 border-x border-rose-500/30'
                        )}
                      >
                        <Button
                          variant={isSelected ? 'primary' : 'outline'}
                          size="sm"
                          className={cn(
                            'w-full text-xs min-h-[38px] font-semibold',
                            isSelected
                              ? 'bg-gradient-to-r from-[#7F1D1D] via-[#BE123C] to-[#E11D48] text-white border-rose-400/40 shadow-sm'
                              : 'hover:border-nexus-700'
                          )}
                          onClick={() => selectPositioningDirection(dir)}
                          aria-pressed={isSelected}
                          leftIcon={
                            isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            )
                          }
                        >
                          {isSelected ? 'Selected direction' : 'Choose this direction'}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
