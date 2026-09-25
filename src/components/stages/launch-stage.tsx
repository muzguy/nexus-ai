'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
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
} from 'lucide-react';

export function LaunchStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Array<{ item: string; done: boolean; category: string }>>(
    () => project.launchKit?.launchChecklist || []
  );

  const launchKit = project.launchKit;
  const hasConsistency = Boolean(project.consistency);

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

  const exportProjectJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${(project.idea.title || 'nexus-brand').toLowerCase().replace(/\s+/g, '-')}-brand-system.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!hasConsistency) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <AlertBanner
          variant="warning"
          title="Prerequisite Incomplete"
          message="Launch kit generation requires passing the Consistency Guardian audit to ensure zero strategic drift."
        />
        <EmptyState
          icon={<Rocket className="w-8 h-8 text-amber-400" />}
          title="Guardian Verification Required"
          description="Return to Stage 6 (Consistency Guardian) to audit and verify your brand system integrity."
          actionLabel="Go to Guardian Audit"
          onAction={() => setActiveStage('consistency')}
        />
      </div>
    );
  }

  if (!launchKit) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={<Rocket className="w-8 h-8 text-indigo-400" />}
          title="Launch Kit Uncompiled"
          description="NEXUS will generate high-conversion landing page copy, one-line pitches, X launch threads, LinkedIn announcements, and Product Hunt assets grounded in your verified brand system."
          actionLabel="Generate Launch Kit & GTM Assets"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  const { landingPage, socialLaunch, oneLinePitch, elevatorPitch, pressSnippet } = launchKit;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Launch Control Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-nexus-900 via-nexus-850 to-nexus-900 border border-indigo-500/40 shadow-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Launch Kit Compiled & Verified
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Go-To-Market Brand Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-nexus-300 mt-1">
            Production-grade copy, landing page hierarchy, and multichannel campaigns ready for public release.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="glow"
            size="md"
            onClick={exportProjectJSON}
            leftIcon={<Download className="w-4 h-4 text-white" />}
          >
            Export Complete Brand JSON
          </Button>
        </div>
      </div>

      {/* Landing Page Hero Preview */}
      <Card className="border-indigo-500/30">
        <CardHeader>
          <div>
            <CardTitle>
              <Globe className="w-4 h-4 text-accent-cyan" />
              Landing Page Hero Architecture
            </CardTitle>
            <CardDescription>
              Conversion-focused headline, value props, and call-to-actions.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                `${landingPage.headline}\n${landingPage.subheadline}\nCTA: ${landingPage.primaryCta}`,
                'hero'
              )
            }
            leftIcon={
              copiedKey === 'hero' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )
            }
          >
            {copiedKey === 'hero' ? 'Copied Hero Copy' : 'Copy Copy'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simulated Hero Box */}
          <div className="p-8 sm:p-12 rounded-xl bg-nexus-950/80 border border-nexus-800 text-center space-y-4 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{landingPage.announcementPill}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              {landingPage.headline}
            </h1>

            <p className="text-sm sm:text-base text-nexus-300 max-w-2xl mx-auto leading-relaxed">
              {landingPage.subheadline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button variant="glow" size="lg">
                {landingPage.primaryCta}
              </Button>
              <Button variant="outline" size="lg">
                {landingPage.secondaryCta}
              </Button>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {landingPage.valuePillars.map((pillar, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">
                    {pillar.title}
                  </span>
                  <Badge variant="cyan" className="text-[10px] font-mono">
                    {pillar.badge}
                  </Badge>
                </div>
                <p className="text-nexus-300 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="pt-2 border-t border-nexus-850 text-emerald-400 font-mono text-[11px]">
                  Proof: {pillar.proofPoint}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pitches & Press Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Pitches */}
        <Card>
          <CardHeader>
            <CardTitle>Core Pitch Variations</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`${oneLinePitch}\n\n${elevatorPitch}`, 'pitches')}
            >
              {copiedKey === 'pitches' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                One-Line Pitch (Twitter Bio / Subtitle)
              </span>
              <p className="text-sm font-semibold text-white leading-snug bg-nexus-950/60 p-3 rounded-lg border border-nexus-850">
                {oneLinePitch}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                30-Second Elevator Pitch
              </span>
              <p className="text-nexus-200 leading-relaxed bg-nexus-950/60 p-3 rounded-lg border border-nexus-850">
                {elevatorPitch}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Press Release Snippet */}
        <Card>
          <CardHeader>
            <CardTitle>Press Announcement Snippet</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(pressSnippet, 'press')}
            >
              {copiedKey === 'press' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-nexus-300 leading-relaxed font-mono bg-nexus-950/60 p-4 rounded-lg border border-nexus-850">
              {pressSnippet}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Social Launch Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* X / Twitter Thread */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm">
              <MessageSquare className="w-4 h-4 text-accent-cyan" />
              X / Twitter Launch Thread
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(socialLaunch.xTwitterThread.join('\n\n---\n\n'), 'xthread')
              }
            >
              {copiedKey === 'xthread' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 overflow-y-auto max-h-96 text-xs">
            {socialLaunch.xTwitterThread.map((tweet, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-850 space-y-1"
              >
                <span className="text-[10px] font-mono text-nexus-500 block">
                  Tweet 0{i + 1}
                </span>
                <p className="text-nexus-200 whitespace-pre-line leading-relaxed">
                  {tweet}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* LinkedIn Post */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm">
              <Share2 className="w-4 h-4 text-indigo-400" />
              LinkedIn Launch Post
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(socialLaunch.linkedInPost, 'linkedin')}
            >
              {copiedKey === 'linkedin' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-96 text-xs">
            <div className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-850">
              <p className="text-nexus-200 whitespace-pre-line leading-relaxed">
                {socialLaunch.linkedInPost}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Hunt Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Product Hunt Launch Card
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
            >
              {copiedKey === 'ph' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 text-xs">
            <div className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-850 space-y-1">
              <span className="text-[10px] font-mono text-nexus-500 uppercase block">
                Product Name
              </span>
              <p className="text-white font-bold text-sm">
                {socialLaunch.productHuntCard.name}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-850 space-y-1">
              <span className="text-[10px] font-mono text-nexus-500 uppercase block">
                Tagline (under 60 chars)
              </span>
              <p className="text-nexus-200 font-medium">
                {socialLaunch.productHuntCard.tagline}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-nexus-950/60 border border-nexus-850 space-y-1">
              <span className="text-[10px] font-mono text-nexus-500 uppercase block">
                Maker First Comment
              </span>
              <p className="text-nexus-300 leading-relaxed">
                {socialLaunch.productHuntCard.firstComment}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Launch Readiness Checklist
          </CardTitle>
          <span className="text-xs font-mono text-emerald-400">
            {checklist.filter((c) => c.done).length} / {checklist.length} Verified
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item, i) => (
              <div
                key={i}
                onClick={() => toggleChecklist(i)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                  item.done
                    ? 'bg-nexus-900/60 border-emerald-500/30 text-white'
                    : 'bg-nexus-950/60 border-nexus-800 text-nexus-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-nexus-500 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through text-nexus-300' : ''}>
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
      </Card>
    </div>
  );
}
