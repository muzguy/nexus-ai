'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import {
  Flame,
  Volume2,
  XCircle,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export function ShapeStage() {
  const {
    project,
    setActiveStage,
    selectNameCandidate,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const selectedDirection = project.selectedDirection;
  const personality = project.personality;
  const naming = project.naming;
  const voice = project.voice;
  const shapeData = project.shapeData;

  if (!selectedDirection) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisite Missing"
          message="Brand shaping requires a selected strategic positioning direction. Please make a selection in Stage 3."
        />
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-amber-500" />}
          title="Strategic Direction Required"
          description="Return to Stage 3 (Challenge & Selection) to select your winning positioning direction."
          actionLabel="Go to Challenge Stage"
          onAction={() => setActiveStage('challenge')}
        />
      </div>
    );
  }

  if (!personality || !naming || !voice) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <EmptyState
          icon={<Flame className="w-8 h-8 text-indigo-400" />}
          title="Brand Identity & Voice Unshaped"
          description={`Forge brand archetypes, naming territories, candidates, and voice boundaries grounded in your chosen strategy: "${selectedDirection.name}".`}
          actionLabel="Shape Identity, Naming & Voice"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Strategic Anchor Callout */}
      <div className="p-4 sm:p-5 rounded-xl bg-nexus-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow">
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
            Grounded in Strategic Direction
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-nexus-100 dark:text-white mt-0.5 break-words">
            {selectedDirection.name} — &ldquo;{selectedDirection.taglineConcept}&rdquo;
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={runCurrentStageAction}
            isLoading={isExecutingStage}
            className="w-full sm:w-auto text-xs min-h-[44px] sm:min-h-[36px]"
          >
            Re-synthesize
          </Button>
          <Button
            variant="glow"
            size="sm"
            onClick={() => setActiveStage('visualize')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-[36px]"
          >
            Proceed to Visualize
          </Button>
        </div>
      </div>

      {/* Tagline & Pitch Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-indigo-500/40">
          <CardHeader>
            <CardTitle>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Core Tagline
            </CardTitle>
            <Badge variant="primary" className="text-[10px] font-mono">
              Synthesis
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold text-nexus-100 dark:text-white italic tracking-tight break-words">
              &ldquo;{shapeData?.tagline || selectedDirection.taglineConcept}&rdquo;
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/40">
          <CardHeader>
            <CardTitle>
              <Volume2 className="w-4 h-4 text-accent-cyan" />
              One-Line Pitch
            </CardTitle>
            <Badge variant="cyan" className="text-[10px] font-mono">
              Elevator
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-nexus-200 leading-relaxed">
              {shapeData?.oneLinePitch || selectedDirection.valueProposition}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Personality Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Flame className="w-4 h-4 text-amber-500" />
              Brand Personality & Archetypes
            </CardTitle>
            <CardDescription>
              Behavioral DNA and explicit negative traits to avoid.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <WhyThis
              stageBadge="Stage 04 · Brand Personality"
              title="Why this Personality & Archetype?"
              decision={`Primary: ${personality.primaryArchetype} (Secondary: ${personality.secondaryArchetype})`}
              decisionSubtitle={`Core Behavioral DNA: ${personality.coreTraits.map((t) => t.name).join(', ')}`}
              inputs={[
                { label: 'Strategic Direction Anchor', value: selectedDirection.name },
                { label: 'Strategic Value Proposition', value: selectedDirection.valueProposition },
                { label: 'Target Audience Desires', value: project.discovery?.audience.desires.slice(0, 2).join('; ') || 'High-autonomy execution' },
              ]}
              reasoning={`The ${personality.primaryArchetype} archetype translates the strategic vector "${selectedDirection.name}" into concrete human behaviors. It anchors on "${personality.coreTraits[0]?.name}: ${personality.coreTraits[0]?.description}" to project authority while maintaining active accessibility.`}
              tradeoff={`Explicitly rejects ${personality.traitsToAvoid.map((t) => t.name).join(', ')} to prevent category cliché, arrogance, or dilution.`}
              triggerVariant="compact"
            />
            <Badge variant="amber" className="text-[10px] font-mono">
              {personality.primaryArchetype}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Traits Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase text-nexus-400 tracking-wider mb-3">
              Core Personality Traits (In Action)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {personality.coreTraits.map((trait, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-2"
                >
                  <span className="text-xs font-bold text-nexus-100 dark:text-white block">
                    {trait.name}
                  </span>
                  <p className="text-xs text-nexus-300 leading-relaxed">
                    {trait.description}
                  </p>
                  <div className="pt-2 border-t border-nexus-850 text-[11px] text-accent-cyan font-mono">
                    <span className="text-nexus-400">In Action: </span>
                    {trait.inAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traits to Avoid */}
          <div>
            <h4 className="text-xs font-mono uppercase text-rose-500 dark:text-rose-400 tracking-wider mb-3 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Strict Negative Boundaries (What We Never Do)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personality.traitsToAvoid.map((avoid, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                      {avoid.name}
                    </span>
                    <Badge variant="rose" className="text-[10px]">
                      Taboo
                    </Badge>
                  </div>
                  <p className="text-xs text-nexus-300">{avoid.reason}</p>
                  <p className="text-xs font-mono text-rose-700 dark:text-rose-300/80 bg-rose-950/20 dark:bg-rose-950/30 p-2 rounded border border-rose-500/20 italic break-words">
                    Bad Example: {avoid.badExample}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Naming Territories & Candidates */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <BookmarkCheck className="w-4 h-4 text-emerald-500" />
              Naming Territories & Candidates
            </CardTitle>
            <CardDescription>
              Linguistically engineered name candidates with etymology and domain feasibility.
            </CardDescription>
          </div>
          <Badge variant="emerald" className="text-[10px] font-mono">
            {naming.territories.length} Territories
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {naming.territories.map((territory) => (
            <div key={territory.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-nexus-100 dark:text-white">
                    {territory.name}
                  </h4>
                  <p className="text-xs text-nexus-400">{territory.premise}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {territory.candidates.map((cand) => {
                  const isSelected = naming.selectedCandidateId === cand.id;

                  return (
                    <div
                      key={cand.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-nexus-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-glow'
                          : 'bg-nexus-950/60 border-nexus-800 hover:border-nexus-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-bold text-nexus-100 dark:text-white tracking-wide">
                            {cand.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <WhyThis
                              stageBadge="Stage 04 · Naming Candidate"
                              title={`Why "${cand.name}"?`}
                              decision={`${cand.name} — "${cand.tagline}"`}
                              decisionSubtitle={`Territory: ${territory.name}`}
                              inputs={[
                                { label: 'Naming Territory', value: `${territory.name} (${territory.premise})` },
                                { label: 'Positioning Anchor', value: selectedDirection.name },
                                { label: 'Linguistic Root', value: cand.linguisticRoot },
                              ]}
                              reasoning={cand.rationale}
                              tradeoff={`Domain Feasibility: ${cand.domainFeasibility}. Scored ${cand.score}/10 on category memorability and distinctiveness.`}
                              triggerVariant="compact"
                            />
                            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              {cand.score} / 10
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-nexus-200 italic">
                          &ldquo;{cand.tagline}&rdquo;
                        </p>
                        <p className="text-xs text-nexus-400 leading-relaxed">
                          {cand.rationale}
                        </p>
                        <div className="text-[11px] font-mono text-nexus-400">
                          Root: {cand.linguisticRoot}
                        </div>
                        <div className="text-[11px] font-mono text-accent-cyan flex items-center gap-1 break-all">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span>{cand.domainFeasibility}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-nexus-850">
                        <Button
                          variant={isSelected ? 'primary' : 'outline'}
                          size="sm"
                          className="w-full text-xs min-h-[44px] sm:min-h-[36px]"
                          onClick={() => selectNameCandidate(cand.id)}
                        >
                          {isSelected ? 'Selected Brand Name' : 'Select Name'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brand Voice & Verbal Rules */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Volume2 className="w-4 h-4 text-indigo-400" />
              Brand Voice & Deterministic Rules
            </CardTitle>
            <CardDescription>
              Tone attributes, allowed vocabulary, and concrete editorial rules.
            </CardDescription>
          </div>
          <WhyThis
            stageBadge="Stage 04 · Brand Voice"
            title="Why this Voice & Deterministic Rules?"
            decision={`Tone Signature: ${voice.toneAttributes.join(' · ')}`}
            decisionSubtitle={voice.narrativeStyle}
            inputs={[
              { label: 'Brand Archetype', value: personality.primaryArchetype },
              { label: 'Audience Urgency Driver', value: project.discovery?.audience.urgencyDriver || 'Rapid execution demand' },
              { label: 'Positioning Tagline', value: selectedDirection.taglineConcept },
            ]}
            reasoning={`Calibrated to project rigorous category authority without sounding bureaucratic or hyperbolic. Emphasizes key vocabulary (${voice.keyVocabulary.slice(0, 4).join(', ')}) to maintain consistent cognitive clarity.`}
            tradeoff={`Strictly bans empty buzzwords and taboo terms (${voice.tabooTerms.slice(0, 4).join(', ')}) to preserve high-signal brand credibility.`}
            triggerVariant="compact"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tone Attributes & Vocabulary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-3">
              <span className="text-xs font-mono uppercase text-nexus-400 tracking-wider block">
                Tone Signature
              </span>
              <div className="flex flex-wrap gap-2">
                {voice.toneAttributes.map((attr, i) => (
                  <Badge key={i} variant="primary" className="text-xs">
                    {attr}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-nexus-300 leading-relaxed pt-2 border-t border-nexus-850">
                {voice.narrativeStyle}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-3">
              <span className="text-xs font-mono uppercase text-nexus-400 tracking-wider block">
                Core Vocabulary vs Taboo Words
              </span>
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mb-1">
                  Key Vocabulary
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {voice.keyVocabulary.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-nexus-850">
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 block mb-1">
                  Forbidden / Taboo Words
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {voice.tabooTerms.map((tw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-mono line-through"
                    >
                      {tw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Voice Rules Table */}
          {voice.rules.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-nexus-400 tracking-wider mb-3">
                Deterministic Editorial Rules
              </h4>
              <div className="space-y-3">
                {voice.rules.map((rule, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-850 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-nexus-400 uppercase block mb-1">
                        Context
                      </span>
                      <span className="font-semibold text-nexus-100 dark:text-white">
                        {rule.context}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
                        Say This
                      </span>
                      <p className="text-emerald-900 dark:text-emerald-200 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                        {rule.sayThis}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase block mb-1">
                        Avoid This
                      </span>
                      <p className="text-rose-900 dark:text-rose-200 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                        {rule.avoidThis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
