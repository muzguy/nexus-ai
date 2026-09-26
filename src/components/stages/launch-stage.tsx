'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import {
  Rocket,
  Copy,
  Check,
  Download,
  Share2,
  Globe,
  Sparkles,
  CheckSquare,
  Square,
  MessageSquare,
  Calendar,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  Users,
  CheckCircle2,
  Target,
  Clock,
  Compass,
} from 'lucide-react';
import { LaunchChannel } from '@/types/launch';

export function LaunchStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
    executionProgress,
    error,
    clearError,
  } = useBrandProject();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Section collapse states
  const [sectionsOpen, setSectionsOpen] = useState({
    positioning: true,
    hero: true,
    channels: true,
    social: true,
    sequence: true,
    firstWeek: true,
    signals: true,
    checklist: true,
  });

  const [checklist, setChecklist] = useState<Array<{ item: string; done: boolean; category: string }>>(
    () => project.launchKit?.launchChecklist || []
  );

  const launchKit = project.launchKit;
  const hasPrerequisites = Boolean(
    project.selectedDirection &&
    (project.shapeData || project.personality) &&
    project.consistency
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  };

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev [section] }));
  };

  const exportProjectJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${(project.selectedName || project.idea.title || 'nexus-brand')
        .toLowerCase()
        .replace(/\s+/g, '-')}-complete-brand-system.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!hasPrerequisites) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisite Incomplete"
          message="Launch Kit synthesis requires completing prior stages and passing the Consistency Guardian audit to ensure zero strategic drift."
        />
        <EmptyState
          icon={<Rocket className="w-8 h-8 text-amber-500" />}
          title="Guardian Verification Required"
          description="Return to Stage 6 (Consistency Guardian) to audit and verify your brand system integrity before generating launch assets."
          actionLabel="Go to Guardian Audit"
          onAction={() => setActiveStage('consistency')}
        />
      </div>
    );
  }

  if (!launchKit) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        {error && (
          <AlertBanner
            variant="danger"
            title="Launch Synthesis Error"
            message={error}
            action={{ label: 'Retry', onClick: runCurrentStageAction }}
          />
        )}
        <EmptyState
          icon={<Rocket className="w-8 h-8 text-indigo-400" />}
          title="Launch Kit Uncompiled"
          description="NEXUS will generate a production-ready GTM Launch Kit including high-conversion landing page copy, multichannel campaigns, tailored launch channels, a 7-day launch sequence, and early success signals."
          actionLabel="Synthesize Launch Kit &amp; GTM Assets"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  const {
    landingPage,
    socialLaunch,
    oneLinePitch,
    elevatorPitch,
    pressSnippet,
    launchPositioning,
    coreMessage,
    audienceAngles,
    launchChannels,
    launchContent,
    launchSequence,
    firstWeekPlan,
    successSignals,
  } = launchKit;

  // Selected channel for exploration
  const activeChannels = launchChannels || [];
  const selectedChannel: LaunchChannel | undefined =
    activeChannels.find((c) => c.id === selectedChannelId) || activeChannels[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border animate-fadeIn">
      {/* Error Banner */}
      {error && (
        <AlertBanner
          variant="danger"
          title="Launch Synthesis Error"
          message={error}
          action={{ label: 'Retry Synthesis', onClick: runCurrentStageAction }}
        />
      )}

      {/* Launch Control Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-nexus-900 border border-indigo-500/40 shadow-glow flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-glow shrink-0" />
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Launch Kit Compiled &amp; Verified
            </span>
            <Badge variant="primary" className="text-[10px] font-mono uppercase">
              {project.selectedName || project.name}
            </Badge>
            <Badge variant="cyan" className="text-[10px] font-mono">
              {project.selectedDirection?.name}
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-nexus-100 dark:text-white tracking-tight">
            Go-To-Market Brand Intelligence &amp; Launch System
          </h2>
          <p className="text-xs sm:text-sm text-nexus-300 mt-1 max-w-3xl leading-relaxed">
            The culmination of the NEXUS cognitive pipeline. Production-grade copy, multichannel campaigns, tailored launch channels, and a 7-day sequence grounded in verified brand strategy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={runCurrentStageAction}
            isLoading={isExecutingStage}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Re-synthesize
          </Button>

          <Button
            variant="glow"
            size="md"
            onClick={exportProjectJSON}
            leftIcon={<Download className="w-4 h-4 text-white" />}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] text-xs"
          >
            Export Complete Brand JSON
          </Button>
        </div>
      </div>

      {/* 1. GTM POSITIONING & CORE MESSAGING */}
      {launchPositioning && (
        <Card className="border-indigo-500/30 bg-nexus-900/60 shadow-lg">
          <div
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
            onClick={() => toggleSection('positioning')}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base">GTM Positioning &amp; Brand Promise</CardTitle>
                  <WhyThis
                    stageBadge="Stage 07 · GTM Strategy"
                    title="Why this GTM Positioning?"
                    decision={launchPositioning.positioningStatement}
                    decisionSubtitle={`Core Promise: "${launchPositioning.corePromise}"`}
                    inputs={[
                      { label: 'Target Audience Profile', value: launchPositioning.targetAudienceSummary },
                      { label: 'Strategic Vector Anchor', value: project.selectedDirection?.name || 'Positioning Vector' },
                      { label: 'Beachhead Launch Goal', value: project.discovery?.goals.immediateLaunchGoal || 'Beachhead conversion' },
                    ]}
                    reasoning={`Differentiator Rationale: ${launchPositioning.differentiatorRationale}`}
                    tradeoff="Concentrates all launch positioning on high-intent early adopters rather than generic mass-market messaging."
                    triggerVariant="compact"
                  />
                </div>
                <CardDescription className="text-xs">
                  The foundational strategic narrative that anchors all launch communications.
                </CardDescription>
              </div>
            </div>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.positioning ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {sectionsOpen.positioning && (
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="p-4 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan block">
                  Concise Positioning Statement
                </span>
                <p className="text-sm sm:text-base font-semibold text-nexus-100 dark:text-white leading-relaxed">
                  {launchPositioning.positioningStatement}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1">
                <div className="p-3.5 rounded-xl bg-nexus-950/50 border border-nexus-850 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-nexus-400 block">Who It Is For</span>
                  <p className="text-xs text-nexus-200 leading-relaxed">{launchPositioning.targetAudienceSummary}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-nexus-950/50 border border-nexus-850 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block">Core Promise</span>
                  <p className="text-xs text-nexus-200 leading-relaxed">{launchPositioning.corePromise}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-nexus-950/50 border border-nexus-850 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 block">Why It&apos;s Different</span>
                  <p className="text-xs text-nexus-200 leading-relaxed">{launchPositioning.differentiatorRationale}</p>
                </div>
              </div>

              {/* Audience Specific Angles */}
              {audienceAngles && audienceAngles.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-nexus-400 block">
                    Audience-Specific Message Angles
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {audienceAngles.map((angle, i) => (
                      <div key={i} className="p-3 rounded-lg bg-nexus-950/40 border border-nexus-850 space-y-1 text-xs">
                        <Badge variant="default" className="text-[10px] font-mono mb-1">
                          {angle.segment}
                        </Badge>
                        <p className="text-nexus-300 font-medium">{angle.angle}</p>
                        <p className="text-accent-cyan font-mono text-[11px] pt-1">&ldquo;{angle.tailoredHook}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* 2. LANDING PAGE HERO ARCHITECTURE */}
      <Card className="border-indigo-500/30">
        <div
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
          onClick={() => toggleSection('hero')}
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-accent-cyan" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base">Landing Page Hero Architecture</CardTitle>
                <WhyThis
                  stageBadge="Stage 07 · Landing Page Hero"
                  title="Why this Hero Architecture?"
                  decision={`Headline: "${landingPage.headline}"`}
                  decisionSubtitle={`CTA: "${landingPage.primaryCta}"`}
                  inputs={[
                    { label: 'Tagline Anchor', value: project.shapeData?.tagline || project.selectedDirection?.taglineConcept || 'Tagline' },
                    { label: 'Core Value Proposition', value: project.selectedDirection?.valueProposition || 'Value proposition' },
                    { label: 'Audience Urgency', value: project.discovery?.audience.urgencyDriver || 'Immediate time-to-value' },
                  ]}
                  reasoning={`Translates strategic value into a punchy, benefit-first hero section with supporting proof points (${landingPage.valuePillars.map((p) => p.badge).join(', ')}).`}
                  tradeoff="Rejects passive descriptive copy in favor of decisive outcome-driven claims."
                  triggerVariant="compact"
                />
              </div>
              <CardDescription className="text-xs">
                Conversion-focused headline, value props, and call-to-actions.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(
                  `${landingPage.headline}\n${landingPage.subheadline}\nCTA: ${landingPage.primaryCta}`,
                  'hero'
                );
              }}
              leftIcon={
                copiedKey === 'hero' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              className="h-7 text-xs"
            >
              {copiedKey === 'hero' ? 'Copied' : 'Copy Hero'}
            </Button>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.hero ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {sectionsOpen.hero && (
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Simulated Hero Box */}
            <div className="p-4 sm:p-8 md:p-12 rounded-xl bg-nexus-950/80 border border-nexus-800 text-center space-y-4 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400 max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                <span className="truncate">{landingPage.announcementPill}</span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-nexus-100 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight break-words">
                {landingPage.headline}
              </h1>

              <p className="text-xs sm:text-base text-nexus-300 max-w-2xl mx-auto leading-relaxed">
                {landingPage.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full sm:w-auto min-h-[44px]">
                  {landingPage.primaryCta}
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px]">
                  {landingPage.secondaryCta}
                </Button>
              </div>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {landingPage.valuePillars.map((pillar, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-nexus-100 dark:text-white text-sm">
                      {pillar.title}
                    </span>
                    <Badge variant="cyan" className="text-[10px] font-mono">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <p className="text-nexus-300 leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="pt-2 border-t border-nexus-850 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                    Proof: {pillar.proofPoint}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* 3. TAILORED LAUNCH CHANNELS & EXPLORER */}
      {activeChannels.length > 0 && (
        <Card className="border-indigo-500/30">
          <div
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
            onClick={() => toggleSection('channels')}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <CardTitle className="text-base">Recommended Launch Channels ({activeChannels.length})</CardTitle>
                <CardDescription className="text-xs">
                  Tailored distribution channels selected specifically for your audience demographics and brand voice.
                </CardDescription>
              </div>
            </div>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.channels ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {sectionsOpen.channels && (
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeChannels.map((channel) => {
                  const isSelected = selectedChannel?.id === channel.id;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannelId(channel.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'border-accent-cyan bg-accent-cyan/10 shadow-glow'
                          : 'border-nexus-800 bg-nexus-950/60 hover:border-nexus-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-bold text-nexus-100 dark:text-white text-xs sm:text-sm">
                          {channel.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <WhyThis
                            stageBadge={`Stage 07 · Channel: ${channel.name}`}
                            title={`Why ${channel.name}?`}
                            decision={`${channel.name} (${channel.priority.toUpperCase()} Priority)`}
                            decisionSubtitle={channel.purpose}
                            inputs={[
                              { label: 'Target Audience Profile', value: launchPositioning?.targetAudienceSummary || project.discovery?.audience.primarySegment || 'Primary Audience' },
                              { label: 'Brand Voice Tone', value: project.shapeData?.voice.toneAttributes.slice(0, 2).join(', ') || 'Direct' },
                              { label: 'Suggested Format', value: channel.suggestedFormat },
                            ]}
                            reasoning={`Fit Rationale: ${channel.fitRationale}`}
                            tradeoff={`Recommended Action: ${channel.recommendedAction}. Prioritizing this channel focuses bandwidth where conversion probability is highest.`}
                            triggerVariant="compact"
                          />
                          <Badge
                            variant={
                              channel.priority === 'primary'
                                ? 'emerald'
                                : channel.priority === 'secondary'
                                ? 'cyan'
                                : 'amber'
                            }
                            className="text-[10px] font-mono uppercase"
                          >
                            {channel.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-nexus-300 line-clamp-2">{channel.purpose}</p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Channel Detailed Inspector */}
              {selectedChannel && (
                <div className="p-4 sm:p-5 rounded-xl bg-nexus-950/80 border border-nexus-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-accent-cyan">
                      Channel Deep Dive: {selectedChannel.name}
                    </span>
                    <Badge variant="primary" className="text-[10px] font-mono">
                      Priority: {selectedChannel.priority}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-nexus-400 block uppercase">Audience Fit Rationale</span>
                      <p className="text-nexus-200 leading-relaxed">{selectedChannel.fitRationale}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-nexus-400 block uppercase">Suggested Content Format</span>
                      <p className="text-nexus-200 leading-relaxed">{selectedChannel.suggestedFormat}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 block uppercase">Recommended Immediate Action</span>
                      <p className="text-nexus-200 leading-relaxed font-medium">{selectedChannel.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* 4. SOCIAL LAUNCH CAMPAIGNS */}
      <Card className="border-indigo-500/30">
        <div
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
          onClick={() => toggleSection('social')}
        >
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-accent-cyan" />
            <div>
              <CardTitle className="text-base">Multichannel Social Launch Assets</CardTitle>
              <CardDescription className="text-xs">
                Turnkey launch content for X, LinkedIn, and Product Hunt calibrated to your brand voice.
              </CardDescription>
            </div>
          </div>
          <button type="button" className="p-1 text-nexus-400">
            {sectionsOpen.social ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {sectionsOpen.social && (
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* X / Twitter Thread */}
              <Card className="flex flex-col bg-nexus-950/60 border-nexus-850">
                <CardHeader className="pb-3 border-b border-nexus-850">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent-cyan" />
                      X / Twitter Launch Thread
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(socialLaunch.xTwitterThread.join('\n\n---\n\n'), 'xthread')
                      }
                      className="h-7 px-2 text-xs"
                    >
                      {copiedKey === 'xthread' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 overflow-y-auto max-h-96 text-xs p-4">
                  {socialLaunch.xTwitterThread.map((tweet, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-800 space-y-1"
                    >
                      <span className="text-[10px] font-mono text-nexus-400 block">Tweet 0{i + 1}</span>
                      <p className="text-nexus-200 whitespace-pre-line leading-relaxed">{tweet}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* LinkedIn Post */}
              <Card className="flex flex-col bg-nexus-950/60 border-nexus-850">
                <CardHeader className="pb-3 border-b border-nexus-850">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      LinkedIn Launch Post
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(socialLaunch.linkedInPost, 'linkedin')}
                      className="h-7 px-2 text-xs"
                    >
                      {copiedKey === 'linkedin' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto max-h-96 text-xs p-4">
                  <div className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-800">
                    <p className="text-nexus-200 whitespace-pre-line leading-relaxed">
                      {socialLaunch.linkedInPost}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Product Hunt Card */}
              <Card className="flex flex-col bg-nexus-950/60 border-nexus-850">
                <CardHeader className="pb-3 border-b border-nexus-850">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Product Hunt Card
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `Product: ${socialLaunch.productHuntCard.name}\nTagline: ${socialLaunch.productHuntCard.tagline}\nComment: ${socialLaunch.productHuntCard.firstComment}`,
                          'ph'
                        )
                      }
                      className="h-7 px-2 text-xs"
                    >
                      {copiedKey === 'ph' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 text-xs p-4">
                  <div className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-800 space-y-1">
                    <span className="text-[10px] font-mono text-nexus-400 uppercase block">Product Name</span>
                    <p className="text-nexus-100 dark:text-white font-bold text-sm">{socialLaunch.productHuntCard.name}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-800 space-y-1">
                    <span className="text-[10px] font-mono text-nexus-400 uppercase block">Tagline (under 60 chars)</span>
                    <p className="text-nexus-200 font-medium">{socialLaunch.productHuntCard.tagline}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-nexus-900/60 border border-nexus-800 space-y-1">
                    <span className="text-[10px] font-mono text-nexus-400 uppercase block">Maker Comment</span>
                    <p className="text-nexus-300 leading-relaxed">{socialLaunch.productHuntCard.firstComment}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 5. LAUNCH CONTENT PACK (FOUNDER LETTER & COMMUNITY ANNOUNCEMENT) */}
      {launchContent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-nexus-900/60 border-nexus-800">
            <CardHeader className="pb-3 border-b border-nexus-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  Founder Announcement Letter
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(launchContent.founderLetter, 'founderLetter')}
                  className="h-7 px-2"
                >
                  {copiedKey === 'founderLetter' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs">
              <p className="text-nexus-200 whitespace-pre-line leading-relaxed font-sans bg-nexus-950/70 p-4 rounded-xl border border-nexus-850">
                {launchContent.founderLetter}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-nexus-900/60 border-nexus-800">
            <CardHeader className="pb-3 border-b border-nexus-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-cyan" />
                  Campus &amp; Community Cohort Post
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(launchContent.communityPost, 'communityPost')}
                  className="h-7 px-2"
                >
                  {copiedKey === 'communityPost' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs">
              <p className="text-nexus-200 whitespace-pre-line leading-relaxed font-sans bg-nexus-950/70 p-4 rounded-xl border border-nexus-850">
                {launchContent.communityPost}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. LAUNCH SEQUENCE (PRE-LAUNCH -> LAUNCH DAY -> POST-LAUNCH) */}
      {launchSequence && launchSequence.length > 0 && (
        <Card className="border-indigo-500/30">
          <div
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
            onClick={() => toggleSection('sequence')}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <CardTitle className="text-base">Three-Phase Launch Sequence</CardTitle>
                <CardDescription className="text-xs">
                  Chronological execution cadence covering preparation, release day drop, and retention.
                </CardDescription>
              </div>
            </div>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.sequence ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {sectionsOpen.sequence && (
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {launchSequence.map((seq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-3 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            seq.phase === 'pre_launch'
                              ? 'amber'
                              : seq.phase === 'launch_day'
                              ? 'emerald'
                              : 'cyan'
                          }
                          className="text-[10px] font-mono uppercase"
                        >
                          {seq.phase.replace('_', ' ')}
                        </Badge>
                        <span className="text-[10px] font-mono text-nexus-400">{seq.timing}</span>
                      </div>
                      <h4 className="font-bold text-nexus-100 dark:text-white text-sm">{seq.title}</h4>
                      <p className="text-nexus-300 leading-relaxed">{seq.action}</p>
                    </div>

                    <div className="pt-2 border-t border-nexus-850 space-y-1.5">
                      <div>
                        <span className="text-[10px] font-mono text-nexus-400 block uppercase">Purpose</span>
                        <p className="text-nexus-300 text-[11px]">{seq.purpose}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 block uppercase">Success Signal</span>
                        <p className="text-nexus-200 text-[11px] font-medium">{seq.successSignal}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 7. FIRST-WEEK EXECUTION PLAN */}
      {firstWeekPlan && firstWeekPlan.length > 0 && (
        <Card className="border-indigo-500/30">
          <div
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
            onClick={() => toggleSection('firstWeek')}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-accent-cyan" />
              <div>
                <CardTitle className="text-base">First-Week Day-by-Day Launch Plan</CardTitle>
                <CardDescription className="text-xs">
                  Concrete operational focus, actions, and expected outcomes from Day 1 through Day 7.
                </CardDescription>
              </div>
            </div>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.firstWeek ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {sectionsOpen.firstWeek && (
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {firstWeekPlan.map((plan, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" className="text-[10px] font-mono">
                        {plan.day}
                      </Badge>
                      <span className="text-[10px] font-mono text-nexus-400">{plan.focus}</span>
                    </div>
                    <p className="text-nexus-200 font-medium leading-relaxed">{plan.action}</p>
                    <div className="pt-2 border-t border-nexus-850 text-accent-cyan text-[11px] font-mono">
                      Target: {plan.targetOutcome}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 8. SUCCESS SIGNALS & METRICS */}
      {successSignals && successSignals.length > 0 && (
        <Card className="border-indigo-500/30">
          <div
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
            onClick={() => toggleSection('signals')}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <div>
                <CardTitle className="text-base">Early Validation Success Signals</CardTitle>
                <CardDescription className="text-xs">
                  Measurable metrics to confirm product-market fit and brand resonance.
                </CardDescription>
              </div>
            </div>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.signals ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {sectionsOpen.signals && (
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {successSignals.map((sig, i) => (
                  <div key={i} className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-nexus-100 dark:text-white text-sm">{sig.metric}</span>
                      <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
                      Target: {sig.target}
                    </div>
                    <p className="text-nexus-300 leading-relaxed text-[11px] pt-1">{sig.whyItMatters}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 9. LAUNCH READINESS CHECKLIST */}
      <Card>
        <div
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-nexus-800"
          onClick={() => toggleSection('checklist')}
        >
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <div>
              <CardTitle className="text-base">Launch Readiness Checklist</CardTitle>
              <CardDescription className="text-xs">
                Essential pre-flight verification items before public announcement.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {checklist.filter((c) => c.done).length} / {checklist.length} Verified
            </span>
            <button type="button" className="p-1 text-nexus-400">
              {sectionsOpen.checklist ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {sectionsOpen.checklist && (
          <CardContent className="p-4 sm:p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleChecklist(i)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs min-h-[44px] ${
                    item.done
                      ? 'bg-nexus-900/60 border-emerald-500/30 text-nexus-100 dark:text-white'
                      : 'bg-nexus-950/60 border-nexus-800 text-nexus-400 hover:text-nexus-100 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-nexus-400 shrink-0" />
                    )}
                    <span className={`truncate ${item.done ? 'line-through text-nexus-400' : ''}`}>
                      {item.item}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    {item.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
