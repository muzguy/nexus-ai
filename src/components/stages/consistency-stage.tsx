'use client';

import React, { useState, useEffect } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import { ListenButton } from '@/components/ui/listen-button';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  FileText,
  AlertOctagon,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const CONTENT_TYPES = [
  'Homepage Headline',
  'Product Description',
  'Social Announcement',
  'Feature Announcement',
  'Call to Action (CTA)',
  'Marketing Copy',
];

export function ConsistencyStage() {
  const {
    project,
    setActiveStage,
    auditContent,
    isExecutingStage,
    executionProgress,
    error,
    clearError,
  } = useBrandProject();

  const brandName = project.selectedName || project.name || 'Active Project';
  const personality = project.shapeData?.personality || project.personality;
  const voice = project.shapeData?.voice || project.voice;
  const selectedDirection = project.selectedDirection;
  const consistency = project.consistency;

  const hasPrerequisites = Boolean(selectedDirection && (personality || voice));

  // Interactive Content Editor State
  const [selectedContentType, setSelectedContentType] = useState<string>(
    consistency?.contentType || 'Homepage Headline'
  );
  const [inputContent, setInputContent] = useState<string>('');
  const [copiedRevision, setCopiedRevision] = useState<boolean>(false);
  const [showGuardrails, setShowGuardrails] = useState<boolean>(true);

  // Initialize input text with previous audit content or default draft
  useEffect(() => {
    if (consistency?.auditedContent) {
      setInputContent(consistency.auditedContent);
    } else if (project.shapeData?.tagline && project.shapeData?.oneLinePitch) {
      setInputContent(`${project.shapeData.tagline} — ${project.shapeData.oneLinePitch}`);
    } else if (project.idea?.rawConcept) {
      setInputContent(project.idea.rawConcept);
    }
  }, [consistency?.auditedContent, project.shapeData, project.idea]);

  if (!hasPrerequisites) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisites Incomplete"
          message="The Consistency Guardian requires defined brand positioning, personality, and voice rules before running an audit."
        />
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-amber-500" />}
          title="Complete Prior Stages First"
          description="Complete the Shape stage to establish the brand personality, voice guardrails, and taboo terms for the Guardian to enforce."
          actionLabel="Go to Shape Stage"
          onAction={() => setActiveStage('shape')}
        />
      </div>
    );
  }

  const handleRunAudit = async () => {
    if (!inputContent.trim()) return;
    clearError();
    try {
      await auditContent(inputContent.trim(), selectedContentType);
    } catch {
      // Error handled in context
    }
  };

  const handleLoadDraftPreset = () => {
    const defaultTagline = project.shapeData?.tagline || selectedDirection?.taglineConcept || '';
    const defaultPitch = project.shapeData?.oneLinePitch || selectedDirection?.valueProposition || '';
    setInputContent(`${brandName}: ${defaultTagline}\n\n${defaultPitch}`);
    setSelectedContentType('Product Description');
  };

  const handleLoadInconsistentPreset = () => {
    setInputContent(
      `🚀 Hey everyone! We are SUPER THRILLED and beyond excited to unveil our magical, revolutionary AI platform that will totally transform and disrupt your entire daily life! Don't miss out on this incredible game-changing superpower—start your magical journey right now! 🎉⚡`
    );
    setSelectedContentType('Social Announcement');
  };

  const handleApplySuggestedRevision = () => {
    if (consistency?.suggestedRevision) {
      setInputContent(consistency.suggestedRevision);
    }
  };

  const handleCopySuggestedRevision = async () => {
    if (!consistency?.suggestedRevision) return;
    try {
      await navigator.clipboard.writeText(consistency.suggestedRevision);
      setCopiedRevision(true);
      setTimeout(() => setCopiedRevision(false), 2000);
    } catch {
      // ignore
    }
  };

  // Extract brand guardrails
  const toneAttributes = voice?.toneAttributes || ['Direct', 'Rigorous', 'Understated'];
  const tabooTerms = voice?.tabooTerms || [];
  const editorialRules = voice?.rules || [];
  const traitsToAvoid = personality?.traitsToAvoid || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Error Banner */}
      {error && (
        <AlertBanner
          variant="danger"
          title="Guardian Audit Error"
          message={error}
          action={{
            label: 'Retry Audit',
            onClick: handleRunAudit,
          }}
        />
      )}

      {/* ACTIVE GUARDRAILS SECTION */}
      <Card className="border-indigo-500/20 bg-nexus-900/60 shadow-lg overflow-hidden">
        <div
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800/60 hover:bg-nexus-800/30 transition-colors"
          onClick={() => setShowGuardrails(!showGuardrails)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-nexus-100 dark:text-white">
                  Active Brand Guardrails: {brandName}
                </span>
                <Badge variant="primary" className="text-[10px] font-mono uppercase">
                  {selectedDirection?.name}
                </Badge>
              </div>
              <p className="text-xs text-nexus-400">
                The authoritative rules and negative boundaries enforced during content evaluation.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1 rounded text-nexus-400 hover:text-nexus-200"
            aria-label="Toggle guardrails view"
          >
            {showGuardrails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showGuardrails && (
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tonal Mandate */}
            <div className="space-y-2 p-3 rounded-xl bg-nexus-950/60 border border-nexus-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-nexus-300">
                  Tonal Mandate
                </span>
                <Badge variant="cyan" className="text-[9px] font-mono">
                  {personality?.primaryArchetype || 'Voice'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {toneAttributes.map((attr, i) => (
                  <Badge
                    key={i}
                    variant="default"
                    className="text-[10px] bg-nexus-800/80 text-nexus-200 border-nexus-700"
                  >
                    {attr}
                  </Badge>
                ))}
              </div>
              {voice?.narrativeStyle && (
                <p className="text-[11px] text-nexus-400 pt-1 leading-snug line-clamp-2">
                  {voice.narrativeStyle}
                </p>
              )}
            </div>

            {/* Forbidden Taboo Terms */}
            <div className="space-y-2 p-3 rounded-xl bg-nexus-950/60 border border-rose-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-rose-400">
                  Strict Taboo Terms
                </span>
                <span className="text-[10px] font-mono text-rose-400/80">Forbidden</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tabooTerms.length > 0 ? (
                  tabooTerms.map((term, i) => (
                    <Badge
                      key={i}
                      variant="rose"
                      className="text-[10px] font-mono border-rose-500/30"
                    >
                      ✕ {term}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-nexus-400">No specific taboo terms defined</span>
                )}
              </div>
            </div>

            {/* Negative Boundaries */}
            <div className="space-y-2 p-3 rounded-xl bg-nexus-950/60 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">
                  Negative Boundaries
                </span>
                <span className="text-[10px] font-mono text-amber-400/80">Anti-Patterns</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {traitsToAvoid.slice(0, 2).map((avoid, i) => (
                  <div key={i} className="text-[11px] text-nexus-300">
                    <span className="font-semibold text-amber-300">Avoid: {avoid.name}</span>
                    <p className="text-[10px] text-nexus-400 line-clamp-1">{avoid.reason}</p>
                  </div>
                ))}
                {traitsToAvoid.length === 0 && (
                  <span className="text-xs text-nexus-400">Grounded in brand persona</span>
                )}
              </div>
            </div>

            {/* Strategic Trade-off */}
            <div className="space-y-2 p-3 rounded-xl bg-nexus-950/60 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                  Strategic Sacrifice
                </span>
                <span className="text-[10px] font-mono text-indigo-400/80">Moat</span>
              </div>
              <p className="text-[11px] text-nexus-300 pt-1 leading-snug">
                {selectedDirection?.strategicTradeoff ||
                  'Deliberate elimination of distractions to protect core brand defensibility.'}
              </p>
              {editorialRules.length > 0 && (
                <div className="pt-1 border-t border-nexus-800/60">
                  <span className="text-[10px] text-nexus-400 block font-mono">
                    Sample Rule: &quot;{editorialRules[0].sayThis}&quot;
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* CONTENT AUDIT WORKBENCH */}
      <Card className="border-nexus-700 bg-nexus-900/80 shadow-glow">
        <CardHeader className="pb-3 border-b border-nexus-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-cyan" />
                Content Consistency Auditor
              </CardTitle>
              <p className="text-xs text-nexus-300">
                Stress-test any draft marketing copy, website headline, social post, or announcement against your active brand guardrails.
              </p>
            </div>

            {/* Quick Test Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase text-nexus-400">Presets:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadDraftPreset}
                disabled={isExecutingStage}
                className="text-[11px] h-7 px-2.5"
              >
                Brand Draft
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadInconsistentPreset}
                disabled={isExecutingStage}
                className="text-[11px] h-7 px-2.5 text-rose-400 hover:text-rose-300 border-rose-500/30"
              >
                Hype Test
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputContent('')}
                disabled={isExecutingStage || !inputContent}
                className="text-[11px] h-7 px-2"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Content Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-nexus-300 block">
              Content Format / Channel
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedContentType(type)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedContentType === type
                      ? 'border-accent-cyan bg-accent-cyan/10 text-nexus-100 dark:text-white font-medium shadow-sm'
                      : 'border-nexus-800 bg-nexus-950/40 text-nexus-400 hover:text-nexus-200 hover:border-nexus-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase text-nexus-300">
                Content Under Review
              </label>
              <span className="text-[11px] font-mono text-nexus-400">
                {inputContent.length} chars | {inputContent.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste or write the copy you want to evaluate (e.g. landing page hero copy, tweet thread, product pitch, or CTA)..."
              rows={4}
              disabled={isExecutingStage}
              className="w-full p-3.5 rounded-xl bg-nexus-950/80 border border-nexus-700 text-nexus-100 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent-cyan placeholder:text-nexus-500 disabled:opacity-50"
            />
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-nexus-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Audited against {brandName} voice rules, taboo terms, and strategic positioning.
            </span>

            <Button
              variant="glow"
              size="md"
              onClick={handleRunAudit}
              isLoading={isExecutingStage}
              disabled={!inputContent.trim() || isExecutingStage}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isExecutingStage
                ? executionProgress || 'Auditing Content...'
                : consistency
                ? 'Re-Audit Content'
                : 'Audit Content'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CONSISTENCY RESULTS PRESENTATION */}
      {consistency && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Integrity Score Header */}
          <div
            className={`p-4 sm:p-6 rounded-2xl border shadow-glow relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 ${
              consistency.overallIntegrityScore >= 80
                ? 'bg-nexus-900 border-emerald-500/30'
                : consistency.overallIntegrityScore >= 50
                ? 'bg-nexus-900 border-amber-500/30'
                : 'bg-nexus-900 border-rose-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              {/* Score Gauge */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 shadow-glow ${
                  consistency.overallIntegrityScore >= 80
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : consistency.overallIntegrityScore >= 50
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                }`}
              >
                <span className="text-xl sm:text-3xl font-bold font-mono">
                  {consistency.overallIntegrityScore}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase opacity-75">/ 100</span>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      consistency.overallIntegrityScore >= 80
                        ? 'emerald'
                        : consistency.overallIntegrityScore >= 50
                        ? 'amber'
                        : 'rose'
                    }
                    dot
                    className="font-mono text-xs uppercase"
                  >
                    {consistency.verdict.replace('_', ' ')}
                  </Badge>

                  {consistency.status && (
                    <Badge variant="default" className="text-[10px] uppercase font-mono">
                      Status: {consistency.status.replace('_', ' ')}
                    </Badge>
                  )}

                  <span className="text-[11px] sm:text-xs font-mono text-nexus-400">
                    Format: {consistency.contentType || selectedContentType}
                  </span>

                  <WhyThis
                    stageBadge="Stage 06 · Guardian Verdict"
                    title="Why this Integrity Score & Verdict?"
                    decision={`Score: ${consistency.overallIntegrityScore}/100 (${consistency.verdict.replace('_', ' ').toUpperCase()})`}
                    decisionSubtitle={consistency.executiveSummary}
                    inputs={[
                      { label: 'Audited Content Type', value: consistency.contentType || selectedContentType },
                      { label: 'Enforced Positioning', value: selectedDirection?.name || 'Strategic Vector' },
                      { label: 'Active Tone Rules', value: toneAttributes.slice(0, 3).join(', ') },
                    ]}
                    reasoning={`The Consistency Guardian cross-audited this copy across ${consistency.audits.length} dimensions. Verified core strengths: "${consistency.highImpactStrengths[0] || 'Verified strategic alignment'}".`}
                    tradeoff={consistency.keyVulnerabilities[0] ? `Identified Vulnerability: ${consistency.keyVulnerabilities[0]}` : undefined}
                    consideration={consistency.revisionRationale ? `Revision Rationale: ${consistency.revisionRationale}` : undefined}
                    triggerVariant="compact"
                  />
                  <ListenButton
                    id="guardian-verdict"
                    text={`Brand Consistency Verdict: ${consistency.verdict.replace('_', ' ')}. Overall integrity score: ${consistency.overallIntegrityScore} out of 100. ${consistency.executiveSummary}. ${consistency.keyVulnerabilities[0] ? `Identified Vulnerability: ${consistency.keyVulnerabilities[0]}.` : ''} ${consistency.revisionRationale ? `Revision Rationale: ${consistency.revisionRationale}.` : ''}`}
                    label="Listen"
                    size="xs"
                    variant="compact"
                  />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-nexus-100 dark:text-white tracking-tight break-words">
                  Brand Consistency Verdict
                </h2>
                <p className="text-xs sm:text-sm text-nexus-300 max-w-2xl leading-relaxed">
                  {consistency.executiveSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
              <Button
                variant="glow"
                size="md"
                onClick={() => setActiveStage('launch')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full lg:w-auto min-h-[44px] sm:min-h-[36px]"
              >
                Advance to Launch Kit
              </Button>
            </div>
          </div>

          {/* ORIGINAL VS SUGGESTED REVISION (DIFF / COMPARISON) */}
          {consistency.suggestedRevision && (
            <Card className="border-emerald-500/30 bg-nexus-900/60 shadow-lg">
              <CardHeader className="pb-3 border-b border-nexus-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    Comparative Brand Alignment Analysis
                  </CardTitle>
                  <span className="text-[11px] font-mono text-nexus-400">
                    Preserves user intent while enforcing brand tone &amp; rules
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Original Input */}
                  <div className="p-4 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-nexus-400">
                        Original Copy Under Review
                      </span>
                      <Badge variant="default" className="text-[10px] font-mono">
                        Original
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-nexus-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {consistency.auditedContent || inputContent}
                    </p>
                  </div>

                  {/* Suggested Revision */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Guardian Aligned Revision
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleApplySuggestedRevision}
                          leftIcon={<RotateCcw className="w-3 h-3" />}
                          className="h-6 text-[10px] px-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          Apply to Editor
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySuggestedRevision}
                          leftIcon={
                            copiedRevision ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )
                          }
                          className="h-6 text-[10px] px-2"
                        >
                          {copiedRevision ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-nexus-100 dark:text-white whitespace-pre-wrap leading-relaxed font-sans font-medium">
                      {consistency.suggestedRevision}
                    </p>
                  </div>
                </div>

                {/* Revision Rationale */}
                {consistency.revisionRationale && (
                  <div className="p-3.5 rounded-xl bg-nexus-950/80 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-mono font-bold uppercase text-accent-cyan block">
                      Strategic Rationale (Rule → Issue → Correction)
                    </span>
                    <p className="text-xs text-nexus-300 leading-relaxed">
                      {consistency.revisionRationale}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* DETECTED VIOLATIONS */}
          {consistency.violations && consistency.violations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" />
                  Detected Brand Violations ({consistency.violations.length})
                </h3>
                <span className="text-[11px] font-mono text-nexus-400">
                  Strictly audited against active voice &amp; taboo constraints
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {consistency.violations.map((violation) => {
                  const isCritical = violation.severity === 'critical';
                  const isWarning = violation.severity === 'warning';

                  return (
                    <Card
                      key={violation.id}
                      className={`border ${
                        isCritical
                          ? 'border-rose-500/30 bg-rose-950/10'
                          : isWarning
                          ? 'border-amber-500/30 bg-amber-950/10'
                          : 'border-blue-500/30 bg-blue-950/10'
                      }`}
                    >
                      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isCritical
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : isWarning
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </div>

                          <div className="space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-nexus-100 dark:text-white">
                                {violation.category}
                              </span>
                              <Badge
                                variant={isCritical ? 'rose' : isWarning ? 'amber' : 'default'}
                                className="text-[10px] uppercase font-mono"
                              >
                                {violation.severity}
                              </Badge>
                            </div>

                            {/* Flagged excerpt */}
                            <div className="p-2.5 rounded-lg bg-nexus-950/80 border border-nexus-800 text-xs font-mono text-rose-300">
                              <span className="text-nexus-400 uppercase text-[10px] block mb-1">
                                Flagged Text:
                              </span>
                              &quot;{violation.problematicText}&quot;
                            </div>

                            <p className="text-xs text-nexus-300 leading-relaxed">
                              {violation.explanation}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs pt-1">
                              <span className="text-[11px] font-mono text-accent-cyan">
                                <span className="text-nexus-400">Violated Rule: </span>
                                {violation.violatedRule}
                              </span>

                              {violation.suggestedFix && (
                                <span className="text-[11px] font-mono text-emerald-400">
                                  <span className="text-nexus-400">Suggested Fix: </span>
                                  &quot;{violation.suggestedFix}&quot;
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* STRENGTHS & VULNERABILITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-emerald-500/20 bg-nexus-900/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Verified Content Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs text-nexus-200">
                  {consistency.highImpactStrengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-nexus-900/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Strategic Vulnerabilities &amp; Safeguards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs text-nexus-200">
                  {consistency.keyVulnerabilities.map((vuln, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0 mt-1.5" />
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* SYSTEM COMPONENT AUDITS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-nexus-400">
                System Dimension Audits ({consistency.audits.length})
              </h3>
              <span className="text-[11px] font-mono text-nexus-400">
                Evaluated against: {selectedDirection?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {consistency.audits.map((audit) => {
                const isAligned = audit.status === 'aligned';
                const isWarning = audit.status === 'warning';

                return (
                  <Card
                    key={audit.id}
                    className={`border ${
                      isAligned
                        ? 'border-emerald-500/30 bg-nexus-900/60'
                        : isWarning
                        ? 'border-amber-500/30 bg-nexus-900/60'
                        : 'border-rose-500/30 bg-nexus-900/60'
                    }`}
                  >
                    <div className="p-4 flex flex-col justify-between h-full gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isAligned ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isWarning ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm font-bold text-nexus-100 dark:text-white truncate">
                              {audit.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <WhyThis
                              stageBadge={`Stage 06 · Audit: ${audit.component}`}
                              title={`Why this ${audit.title} Score?`}
                              decision={`${audit.alignmentScore}% Alignment (${audit.status.toUpperCase()})`}
                              decisionSubtitle={`Evaluated against: ${audit.evaluatedAgainst}`}
                              inputs={[
                                { label: 'Evaluated Against', value: audit.evaluatedAgainst },
                                { label: 'Enforced Guardrails', value: `Audited against ${brandName} guidelines` },
                              ]}
                              reasoning={`Finding: ${audit.finding}`}
                              tradeoff={`Actionable Recommendation: ${audit.recommendation}`}
                              triggerVariant="compact"
                            />
                            <Badge
                              variant={isAligned ? 'emerald' : isWarning ? 'amber' : 'rose'}
                              className="text-[10px] uppercase font-mono shrink-0"
                            >
                              {audit.alignmentScore}%
                            </Badge>
                          </div>
                        </div>

                        <p className="text-xs text-nexus-300 leading-relaxed">
                          {audit.finding}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-nexus-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-nexus-400 block truncate">
                          Basis: {audit.evaluatedAgainst}
                        </span>
                        {audit.recommendation && (
                          <p className="text-[11px] text-accent-cyan font-mono leading-snug">
                            <span className="text-nexus-400">Rec: </span>
                            {audit.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
