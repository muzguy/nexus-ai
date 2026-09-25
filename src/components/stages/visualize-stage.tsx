'use client';

import React from 'react';
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
} from 'lucide-react';

export function VisualizeStage() {
  const {
    project,
    setActiveStage,
    runCurrentStageAction,
    isExecutingStage,
  } = useBrandProject();

  const visual = project.visualDirection;
  const hasShape = Boolean(project.shapeData || project.personality);

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
          description="NEXUS will generate an executive visual brief covering typography systems, color mood palettes, layout composition, geometry, and imagery principles."
          actionLabel="Generate Visual Design Brief"
          onAction={runCurrentStageAction}
          isLoading={isExecutingStage}
        />
      </div>
    );
  }

  const { colorMood, typography, composition, shapesAndGeometry, imageryPrinciples, visualAvoids } =
    visual;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full box-border">
      {/* Aesthetic Thesis Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-nexus-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
              Aesthetic Thesis & Creative Direction
            </span>
            <Badge variant="cyan" className="text-[10px] font-mono">
              {colorMood.themeName}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-nexus-200 font-medium leading-relaxed">
            {visual.aestheticThesis}
          </p>
        </div>

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

      {/* Color Mood Palette */}
      <Card>
        <CardHeader>
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
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Object.entries(colorMood.palette).map(([key, swatch]) => (
              <div
                key={key}
                className="p-3 rounded-xl bg-nexus-950/70 border border-nexus-800 space-y-2.5 min-w-0"
              >
                {/* Visual Swatch */}
                <div
                  className="w-full h-14 sm:h-16 rounded-lg border border-nexus-700/40 shadow-inner flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-bold"
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
                  <p className="text-[11px] text-nexus-400 mt-1 leading-snug line-clamp-2">
                    {swatch.meaning}
                  </p>
                </div>
              </div>
            ))}
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
                className="p-4 rounded-xl bg-nexus-950/60 border border-nexus-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-accent-cyan tracking-wider">
                    {spec.role}
                  </span>
                  <span className="text-[10px] font-mono text-nexus-400">
                    Weights: {spec.recommendedWeights}
                  </span>
                </div>
                <div className="text-sm font-semibold text-nexus-100 dark:text-white">
                  {spec.fontFamily}
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
          </CardContent>
        </Card>
      </div>

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
