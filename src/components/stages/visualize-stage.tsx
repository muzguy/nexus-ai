'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import {
  Palette,
  Type,
  LayoutGrid,
  Box,
  Image as ImageIcon,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export function VisualizeStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const [selectedSwatchKey, setSelectedSwatchKey] = useState<string>('primary');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  const visual = project.visualDirection;
  const hasShape = Boolean(project.shapeData || project.personality);

  const handleCopyHex = (hex: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
      }
    } catch {
      // Fallback or ignore
    }
  };

  if (!hasShape) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <AlertBanner
          variant="warning"
          title="Prerequisite Missing"
          message="Visual brief generation requires defined brand personality, naming, and voice. Please complete the Shape stage first."
        />
        <EmptyState
          icon={<Palette className="w-8 h-8 text-amber-500" />}
          title="Brand Shape Required"
          description="Return to Stage 4 (Shape) to synthesize your brand identity, personality traits, and naming."
          actionLabel="Go to Shape Stage"
          onAction={() => setActiveStage('shape')}
        />
      </div>
    );
  }

  if (!visual) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 w-full box-border">
        <EmptyState
          icon={<Palette className="w-8 h-8 text-indigo-400" />}
          title="Visual Design Brief Uninitialized"
          description={`NEXUS will generate an executive visual brief covering typography systems, color mood palettes, layout composition, geometry, and imagery principles grounded in "${project.selectedName || project.name || 'your brand'}".`}
          actionLabel="Generate Visual Design Brief"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  const {
    colorMood,
    typography,
    composition,
    shapesAndGeometry,
    imageryPrinciples,
    visualAvoids,
    logoDirection,
    applicationPreview,
    rationale,
  } = visual;

  const currentSwatch = (colorMood.palette as any)[selectedSwatchKey] || colorMood.palette.primary;

  const isLight = previewTheme === 'light';
  const previewBg = isLight ? '#f8fafc' : colorMood.palette.background?.hex || '#090d16';
  const previewSurface = isLight ? '#ffffff' : colorMood.palette.surface?.hex || '#0f172a';
  const previewBorder = isLight ? '#e2e8f0' : colorMood.palette.border?.hex || '#1e293b';
  const previewTextPrimary = isLight ? '#0f172a' : '#f8fafc';
  const previewTextSecondary = isLight ? '#64748b' : '#94a3b8';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Aesthetic Thesis Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-nexus-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
              Aesthetic Thesis & Creative Direction
            </span>
            <Badge variant="cyan" className="text-[10px] font-mono">
              {colorMood.themeName}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-nexus-100 font-medium leading-relaxed">
            {visual.aestheticThesis}
          </p>
          {rationale && (
            <div className="pt-2 text-[11px] text-nexus-300 font-mono flex items-start gap-1.5">
              <Compass className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
              <span>
                <strong className="text-nexus-200">Strategic Alignment: </strong>
                {rationale}
              </span>
            </div>
          )}
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
            onClick={() => setActiveStage('consistency')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-[36px]"
          >
            Run Guardian Audit
          </Button>
        </div>
      </div>

      {/* Interactive Color Mood Palette Tokens */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>
              <Palette className="w-4 h-4 text-accent-cyan" />
              Color Mood & Palette Tokens
            </CardTitle>
            <CardDescription>{colorMood.description}</CardDescription>
          </div>
          <span className="text-xs font-mono text-nexus-400">
            {colorMood.lightingMood}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Object.entries(colorMood.palette).map(([key, swatch]) => {
              const isSelected = selectedSwatchKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSwatchKey(key)}
                  className={`p-3 rounded-xl transition-all text-left space-y-2.5 min-w-0 border ${
                    isSelected
                      ? 'bg-nexus-900 border-accent-cyan ring-2 ring-accent-cyan/50 shadow-glow-cyan'
                      : 'bg-nexus-950/70 border-nexus-800 hover:border-nexus-700'
                  }`}
                >
                  {/* Visual Swatch */}
                  <div
                    className="w-full h-14 sm:h-16 rounded-lg border border-nexus-700/40 shadow-inner flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-bold transition-transform active:scale-95"
                    style={{
                      backgroundColor: swatch.hex,
                      color:
                        swatch.hex.toLowerCase() === '#ffffff' ||
                        swatch.hex.toLowerCase() === '#00e5ff' ||
                        swatch.hex.toLowerCase() === '#f59e0b'
                          ? '#000000'
                          : '#ffffff',
                    }}
                  >
                    {swatch.hex}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-nexus-100 dark:text-white block truncate">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 block capitalize truncate">
                      {swatch.usageRole}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Swatch Inspector Panel */}
          {currentSwatch && (
            <div className="p-4 rounded-xl bg-nexus-950/80 border border-nexus-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg border border-nexus-700 shrink-0"
                  style={{ backgroundColor: currentSwatch.hex }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-nexus-100 dark:text-white">
                      {currentSwatch.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexus-850 text-accent-cyan">
                      {currentSwatch.usageRole}
                    </span>
                  </div>
                  <p className="text-xs text-nexus-300 mt-0.5 leading-snug">
                    {currentSwatch.meaning}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyHex(currentSwatch.hex)}
                leftIcon={
                  copiedHex === currentSwatch.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
                className="shrink-0 text-xs font-mono min-h-[36px]"
              >
                {copiedHex === currentSwatch.hex ? 'Copied!' : `Copy ${currentSwatch.hex}`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Theme Preview & Real Brand Application */}
      <Card className="border-indigo-500/30 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-nexus-800 bg-nexus-950/50">
          <div>
            <CardTitle>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live Brand Application & Theme Simulator
            </CardTitle>
            <CardDescription>
              Interactive interface preview rendered dynamically using the generated color tokens.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-nexus-400 mr-1">Preview Theme:</span>
            <Button
              variant={previewTheme === 'dark' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPreviewTheme('dark')}
              leftIcon={<Moon className="w-3 h-3" />}
              className="text-xs font-mono min-h-[32px] px-2.5"
            >
              Dark
            </Button>
            <Button
              variant={previewTheme === 'light' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPreviewTheme('light')}
              leftIcon={<Sun className="w-3 h-3" />}
              className="text-xs font-mono min-h-[32px] px-2.5"
            >
              Light
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 transition-colors duration-200" style={{ backgroundColor: previewBg }}>
          {/* Mock Product Workspace Header Preview */}
          <div
            className="p-5 sm:p-7 rounded-2xl border transition-all duration-200 space-y-5 shadow-lg"
            style={{
              backgroundColor: previewSurface,
              borderColor: previewBorder,
            }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colorMood.palette.primary?.hex }}
                />
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: previewTextPrimary }}>
                  {project.selectedName || project.name || 'Brand System'}
                </span>
              </div>
              <span
                className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${colorMood.palette.accent?.hex}20`,
                  color: colorMood.palette.accent?.hex,
                  border: `1px solid ${colorMood.palette.accent?.hex}40`,
                }}
              >
                {applicationPreview?.cardPreviewContext || 'Live Environment'}
              </span>
            </div>

            <div className="space-y-2 max-w-2xl">
              <h3
                className="text-lg sm:text-2xl font-bold tracking-tight leading-tight"
                style={{ color: previewTextPrimary }}
              >
                {applicationPreview?.headline || project.shapeData?.tagline || 'Engineered for Depth & Performance'}
              </h3>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: previewTextSecondary }}
              >
                {applicationPreview?.subheadline || project.shapeData?.oneLinePitch || 'A unified environment tailored for focus, craft, and architectural clarity.'}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-transform active:scale-95 text-white"
                style={{
                  backgroundColor: colorMood.palette.primary?.hex || '#6366f1',
                }}
              >
                {applicationPreview?.callToAction || 'Launch Workspace'}
              </button>
              <button
                type="button"
                className="px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors"
                style={{
                  borderColor: previewBorder,
                  color: previewTextSecondary,
                  backgroundColor: isLight ? '#f1f5f9' : '#0b1120',
                }}
              >
                Explore Architecture
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography System */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Type className="w-4 h-4 text-indigo-400" />
              Typography System & Hierarchies
            </CardTitle>
            <CardDescription>
              Pairing logic, scale ratios, and strict application rules.
            </CardDescription>
          </div>
          <Badge variant="primary" className="text-[10px] font-mono">
            {typography.length} Type Roles
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typography.map((spec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-accent-cyan tracking-wider">
                    {spec.role}
                  </span>
                  <span className="text-[10px] font-mono text-nexus-400">
                    Weights: {spec.recommendedWeights}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-nexus-100 dark:text-white">
                    {spec.fontFamily}
                  </div>
                  {/* Live Rendered Typography Sample */}
                  <div
                    className="mt-1.5 p-2.5 rounded bg-nexus-900/60 border border-nexus-850 text-nexus-200"
                    style={{
                      fontFamily: spec.fontFamily,
                      letterSpacing: spec.letterSpacing || 'normal',
                      lineHeight: spec.lineHeight || '1.4',
                    }}
                  >
                    <span className="text-xs">
                      {spec.role === 'display' || spec.role === 'headline'
                        ? 'Architecture precedes execution.'
                        : spec.role === 'mono'
                        ? 'fn init_system() -> Result<Sovereignty, Drift>'
                        : 'Rigorous cognitive systems require disciplined typographical structure.'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-nexus-300 leading-relaxed">
                  {spec.usageRule}
                </p>
                <div className="pt-2 border-t border-nexus-850 flex items-center justify-between text-[11px] font-mono text-nexus-400">
                  <span>Tracking: {spec.letterSpacing}</span>
                  <span>Line Height: {spec.lineHeight}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Composition, Shapes & Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Composition & Grid */}
        <Card>
          <CardHeader>
            <CardTitle>
              <LayoutGrid className="w-4 h-4 text-emerald-500" />
              Composition & Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Density Archetype
              </span>
              <Badge variant="emerald" className="text-xs font-mono capitalize">
                {composition.density}
              </Badge>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Grid Principle
              </span>
              <p className="text-nexus-200">{composition.gridPrinciple}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Whitespace Strategy
              </span>
              <p className="text-nexus-300">{composition.whiteSpaceStrategy}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shapes & Geometry */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Box className="w-4 h-4 text-accent-violet" />
              Geometry & Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Corner Radii
              </span>
              <p className="text-nexus-100 dark:text-white font-mono font-medium">
                {shapesAndGeometry.cornerRadii}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Border Philosophy
              </span>
              <p className="text-nexus-200">{shapesAndGeometry.borderPhilosophy}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Geometric Signatures
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {shapesAndGeometry.geometricSignatures.map((sig, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-nexus-850 border border-nexus-800 text-nexus-300"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagery Principles */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>
              <ImageIcon className="w-4 h-4 text-amber-500" />
              Imagery Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Style Archetype
              </span>
              <p className="text-nexus-200">{imageryPrinciples.style}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Approved Motifs
              </span>
              <ul className="space-y-1 text-nexus-300">
                {imageryPrinciples.approvedMotifs.map((motif, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                    <span>{motif}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-mono text-nexus-400 uppercase tracking-wider block mb-1">
                Lighting & Grading
              </span>
              <p className="text-nexus-300">{imageryPrinciples.lightingAndGrading}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Structured Logo / Visual Identity Direction */}
      {logoDirection && (
        <Card className="border-indigo-500/20">
          <CardHeader>
            <div>
              <CardTitle>
                <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                Logo & Symbol Direction
              </CardTitle>
              <CardDescription>
                Architectural guidance for mark construction, symbolism, and usage rules.
              </CardDescription>
            </div>
            <Badge variant="cyan" className="text-[10px] font-mono">
              Identity Mark
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-1.5">
                <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider block">
                  Conceptual Premise
                </span>
                <p className="text-nexus-100 font-semibold">{logoDirection.concept}</p>
                <p className="text-nexus-300 leading-relaxed pt-1 border-t border-nexus-850/60">
                  <strong className="text-nexus-400">Symbolism: </strong>
                  {logoDirection.symbolism}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-nexus-950/60 border border-nexus-850 space-y-1.5">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                  Construction & Proportion
                </span>
                <p className="text-nexus-200">{logoDirection.construction}</p>
                <p className="text-nexus-400 text-[11px] pt-1 border-t border-nexus-850/60">
                  <strong className="text-nexus-300">Clear Space: </strong>
                  {logoDirection.usageGuidance}
                </p>
              </div>
            </div>

            {logoDirection.avoids && logoDirection.avoids.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs">
                <span className="text-[10px] font-mono uppercase text-rose-500 dark:text-rose-400 tracking-wider block mb-1">
                  Logo Anti-Patterns
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {logoDirection.avoids.map((item, idx) => (
                    <span key={idx} className="text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <span>✕</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual Things to Avoid */}
      <Card className="border-rose-500/20 bg-rose-950/10">
        <CardHeader>
          <CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            Visual Anti-Patterns (Things We Deliberately Avoid)
          </CardTitle>
          <Badge variant="rose" className="text-[10px] font-mono">
            Anti-Design Rules
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-700 dark:text-rose-200">
            {visualAvoids.map((avoid, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-start gap-2.5"
              >
                <span className="text-rose-500 dark:text-rose-400 font-bold shrink-0">✕</span>
                <span className="break-words">{avoid}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
