'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import { ListenButton } from '@/components/ui/listen-button';
import {
  Crosshair,
  ArrowRight,
  Scale,
  Zap,
  Compass,
  CheckCircle2,
  ChevronRight,
  Target,
  Sparkles,
  Columns3,
} from 'lucide-react';
import { PositioningDirection } from '@/types/positioning';

export function PositionStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
    selectPositioningDirection,
  } = useBrandProject();

  const positioning = project.positioning;
  const hasDiscovery = Boolean(project.discovery);

  // Local state for active vector focus
  const [focusedId, setFocusedId] = useState<string>('');
  // Selected dimension index for mobile comparison view
  const [mobileDimensionIdx, setMobileDimensionIdx] = useState<number>(0);

  if (!hasDiscovery) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisite Missing"
          message="Positioning directions must be synthesized from structured discovery data. Please complete the Discover stage first."
        />
        <EmptyState
          icon={<Compass className="w-8 h-8 text-amber-500" />}
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
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <EmptyState
          icon={<Crosshair className="w-8 h-8 text-rose-400" />}
          title="Positioning Directions Uninitialized"
          description="NEXUS will generate 3 strategically divergent market vectors based on your discovery findings, with distinct value propositions, competitive moats, and explicit trade-offs."
          actionLabel="Generate 3 Positioning Directions"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  // Resolve active focused vector
  const activeVectorId =
    focusedId && positioning.directions.some((d) => d.id === focusedId)
      ? focusedId
      : project.selectedDirection?.id || positioning.directions[0]?.id;

  const focusedIndex = positioning.directions.findIndex((d) => d.id === activeVectorId);
  const safeIndex = focusedIndex >= 0 ? focusedIndex : 0;
  const focusedDirection: PositioningDirection = positioning.directions[safeIndex];
  const isSelected = project.selectedDirection?.id === focusedDirection.id;

  // Comparison matrix dimensions
  const comparisonDimensions = [
    {
      label: 'Strategic Thesis',
      description: 'Core market thesis and value delivery model',
      getValue: (d: PositioningDirection) => d.valueProposition,
      isTradeoff: false,
    },
    {
      label: 'Target Beachhead',
      description: 'Immediate buyer persona and segment wedge',
      getValue: (d: PositioningDirection) => d.targetSegment,
      isTradeoff: false,
    },
    {
      label: 'Competitive Moat',
      description: 'Structural defense mechanism against incumbents',
      getValue: (d: PositioningDirection) => d.competitiveMoat,
      isTradeoff: false,
    },
    {
      label: 'Key Differentiator',
      description: 'Primary non-commodity wedge in the category',
      getValue: (d: PositioningDirection) => d.keyDifferentiator,
      isTradeoff: false,
    },
    {
      label: 'Strategic Trade-off',
      description: 'Explicit sacrifice made to ensure distinctiveness',
      getValue: (d: PositioningDirection) => d.strategicTradeoff,
      isTradeoff: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* 1. STRATEGIC OVERVIEW MASTHEAD */}
      <section className="relative rounded-2xl border border-nexus-800 bg-nexus-900/40 backdrop-blur-md p-5 sm:p-7 overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-bl from-rose-950/25 via-rose-900/10 to-transparent pointer-events-none rounded-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Strategic Divergence
              </span>
              <WhyThis
                stageBadge="Stage 02 · Positioning Thesis"
                title="Why this Divergence Thesis?"
                decision="3 Mutually Exclusive Market Vectors"
                decisionSubtitle={positioning.rationale}
                inputs={[
                  { label: 'Beachhead Problem', value: project.discovery?.problem.coreProblem || 'Foundational market pain point' },
                  { label: 'Category Incumbent Gap', value: project.discovery?.problem.marketFailure || 'Category status quo' },
                  { label: 'Immediate Beachhead Goal', value: project.discovery?.goals.immediateLaunchGoal || 'Target beachhead adoption' },
                ]}
                reasoning="NEXUS deliberately engineers 3 divergent market vectors rather than minor variations. This forces strategic clarity on what value is delivered and what must be sacrificed, preventing the common trap of vague, one-size-fits-all positioning."
                tradeoff="Each vector makes an explicit sacrifice in target buyer segment, narrative focus, or operational complexity to guarantee distinctiveness."
                triggerVariant="compact"
              />
              <ListenButton
                id="positioning-divergence-thesis"
                text={`Strategic Divergence Thesis: ${positioning.rationale}`}
                label="Listen"
                size="xs"
                variant="compact"
              />
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-nexus-100">
              Three ways this brand could win.
            </h2>

            <p className="text-xs sm:text-sm text-nexus-200 leading-relaxed font-sans">
              {positioning.rationale}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={runCurrentStageAction}
              isLoading={isExecutingStage}
              className="text-xs min-h-[36px]"
            >
              Re-synthesize
            </Button>
            {project.selectedDirection ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveStage('challenge')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs min-h-[36px]"
              >
                Advance to Challenge
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveStage('challenge')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs min-h-[36px]"
              >
                View Challenge Stage
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC VECTOR SELECTOR STRIP */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-mono text-nexus-400">
            Select a vector below to inspect its thesis, evidence, and deliberate trade-offs.
          </p>
          {project.selectedDirection && (
            <span className="text-[11px] font-mono text-rose-700 dark:text-rose-300 hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Active Anchor: {project.selectedDirection.name}
            </span>
          )}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          role="tablist"
          aria-label="Strategic Vectors Navigation"
        >
          {positioning.directions.map((direction, idx) => {
            const isFocused = direction.id === focusedDirection.id;
            const isAnchor = project.selectedDirection?.id === direction.id;

            return (
              <button
                key={direction.id}
                type="button"
                role="tab"
                aria-selected={isFocused}
                onClick={() => setFocusedId(direction.id)}
                className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isFocused
                    ? 'bg-nexus-900/90 border-rose-500/50 shadow-[0_4px_24px_rgba(190,18,60,0.15)] ring-1 ring-rose-500/30'
                    : 'bg-nexus-950/60 hover:bg-nexus-900/50 border-nexus-850 hover:border-nexus-750'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                      isFocused ? 'text-rose-700 dark:text-rose-400' : 'text-nexus-400'
                    }`}
                  >
                    Vector 0{idx + 1}
                  </span>
                  {isAnchor ? (
                    <Badge variant="ruby" dot className="text-[10px] font-mono py-0">
                      Anchor
                    </Badge>
                  ) : isFocused ? (
                    <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300/80">
                      Inspecting
                    </span>
                  ) : null}
                </div>

                <div
                  className={`text-sm sm:text-base font-semibold truncate ${
                    isFocused ? 'text-nexus-100 font-bold' : 'text-nexus-300 hover:text-nexus-100'
                  }`}
                >
                  {direction.name}
                </div>

                <div className="text-xs text-nexus-400 font-mono mt-0.5 truncate">
                  {direction.archetype}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ASYMMETRIC VECTOR EXPLORER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Focused Direction Deep Dive (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-nexus-800 bg-nexus-950/70 backdrop-blur-md p-5 sm:p-7 space-y-6 shadow-xs">
            {/* Vector Header & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-nexus-850">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    Vector 0{safeIndex + 1}
                  </span>
                  <span className="text-nexus-400 font-mono text-xs">·</span>
                  <span className="text-xs font-mono text-nexus-400">
                    {focusedDirection.archetype}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-nexus-100 tracking-tight">
                  {focusedDirection.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <WhyThis
                  stageBadge={`Stage 02 · Vector 0${safeIndex + 1}`}
                  title={`Why ${focusedDirection.name}?`}
                  decision={`${focusedDirection.name} (${focusedDirection.archetype})`}
                  decisionSubtitle={`"${focusedDirection.taglineConcept}"`}
                  inputs={[
                    { label: 'Target Segment Focus', value: focusedDirection.targetSegment },
                    { label: 'Core Problem Solved', value: project.discovery?.problem.coreProblem || 'Discovered market need' },
                    { label: 'Incumbent Category Failure', value: project.discovery?.problem.marketFailure || 'Incumbent gap' },
                    ...(project.discovery?.audience.painPoints?.length
                      ? [{ label: 'Primary Audience Pain Point', value: project.discovery.audience.painPoints[0] }]
                      : []),
                  ]}
                  reasoning={`Synthesized as a strategically defensible vector delivering "${focusedDirection.valueProposition}". Builds a structural competitive advantage via ${focusedDirection.competitiveMoat.toLowerCase()}, anchored on ${focusedDirection.keyDifferentiator.toLowerCase()}.`}
                  tradeoff={focusedDirection.strategicTradeoff}
                  consideration={focusedDirection.critique?.clicheNotes ? `Adversarial Note: ${focusedDirection.critique.clicheNotes}` : undefined}
                  triggerVariant="compact"
                />
                <ListenButton
                  id={`vector-${focusedDirection.id}`}
                  text={`${focusedDirection.name}, ${focusedDirection.archetype}. Value Proposition: ${focusedDirection.valueProposition}. Strategic trade-off: ${focusedDirection.strategicTradeoff}`}
                  label="Listen"
                  size="xs"
                  variant="compact"
                />
                {isSelected && (
                  <Badge variant="ruby" dot className="text-[11px] font-mono">
                    Active Anchor
                  </Badge>
                )}
              </div>
            </div>

            {/* Concept Tagline Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-rose-950/25 via-nexus-900/60 to-nexus-950/40 border border-rose-500/20">
              <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1">
                Concept Tagline
              </span>
              <p className="text-base sm:text-lg font-medium text-nexus-100 italic">
                &ldquo;{focusedDirection.taglineConcept}&rdquo;
              </p>
            </div>

            {/* Strategic Thesis & Value Proposition */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-nexus-400">
                Strategic Thesis and Value Proposition
              </h4>
              <p className="text-sm sm:text-base text-nexus-100 leading-relaxed font-sans">
                {focusedDirection.valueProposition}
              </p>
            </div>

            {/* Target Beachhead Segment */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-nexus-400">
                Target Beachhead Segment
              </h4>
              <p className="text-xs sm:text-sm text-nexus-200 font-sans">
                {focusedDirection.targetSegment}
              </p>
            </div>

            {/* Strategic Evidence: Competitive Moat + Key Differentiator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-nexus-900/50 border border-nexus-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-mono text-xs uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Competitive Moat</span>
                </div>
                <p className="text-xs sm:text-sm text-nexus-200 leading-relaxed">
                  {focusedDirection.competitiveMoat}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-nexus-900/50 border border-nexus-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-mono text-xs uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Key Differentiator</span>
                </div>
                <p className="text-xs sm:text-sm text-nexus-200 leading-relaxed">
                  {focusedDirection.keyDifferentiator}
                </p>
              </div>
            </div>

            {/* Qualitative Strategic Trade-off */}
            <div className="p-4 sm:p-5 rounded-xl bg-rose-950/20 border border-rose-500/25 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-mono text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="font-semibold">Strategic Sacrifice and Trade-off</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 dark:text-rose-100/95 leading-relaxed font-sans">
                {focusedDirection.strategicTradeoff}
              </p>
              <div className="pt-2 text-[11px] text-rose-800/80 dark:text-rose-300/70 border-t border-rose-500/15 font-mono">
                Deliberate exclusion required to maintain distinctiveness against category competitors.
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Column: Decision Moment & Alternative Vectors (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Deliberate Human Decision Console */}
          <div
            className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
              isSelected
                ? 'bg-rose-950/25 border-rose-500/40 ring-1 ring-rose-500/30'
                : 'bg-nexus-900/50 border-nexus-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <h4 className="text-sm font-semibold text-nexus-100">
                Human Decision Moment
              </h4>
            </div>

            <p className="text-xs text-nexus-300 leading-relaxed">
              {isSelected
                ? 'This direction is locked as your brand anchor. Stage 03 (Challenge) will stress-test its defensibility before Shape builds the naming and visual system.'
                : 'NEXUS does not select a default winner. Choose this strategic path to anchor downstream naming, visual identity, and launch collateral.'}
            </p>

            <div className="mt-5 pt-4 border-t border-nexus-850">
              {isSelected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-800 dark:text-rose-300 bg-rose-500/10 border border-rose-500/25 px-3 py-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Locked as Strategic Anchor</span>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full text-xs font-semibold min-h-[38px]"
                    onClick={() => setActiveStage('challenge')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Advance to Challenge (Stage 03)
                  </Button>
                </div>
              ) : (
                <Button
                  variant="glow"
                  size="md"
                  className="w-full text-xs font-semibold min-h-[40px]"
                  onClick={() => selectPositioningDirection(focusedDirection)}
                >
                  Build from this direction
                </Button>
              )}
            </div>
          </div>

          {/* Alternative Strategic Vectors */}
          <div className="p-5 rounded-2xl border border-nexus-850 bg-nexus-950/50 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-nexus-400">
              Alternative Vectors
            </h4>
            <div className="space-y-2.5">
              {positioning.directions
                .filter((d) => d.id !== focusedDirection.id)
                .map((altDirection) => {
                  const isAltAnchor = project.selectedDirection?.id === altDirection.id;
                  return (
                    <button
                      key={altDirection.id}
                      type="button"
                      onClick={() => setFocusedId(altDirection.id)}
                      className="w-full text-left p-3.5 rounded-xl border border-nexus-800/80 bg-nexus-900/40 hover:bg-nexus-900/80 hover:border-nexus-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-nexus-300 group-hover:text-nexus-100 truncate">
                            {altDirection.name}
                          </span>
                          {isAltAnchor && (
                            <Badge variant="ruby" dot className="text-[9px] font-mono py-0">
                              Anchor
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-nexus-400 block truncate mt-0.5">
                          {altDirection.archetype}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-nexus-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC DELTA MATRIX */}
      <section className="rounded-2xl border border-nexus-800 bg-nexus-950/70 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-nexus-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-nexus-100 tracking-tight">
              Strategic Delta Matrix
            </h3>
            <p className="text-xs text-nexus-400 mt-0.5 font-sans">
              Direct comparative breakdown across all three synthesized postures.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-nexus-400 flex items-center gap-1.5">
              <Columns3 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Side-by-side Divergence
            </span>
          </div>
        </div>

        {/* Desktop Comparison Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-nexus-850 bg-nexus-900/60">
                <th className="p-4 text-xs font-mono uppercase text-nexus-400 w-1/4">
                  Dimension
                </th>
                {positioning.directions.map((direction, idx) => {
                  const isCurrentFocused = direction.id === focusedDirection.id;
                  const isCurrentAnchor = project.selectedDirection?.id === direction.id;

                  return (
                    <th
                      key={direction.id}
                      className={`p-4 text-xs w-1/4 transition-colors ${
                        isCurrentFocused
                          ? 'bg-rose-950/20 border-x border-rose-500/30'
                          : 'border-x border-nexus-850/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[11px] text-rose-700 dark:text-rose-400 font-semibold uppercase">
                          Vector 0{idx + 1}
                        </span>
                        {isCurrentAnchor && (
                          <Badge variant="ruby" dot className="text-[9px] font-mono py-0">
                            Anchor
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold text-nexus-100 truncate text-sm">
                        {direction.name}
                      </div>
                      <div className="font-mono text-[11px] text-nexus-400 truncate mt-0.5">
                        {direction.archetype}
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {!isCurrentFocused && (
                          <button
                            type="button"
                            onClick={() => setFocusedId(direction.id)}
                            className="text-[11px] font-mono text-nexus-400 hover:text-nexus-100 underline underline-offset-2 cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                        {!isCurrentAnchor && (
                          <button
                            type="button"
                            onClick={() => selectPositioningDirection(direction)}
                            className="text-[11px] font-mono text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 ml-auto cursor-pointer"
                          >
                            Select Anchor
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-850/60">
              {comparisonDimensions.map((dimension) => (
                <tr
                  key={dimension.label}
                  className={dimension.isTradeoff ? 'bg-rose-950/10' : ''}
                >
                  <td className="p-4 align-top">
                    <span
                      className={`text-xs font-mono font-medium uppercase tracking-wider block ${
                        dimension.isTradeoff ? 'text-rose-800 dark:text-rose-300' : 'text-nexus-200'
                      }`}
                    >
                      {dimension.label}
                    </span>
                    <span className="text-[11px] text-nexus-400 leading-tight block mt-0.5">
                      {dimension.description}
                    </span>
                  </td>

                  {positioning.directions.map((direction) => {
                    const isCurrentFocused = direction.id === focusedDirection.id;
                    const val = dimension.getValue(direction);

                    return (
                      <td
                        key={direction.id}
                        className={`p-4 align-top text-xs leading-relaxed transition-colors ${
                          dimension.isTradeoff
                            ? isCurrentFocused
                              ? 'text-rose-950 dark:text-rose-100 bg-rose-950/25 border-x border-rose-500/30'
                              : 'text-rose-900 dark:text-rose-200/90 border-x border-nexus-850/60'
                            : isCurrentFocused
                            ? 'text-nexus-100 bg-rose-950/10 border-x border-rose-500/30 font-medium'
                            : 'text-nexus-300 border-x border-nexus-850/60'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Comparison Stack (Active Dimension Tabs) */}
        <div className="block md:hidden p-4 space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {comparisonDimensions.map((dim, idx) => (
              <button
                key={dim.label}
                type="button"
                onClick={() => setMobileDimensionIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  mobileDimensionIdx === idx
                    ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/35 font-semibold'
                    : 'bg-nexus-900/60 text-nexus-400 border border-nexus-850 hover:text-nexus-200'
                }`}
              >
                {dim.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-nexus-900/40 border border-nexus-850 text-xs text-nexus-400">
            {comparisonDimensions[mobileDimensionIdx].description}
          </div>

          <div className="space-y-3">
            {positioning.directions.map((direction, idx) => {
              const isCurrentFocused = direction.id === focusedDirection.id;
              const isCurrentAnchor = project.selectedDirection?.id === direction.id;
              const activeDim = comparisonDimensions[mobileDimensionIdx];
              const value = activeDim.getValue(direction);

              return (
                <div
                  key={direction.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isCurrentFocused
                      ? 'bg-nexus-900/80 border-rose-500/40'
                      : 'bg-nexus-950/60 border-nexus-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-semibold">
                      Vector 0{idx + 1} · {direction.name}
                    </span>
                    {isCurrentAnchor && (
                      <Badge variant="ruby" dot className="text-[9px] font-mono py-0">
                        Anchor
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      activeDim.isTradeoff
                        ? 'text-rose-900 dark:text-rose-200'
                        : 'text-nexus-200'
                    }`}
                  >
                    {value}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-nexus-850/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFocusedId(direction.id)}
                      className="text-[11px] font-mono text-nexus-400 hover:text-nexus-100 underline cursor-pointer"
                    >
                      Focus this vector
                    </button>
                    {!isCurrentAnchor && (
                      <button
                        type="button"
                        onClick={() => selectPositioningDirection(direction)}
                        className="text-[11px] font-mono text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium cursor-pointer"
                      >
                        Select as Anchor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
