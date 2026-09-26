'use client';

import React, { useState } from 'react';
import { useBrandProject } from '@/context/brand-project-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertBanner } from '@/components/ui/alert-banner';
import { WhyThis } from '@/components/ui/why-this';
import { ListenButton } from '@/components/ui/listen-button';
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

// ==========================================
// WCAG-Compliant Color & Contrast Utilities
// ==========================================
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = (hex || '#000000').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 15, g: 23, b: 42 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getAccessibleTextColor(
  bgHex: string,
  darkChoice = '#0f172a',
  lightChoice = '#ffffff'
): string {
  const contrastDark = getContrastRatio(bgHex, darkChoice);
  const contrastLight = getContrastRatio(bgHex, lightChoice);
  return contrastDark >= contrastLight ? darkChoice : lightChoice;
}

function getAccessibleAccentText(accentHex: string, surfaceHex: string): string {
  if (getContrastRatio(accentHex, surfaceHex) >= 4.5) return accentHex;
  const isLightSurface = getRelativeLuminance(surfaceHex) > 0.5;
  let { r, g, b } = hexToRgb(accentHex);
  for (let i = 0; i < 20; i++) {
    if (isLightSurface) {
      r = Math.floor(r * 0.85);
      g = Math.floor(g * 0.85);
      b = Math.floor(b * 0.85);
    } else {
      r = Math.min(255, Math.floor(r * 1.15 + 15));
      g = Math.min(255, Math.floor(g * 1.15 + 15));
      b = Math.min(255, Math.floor(b * 1.15 + 15));
    }
    const currentHex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    if (getContrastRatio(currentHex, surfaceHex) >= 4.5) return currentHex;
  }
  return isLightSurface ? '#0f172a' : '#f8fafc';
}

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

  // -------------------------------------------------------------
  // Semantic Preview CSS Variables & WCAG Contrast Calculation
  // -------------------------------------------------------------
  const isLight = previewTheme === 'light';

  const rawPrimary = colorMood.palette.primary?.hex || '#2563eb';
  const rawSecondary = colorMood.palette.secondary?.hex || '#475569';
  const rawAccent = colorMood.palette.accent?.hex || '#d97706';
  const rawBg = colorMood.palette.background?.hex || '#090d16';
  const rawSurface = colorMood.palette.surface?.hex || '#0f172a';
  const rawBorder = colorMood.palette.border?.hex || '#1e293b';

  // Compute theme-specific canvas & surface colors
  let previewBg: string;
  let previewSurface: string;
  let previewBorder: string;
  let previewText: string;
  let previewMuted: string;
  let previewSurfaceSecondary: string;

  if (isLight) {
    // Light Mode:
    // Respect light palette background if lum > 0.6; otherwise clean light canvas
    previewBg = getRelativeLuminance(rawBg) > 0.6 ? rawBg : '#f8fafc';
    // Respect light palette surface if lum > 0.7; otherwise crisp elevated white card
    previewSurface = getRelativeLuminance(rawSurface) > 0.7 ? rawSurface : '#ffffff';
    previewSurfaceSecondary = '#f1f5f9';
    // Clear visible border with contrast between 1.25 and 4 against surface
    const borderContrast = getContrastRatio(rawBorder, previewSurface);
    previewBorder = borderContrast >= 1.25 && borderContrast <= 4.0 ? rawBorder : '#e2e8f0';
    // Guaranteed high contrast on light surface (>10:1)
    previewText = '#0f172a';
    previewMuted = '#475569';
  } else {
    // Dark Mode:
    // Respect dark palette background if lum < 0.4; otherwise deep midnight slate
    previewBg = getRelativeLuminance(rawBg) < 0.4 ? rawBg : '#090d16';
    // Respect dark palette surface if lum < 0.45; otherwise elevated obsidian card
    previewSurface = getRelativeLuminance(rawSurface) < 0.45 ? rawSurface : '#0f172a';
    previewSurfaceSecondary = 'rgba(255, 255, 255, 0.04)';
    const borderContrast = getContrastRatio(rawBorder, previewSurface);
    previewBorder = borderContrast >= 1.25 ? rawBorder : '#334155';
    // Guaranteed high contrast on dark surface (>10:1)
    previewText = '#f8fafc';
    previewMuted = '#94a3b8';
  }

  // Accessible colors for interactive primary button
  const previewPrimaryText = getAccessibleTextColor(rawPrimary, '#0f172a', '#ffffff');

  // Accessible colors for secondary action
  const previewSecondaryBg = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)';
  const previewSecondaryText = isLight ? '#0f172a' : '#f8fafc';

  // Accessible colors for accent badge & action highlights
  const accentRgb = hexToRgb(rawAccent);
  const previewAccentBg = isLight
    ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.14)`
    : `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.22)`;
  const previewAccentBorder = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.45)`;

  // Ensure accent text has at least 4.5:1 contrast against the previewSurface while preserving brand hue
  const previewAccentText = getAccessibleAccentText(rawAccent, previewSurface);

  // Active Swatch target mapping for dynamic interaction
  const swatchRoleTargets: Record<string, { label: string; role: string; elementTarget: string }> = {
    primary: {
      label: 'Primary Token',
      role: 'Primary Action & Brand Identity',
      elementTarget: 'Primary Action Button & Brand Monogram',
    },
    secondary: {
      label: 'Secondary Token',
      role: 'Secondary UI & Structural Actions',
      elementTarget: 'Secondary Action Button & Neutral Surfaces',
    },
    accent: {
      label: 'Accent Token',
      role: 'High-Signal Context & Highlights',
      elementTarget: 'Live Environment Status Pill & Accent Highlights',
    },
    background: {
      label: 'Background Token',
      role: 'Canvas & Ambient Viewport',
      elementTarget: 'Application Canvas Viewport Background',
    },
    surface: {
      label: 'Surface Token',
      role: 'Card Container & Modular Panels',
      elementTarget: 'Elevated Product Workspace Card Container',
    },
    border: {
      label: 'Border Token',
      role: 'Hairline Micro-Boundaries & Dividers',
      elementTarget: 'Card Hairline Boundary & Partition Lines',
    },
  };

  const activeTargetInfo = swatchRoleTargets[selectedSwatchKey] || {
    label: `${selectedSwatchKey.toUpperCase()} Token`,
    role: currentSwatch.usageRole || 'Brand Token',
    elementTarget: 'Active Theme Element',
  };

  // Semantic CSS-variable dictionary bound directly to simulator root
  const previewStyle: React.CSSProperties = {
    ['--preview-bg' as any]: previewBg,
    ['--preview-surface' as any]: previewSurface,
    ['--preview-surface-secondary' as any]: previewSurfaceSecondary,
    ['--preview-border' as any]: previewBorder,
    ['--preview-text' as any]: previewText,
    ['--preview-muted' as any]: previewMuted,
    ['--preview-primary' as any]: rawPrimary,
    ['--preview-primary-text' as any]: previewPrimaryText,
    ['--preview-secondary' as any]: rawSecondary,
    ['--preview-secondary-bg' as any]: previewSecondaryBg,
    ['--preview-secondary-text' as any]: previewSecondaryText,
    ['--preview-accent' as any]: rawAccent,
    ['--preview-accent-bg' as any]: previewAccentBg,
    ['--preview-accent-border' as any]: previewAccentBorder,
    ['--preview-accent-text' as any]: previewAccentText,
  };

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
            <WhyThis
              stageBadge="Stage 05 · Visual System"
              title="Why this Visual Direction?"
              decision={visual.aestheticThesis}
              decisionSubtitle={`Visual Theme: ${colorMood.themeName} (${colorMood.lightingMood})`}
              inputs={[
                { label: 'Strategic Direction Anchor', value: project.selectedDirection?.name || 'Positioning Anchor' },
                { label: 'Brand Archetype', value: project.shapeData?.personality.primaryArchetype || project.personality?.primaryArchetype || 'Archetype' },
                { label: 'Composition Density', value: `${composition.density} (${composition.gridPrinciple})` },
              ]}
              reasoning={visual.rationale || `Visual design system engineered to project ${colorMood.lightingMood} precision. Primary token ${colorMood.palette.primary.name} anchors structural trust while ${colorMood.palette.accent.name} serves as high-signal visual emphasis.`}
              tradeoff={`Deliberate Visual Guardrails: Rejects ${visualAvoids.slice(0, 3).join('; ')} to ensure elevated, proprietary aesthetics.`}
              triggerVariant="compact"
            />
            <ListenButton
              id="visual-aesthetic-thesis"
              text={`Visual Aesthetic Thesis: ${visual.aestheticThesis}. Theme: ${colorMood.themeName}, ${colorMood.lightingMood}. ${rationale ? `Strategic Alignment: ${rationale}.` : ''}`}
              label="Listen"
              size="xs"
              variant="compact"
            />
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
            <div className="flex items-center gap-2">
              <CardTitle>
                <Palette className="w-4 h-4 text-accent-cyan" />
                Color Mood & Palette Tokens
              </CardTitle>
              <WhyThis
                stageBadge="Stage 05 · Color Palette"
                title="Why this Color Palette?"
                decision={`${colorMood.themeName} Palette`}
                decisionSubtitle={colorMood.description}
                inputs={[
                  { label: 'Primary Brand Color', value: `${colorMood.palette.primary.name} (${colorMood.palette.primary.hex}) — ${colorMood.palette.primary.meaning}` },
                  { label: 'Accent Color', value: `${colorMood.palette.accent.name} (${colorMood.palette.accent.hex}) — ${colorMood.palette.accent.meaning}` },
                  { label: 'Surface & Canvas', value: `${colorMood.palette.surface.name} on ${colorMood.palette.background.name}` },
                ]}
                reasoning={`The palette establishes an immediate psychological tone: ${colorMood.palette.primary.name} projects structural authority (${colorMood.palette.primary.meaning}), while ${colorMood.palette.accent.name} guides user focus to interactive actions (${colorMood.palette.accent.meaning}).`}
                tradeoff="Calibrated for WCAG AA contrast compliance across both dark and light modes, avoiding low-contrast grays or ambiguous hues."
                triggerVariant="compact"
              />
            </div>
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
                      color: getAccessibleTextColor(swatch.hex),
                    }}
                  >
                    {swatch.hex}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-nexus-100 dark:text-white block truncate">
                        {swatch.name}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0 animate-ping" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 block capitalize truncate">
                      {swatch.usageRole}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-mono text-accent-cyan font-bold block pt-0.5 truncate">
                        Active in Preview
                      </span>
                    )}
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexus-800 bg-nexus-950/50">
          <div>
            <CardTitle>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live Brand Application & Theme Simulator
            </CardTitle>
            <CardDescription>
              Interactive interface preview rendered dynamically using the generated color tokens.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Token Inspector Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-nexus-900 border border-nexus-700/70 text-xs font-mono">
              <span className="text-[10px] text-nexus-400">Inspecting:</span>
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0"
                style={{ backgroundColor: currentSwatch.hex }}
              />
              <span className="text-nexus-100 font-semibold text-[11px] truncate max-w-[120px]">
                {currentSwatch.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-nexus-800 text-accent-cyan uppercase font-bold">
                {selectedSwatchKey}
              </span>
            </div>

            {/* Theme Toggle (strictly scoped to simulator) */}
            <div className="flex items-center gap-1 bg-nexus-900 p-0.5 rounded-lg border border-nexus-800">
              <Button
                variant={previewTheme === 'dark' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewTheme('dark')}
                leftIcon={<Moon className="w-3 h-3" />}
                className="text-xs font-mono min-h-[30px] px-2.5 py-1 h-auto"
              >
                Dark
              </Button>
              <Button
                variant={previewTheme === 'light' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewTheme('light')}
                leftIcon={<Sun className="w-3 h-3" />}
                className="text-xs font-mono min-h-[30px] px-2.5 py-1 h-auto"
              >
                Light
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Dynamic Simulator Viewport using semantic CSS variables */}
        <CardContent
          className="p-4 sm:p-7 transition-colors duration-200 relative select-none"
          style={{
            ...previewStyle,
            backgroundColor: 'var(--preview-bg)',
          }}
          onClick={() => {
            if (selectedSwatchKey !== 'background') setSelectedSwatchKey('background');
          }}
          title="Click canvas background to inspect Background Swatch"
        >
          {/* Active Canvas Swatch Target Banner */}
          {selectedSwatchKey === 'background' && (
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-nexus-900/90 text-accent-cyan border border-accent-cyan shadow-glow-cyan animate-pulse">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--preview-bg)' }} />
              Active Swatch Target: Background ({currentSwatch.name} {currentSwatch.hex})
            </div>
          )}

          {/* Mock Product Workspace Header Preview */}
          <div
            className={`p-5 sm:p-7 rounded-2xl border transition-all duration-200 space-y-5 shadow-lg relative ${
              selectedSwatchKey === 'surface'
                ? 'ring-2 ring-accent-cyan shadow-glow-cyan'
                : selectedSwatchKey === 'border'
                ? 'ring-2 ring-indigo-400'
                : ''
            }`}
            style={{
              backgroundColor: 'var(--preview-surface)',
              borderColor: 'var(--preview-border)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedSwatchKey !== 'surface') setSelectedSwatchKey('surface');
            }}
            title="Click card surface to inspect Surface Swatch"
          >
            {/* Active Surface or Border Indicator Chip */}
            {(selectedSwatchKey === 'surface' || selectedSwatchKey === 'border') && (
              <div className="absolute top-2.5 right-4 text-[10px] font-mono px-2 py-0.5 rounded bg-nexus-900/90 text-accent-cyan border border-accent-cyan/40">
                {selectedSwatchKey === 'surface' ? 'Active Target: Surface Container' : 'Active Target: Border Hairline'}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Brand Title & Monogram (Primary Token) */}
              <div
                className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-all ${
                  selectedSwatchKey === 'primary' ? 'ring-1 ring-accent-cyan bg-nexus-800/40' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSwatchKey('primary');
                }}
                title="Click to inspect Primary Swatch"
              >
                <span
                  className="w-3 h-3 rounded-full transition-transform active:scale-95 shrink-0"
                  style={{
                    backgroundColor: 'var(--preview-primary)',
                    boxShadow: selectedSwatchKey === 'primary' ? '0 0 8px var(--preview-primary)' : undefined,
                  }}
                />
                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: 'var(--preview-text)' }}
                >
                  {project.selectedName || project.name || 'Brand System'}
                </span>
                {selectedSwatchKey === 'primary' && (
                  <span className="text-[9px] font-mono text-accent-cyan">● Primary</span>
                )}
              </div>

              {/* Context Pill (Accent Token) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSwatchKey('accent');
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  selectedSwatchKey === 'accent'
                    ? 'ring-2 ring-accent-cyan shadow-glow-cyan scale-105'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: 'var(--preview-accent-bg)',
                  color: 'var(--preview-accent-text)',
                  border: '1px solid var(--preview-accent-border)',
                }}
                title="Click to inspect Accent Swatch"
              >
                {applicationPreview?.cardPreviewContext || 'Live Environment'}
                {selectedSwatchKey === 'accent' && (
                  <span className="ml-1.5 text-[9px] uppercase font-bold text-accent-cyan">● Accent</span>
                )}
              </button>
            </div>

            <div className="space-y-2 max-w-2xl">
              <h3
                className="text-lg sm:text-2xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--preview-text)' }}
              >
                {applicationPreview?.headline || project.shapeData?.tagline || 'Engineered for Depth & Performance'}
              </h3>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: 'var(--preview-muted)' }}
              >
                {applicationPreview?.subheadline || project.shapeData?.oneLinePitch || 'A unified environment tailored for focus, craft, and architectural clarity.'}
              </p>
            </div>

            {/* Inset Sub-panel showcasing secondary surface and thesis */}
            <div
              className="p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              style={{
                backgroundColor: 'var(--preview-surface-secondary)',
                borderColor: 'var(--preview-border)',
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--preview-accent)' }}
                />
                <span
                  className="font-mono text-[11px] truncate"
                  style={{ color: 'var(--preview-text)' }}
                >
                  Thesis: {colorMood.themeName}
                </span>
              </div>
              <span
                className="font-mono text-[10px] shrink-0"
                style={{ color: 'var(--preview-muted)' }}
              >
                Target: {activeTargetInfo.elementTarget}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              {/* Primary Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSwatchKey('primary');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer ${
                  selectedSwatchKey === 'primary'
                    ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-transparent shadow-glow-cyan scale-105'
                    : ''
                }`}
                style={{
                  backgroundColor: 'var(--preview-primary)',
                  color: 'var(--preview-primary-text)',
                }}
                title="Click to inspect Primary Swatch"
              >
                {applicationPreview?.callToAction || 'Launch Workspace'}
                {selectedSwatchKey === 'primary' && ' (Primary)'}
              </button>

              {/* Secondary Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSwatchKey('secondary');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                  selectedSwatchKey === 'secondary'
                    ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-transparent shadow-glow-cyan scale-105'
                    : ''
                }`}
                style={{
                  backgroundColor: 'var(--preview-secondary-bg)',
                  borderColor: selectedSwatchKey === 'secondary' ? 'var(--preview-secondary)' : 'var(--preview-border)',
                  color: 'var(--preview-secondary-text)',
                }}
                title="Click to inspect Secondary Swatch"
              >
                Explore Architecture
                {selectedSwatchKey === 'secondary' && ' (Secondary)'}
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
