'use client';

import React from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';

export function ConsistencyStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const consistency = project.consistency;
  const hasPrerequisites = Boolean(
    project.selectedDirection && (project.shapeData || project.personality)
  );

  if (!hasPrerequisites) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <AlertBanner
          variant="warning"
          title="Prerequisites Incomplete"
          message="The Consistency Guardian requires defined brand positioning, identity, and visual directions before running a system audit."
        />
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-amber-400" />}
          title="Complete Prior Stages First"
          description="Complete the Shape and Visualize stages to generate brand assets for the Guardian to inspect."
          actionLabel="Go to Shape Stage"
          onAction={() => setActiveStage('shape')}
        />
      </div>
    );
  }

  if (!consistency) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-indigo-400" />}
          title="Consistency Guardian Unrun"
          description="The Guardian executes a multi-dimensional semantic audit verifying that your name, tagline, voice rules, and visual brief are 100% aligned with your selected strategic direction."
          actionLabel="Run Consistency Guardian Audit"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  const {
    overallIntegrityScore,
    verdict,
    executiveSummary,
    audits,
    highImpactStrengths,
    keyVulnerabilities,
    guardianStamp,
  } = consistency;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Integrity Score Header */}
      <div className="p-6 rounded-2xl bg-nexus-900/90 border border-emerald-500/30 shadow-glow relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          {/* Big Score Gauge */}
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center justify-center shrink-0 shadow-glow">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              {overallIntegrityScore}
            </span>
            <span className="text-[10px] font-mono text-nexus-400 uppercase">/ 100</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" dot className="font-mono text-xs uppercase">
                {verdict.replace('_', ' ')}
              </Badge>
              <span className="text-xs font-mono text-nexus-500">
                Verified: {new Date(guardianStamp.evaluatedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Brand System Integrity Audit
            </h2>
            <p className="text-xs sm:text-sm text-nexus-300 max-w-2xl leading-relaxed">
              {executiveSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="glow"
            size="md"
            onClick={() => setActiveStage('launch')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Advance to Launch Kit
          </Button>
        </div>
      </div>

      {/* Component Audits List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase tracking-wider text-nexus-400">
            System Component Audits ({audits.length})
          </h3>
          <span className="text-xs font-mono text-nexus-500">
            Evaluated against: {project.selectedDirection?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {audits.map((audit) => {
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
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isAligned
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isWarning
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isAligned ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {audit.title}
                        </span>
                        <Badge
                          variant={isAligned ? 'emerald' : isWarning ? 'amber' : 'rose'}
                          className="text-[10px] uppercase font-mono"
                        >
                          {audit.component.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-nexus-300 leading-relaxed">
                        {audit.finding}
                      </p>
                      {audit.recommendation && (
                        <p className="text-xs text-accent-cyan font-mono pt-1">
                          <span className="text-nexus-500">Recommendation: </span>
                          {audit.recommendation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-nexus-500 block uppercase">
                        Alignment
                      </span>
                      <span className="text-lg font-bold font-mono text-white">
                        {audit.alignmentScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Strengths & Vulnerabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-500/20">
          <CardHeader>
            <CardTitle>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              High-Impact System Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-xs text-nexus-200">
              {highImpactStrengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Strategic Vulnerabilities & Safeguards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-xs text-nexus-200">
              {keyVulnerabilities.map((vuln, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
