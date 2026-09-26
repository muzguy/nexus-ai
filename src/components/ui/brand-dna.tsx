'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useBrandProject } from '@/context/brand-project-context';
import { deriveBrandDna, DerivedBrandDna } from '@/lib/brand-dna';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WhyThis } from '@/components/ui/why-this';
import { ListenButton } from '@/components/ui/listen-button';
import {
  Dna,
  X,
  Copy,
  Check,
  Target,
  Sparkles,
  ShieldCheck,
  Flame,
  Volume2,
  Palette,
  Crosshair,
  Compass,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface BrandDnaProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function BrandDna({ isOpen, onClose, className = '' }: BrandDnaProps) {
  const { project } = useBrandProject();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Derive DNA synchronously from active BrandProject state
  const dna: DerivedBrandDna = useMemo(() => deriveBrandDna(project), [project]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation (ESC) & scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const copyToClipboard = (text: string, key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch {
      // ignore
    }
  };

  // Text synthesized for speech synthesis
  const speechContent = useMemo(() => {
    const parts: string[] = [`Brand DNA for ${dna.brandName}`];
    if (dna.tagline) parts.push(`Tagline: ${dna.tagline}`);
    if (dna.targetAudience?.primarySegment) parts.push(`Target audience: ${dna.targetAudience.primarySegment}`);
    if (dna.positioning?.directionName) parts.push(`Positioning: ${dna.positioning.directionName}`);
    if (dna.valuePromise) parts.push(`Value promise: ${dna.valuePromise}`);
    if (dna.personality?.primaryArchetype) parts.push(`Personality archetype: ${dna.personality.primaryArchetype}`);
    if (dna.voice?.toneAttributes?.length) parts.push(`Voice tone: ${dna.voice.toneAttributes.join(', ')}`);
    if (dna.differentiator?.competitiveMoat) parts.push(`Moat: ${dna.differentiator.competitiveMoat}`);
    if (dna.visual?.aestheticThesis) parts.push(`Visual direction: ${dna.visual.aestheticThesis}`);
    return parts.join('. ');
  }, [dna]);

  if (!mounted || !isOpen) return null;

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brand-dna-title"
        className={`w-full max-w-lg h-full bg-nexus-900/95 backdrop-blur-2xl border-l border-white/[0.08] text-nexus-100 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col focus:outline-none animate-slideLeft overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================== */}
        {/* DRAWER HEADER */}
        {/* ==================================================== */}
        <div className="p-4 sm:p-5 border-b border-nexus-800/80 bg-nexus-950/85 backdrop-blur-md shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xs">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="brand-dna-title"
                    className="text-base sm:text-lg font-bold text-nexus-100 dark:text-white font-mono tracking-tight"
                  >
                    BRAND DNA
                  </h2>
                  <Badge
                    variant={
                      dna.maturityLabel === 'Refined'
                        ? 'ruby'
                        : dna.maturityLabel === 'Defined'
                        ? 'primary'
                        : 'amber'
                    }
                    className="text-[10px] font-mono uppercase"
                  >
                    {dna.maturityLabel}
                  </Badge>
                </div>
                <p className="text-[11px] font-mono text-nexus-400">
                  {dna.definedSignalsCount} of {dna.totalSignalsCount} core identity signals defined
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ListenButton
                id="brand-dna-summary"
                text={speechContent}
                label="Listen"
                size="xs"
                variant="compact"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-nexus-400 hover:text-nexus-100 dark:hover:text-white hover:bg-nexus-800 transition-colors cursor-pointer"
                aria-label="Close Brand DNA panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Brand Essence Snapshot */}
          <div className="p-3 rounded-xl bg-nexus-950/90 border border-nexus-850 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-semibold">
                Brand Anchor
              </span>
              <h3 className="text-sm sm:text-base font-bold text-nexus-100 dark:text-white truncate">
                {dna.brandName}
              </h3>
              {dna.tagline && (
                <p className="text-xs text-nexus-300 italic truncate mt-0.5">
                  &ldquo;{dna.tagline}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {dna.tagline && (
                <button
                  type="button"
                  onClick={(e) => copyToClipboard(dna.tagline || '', 'tagline', e)}
                  title="Copy tagline"
                  className="p-1.5 rounded-md text-nexus-400 hover:text-nexus-100 hover:bg-nexus-800 border border-nexus-700 transition-colors cursor-pointer"
                >
                  {copiedKey === 'tagline' ? (
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="inline-flex rounded-lg border border-nexus-800 bg-nexus-900 p-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-gradient-to-r from-red-900 via-rose-700 to-rose-600 text-white shadow-xs font-semibold'
                      : 'text-nexus-400 hover:text-nexus-200'
                  }`}
                >
                  Compact
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'detailed'
                      ? 'bg-gradient-to-r from-red-900 via-rose-700 to-rose-600 text-white shadow-xs font-semibold'
                      : 'text-nexus-400 hover:text-nexus-200'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* DRAWER BODY (SCROLLABLE) */}
        {/* ==================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Signal Indicator Strip */}
          <div className="flex items-center justify-between gap-1 p-2 rounded-lg bg-nexus-950/60 border border-nexus-850">
            {dna.signals.map((sig) => (
              <div
                key={sig.id}
                title={`${sig.name}: ${sig.isDefined ? 'Defined' : 'Pending'}`}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: sig.isDefined ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                }}
              />
            ))}
          </div>

          {/* ================================================== */}
          {/* 1. STRATEGIC POSITIONING & PROMISE */}
          {/* ================================================== */}
          {dna.positioning && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-semibold">
                  <Crosshair className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  Positioning Direction
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="ruby" className="text-[9px] font-mono">
                    {dna.positioning.isHumanSelected ? 'Selected Vector' : 'Direction'}
                  </Badge>
                  {project.positioning && (
                    <WhyThis
                      stageBadge="Stage 02 · Positioning"
                      title="Why this Positioning Direction?"
                      decision={dna.positioning.directionName}
                      decisionSubtitle={dna.positioning.valueProposition}
                      inputs={[
                        { label: 'Target Audience', value: dna.targetAudience?.primarySegment || 'Target Market' },
                        { label: 'Strategic Moat', value: dna.differentiator?.competitiveMoat || 'Moat' },
                      ]}
                      reasoning={
                        dna.positioning.rationale ||
                        'Mutually exclusive market vector engineered to claim high-ground defensibility.'
                      }
                      tradeoff={dna.positioning.tradeoff}
                      triggerVariant="compact"
                    />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-nexus-100 dark:text-white">
                  {dna.positioning.directionName}
                </h4>
                {dna.positioning.archetype && (
                  <p className="text-xs text-indigo-300 font-mono mt-0.5">
                    Archetype: {dna.positioning.archetype}
                  </p>
                )}
              </div>

              {dna.valuePromise && (
                <div className="pt-2 border-t border-nexus-850">
                  <div className="flex items-center justify-between text-[10px] font-mono text-nexus-400 mb-1">
                    <span>CORE VALUE PROMISE</span>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard(dna.valuePromise || '', 'promise', e)}
                      className="text-accent-cyan hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'promise' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-nexus-200 leading-relaxed font-medium">
                    &ldquo;{dna.valuePromise}&rdquo;
                  </p>
                </div>
              )}

              {viewMode === 'detailed' && dna.positioning.tradeoff && (
                <div className="p-2 rounded bg-rose-500/5 border border-rose-500/20 text-[11px] text-rose-300">
                  <span className="font-semibold block font-mono uppercase text-[9px]">Deliberate Sacrifice</span>
                  {dna.positioning.tradeoff}
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* 2. TARGET AUDIENCE */}
          {/* ================================================== */}
          {dna.targetAudience && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-semibold">
                  <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Target Audience
                </span>
                <Badge variant="primary" className="text-[9px] font-mono">
                  Stage 01
                </Badge>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-nexus-100 dark:text-white leading-snug">
                {dna.targetAudience.primarySegment}
              </p>

              {viewMode === 'detailed' && (
                <div className="space-y-1.5 pt-1 text-xs text-nexus-300">
                  {dna.targetAudience.painPoints && dna.targetAudience.painPoints.length > 0 && (
                    <div className="text-[11px]">
                      <span className="text-nexus-400 font-mono uppercase text-[9px] block">Beachhead Pain</span>
                      <p className="text-nexus-200">{dna.targetAudience.painPoints[0]}</p>
                    </div>
                  )}
                  {dna.targetAudience.urgencyDriver && (
                    <div className="text-[11px]">
                      <span className="text-nexus-400 font-mono uppercase text-[9px] block">Urgency Driver</span>
                      <p className="text-accent-cyan font-mono">{dna.targetAudience.urgencyDriver}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* 3. BRAND PERSONALITY & ARCHETYPES */}
          {/* ================================================== */}
          {dna.personality && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Brand Personality
                </span>
                <Badge variant="amber" className="text-[9px] font-mono">
                  {dna.personality.primaryArchetype}
                </Badge>
              </div>

              {dna.personality.coreTraits.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-nexus-400 block mb-1.5 uppercase">Core Traits</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dna.personality.coreTraits.map((trait, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-nexus-900 border border-nexus-700 text-xs text-nexus-200 font-medium"
                      >
                        {trait.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewMode === 'detailed' && dna.personality.traitsToAvoid.length > 0 && (
                <div className="pt-2 border-t border-nexus-850">
                  <span className="text-[10px] font-mono text-rose-400 block mb-1 uppercase">Anti-Patterns (Taboo)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dna.personality.traitsToAvoid.map((avoid, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono"
                      >
                        ✕ {avoid.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* 4. BRAND VOICE & TONAL RULES */}
          {/* ================================================== */}
          {dna.voice && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-semibold">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Voice Signature
                </span>
                <span className="text-[10px] font-mono text-nexus-400">Deterministic</span>
              </div>

              {dna.voice.toneAttributes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {dna.voice.toneAttributes.map((attr, i) => (
                    <Badge key={i} variant="primary" className="text-xs">
                      {attr}
                    </Badge>
                  ))}
                </div>
              )}

              {dna.voice.narrativeStyle && (
                <p className="text-xs text-nexus-300 leading-relaxed pt-1">
                  {dna.voice.narrativeStyle}
                </p>
              )}

              {viewMode === 'detailed' && dna.voice.tabooTerms && dna.voice.tabooTerms.length > 0 && (
                <div className="pt-2 border-t border-nexus-850">
                  <span className="text-[10px] font-mono text-rose-400 block mb-1 uppercase">Forbidden Vocabulary</span>
                  <div className="flex flex-wrap gap-1">
                    {dna.voice.tabooTerms.slice(0, 5).map((tw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono line-through"
                      >
                        {tw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* 5. COMPETITIVE MOAT & DIFFERENTIATOR */}
          {/* ================================================== */}
          {dna.differentiator && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Strategic Moat &amp; Distinctiveness
              </span>
              <p className="text-xs text-nexus-200 leading-relaxed font-sans">
                {dna.differentiator.competitiveMoat ||
                  dna.differentiator.keyDifferentiator ||
                  dna.differentiator.differentiatorRationale}
              </p>
            </div>
          )}

          {/* ================================================== */}
          {/* 6. VISUAL SYSTEM & PALETTE */}
          {/* ================================================== */}
          {dna.visual && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-nexus-950/70 border border-rose-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-semibold">
                  <Palette className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  Visual Direction
                </span>
                <Badge variant="ruby" className="text-[9px] font-mono">
                  {dna.visual.themeName}
                </Badge>
              </div>

              <p className="text-xs text-nexus-200 leading-relaxed">
                {dna.visual.aestheticThesis}
              </p>

              {dna.visual.palette && (
                <div className="pt-2 border-t border-nexus-850 space-y-1.5">
                  <span className="text-[10px] font-mono text-nexus-400 block uppercase">Brand Color Tokens (Click to Copy)</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Object.entries(dna.visual.palette).map(([role, swatch]) => {
                      if (!swatch) return null;
                      const isCopied = copiedKey === `swatch-${role}`;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={(e) => copyToClipboard(swatch.hex, `swatch-${role}`, e)}
                          title={`${swatch.name} (${swatch.hex}) - Click to copy`}
                          className="flex flex-col items-center p-1.5 rounded-lg bg-nexus-900 border border-nexus-800 hover:border-rose-500/40 transition-colors cursor-pointer group"
                        >
                          <span
                            className="w-full h-5 rounded-md border border-white/10 shadow-xs mb-1"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[9px] font-mono text-nexus-300 group-hover:text-rose-400 truncate w-full text-center">
                            {isCopied ? 'Copied' : swatch.hex}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* 7. GUARDIAN CONSISTENCY FOUNDATION CALLOUT */}
          {/* ================================================== */}
          {dna.hasGuardianFoundation && (
            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/25 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-rose-400 block">
                  Guardian Foundation Active
                </span>
                <p className="text-[11px] text-nexus-300 leading-relaxed font-sans">
                  Used by Guardian to keep future content aligned across marketing, pitch, and product copy.
                </p>
                {dna.consistency?.integrityScore !== undefined && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-rose-400 font-semibold">
                      Verified Integrity: {dna.consistency.integrityScore}/100
                    </span>
                    <Badge variant="ruby" className="text-[9px] font-mono uppercase">
                      {dna.consistency.verdict?.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* DRAWER FOOTER */}
        {/* ==================================================== */}
        <div className="p-4 border-t border-nexus-800 bg-nexus-950 flex items-center justify-between shrink-0 text-xs text-nexus-400">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-cyan" />
            NEXUS Cognitive Pipeline State
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-3"
          >
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
