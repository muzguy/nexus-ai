import { BrandProject } from '@/types';

export interface BrandDnaSignal {
  id: string;
  name: string;
  isDefined: boolean;
  stageSource: string;
}

export interface DerivedBrandDna {
  brandName: string;
  tagline?: string;
  conceptSummary?: string;

  targetAudience?: {
    primarySegment: string;
    painPoints?: string[];
    desires?: string[];
    urgencyDriver?: string;
  };

  positioning?: {
    directionName: string;
    archetype: string;
    tradeoff?: string;
    valueProposition?: string;
    isHumanSelected: boolean;
    rationale?: string;
  };

  valuePromise?: string;

  personality?: {
    primaryArchetype: string;
    secondaryArchetype?: string;
    coreTraits: Array<{ name: string; description: string; inAction?: string }>;
    traitsToAvoid: Array<{ name: string; reason: string }>;
  };

  voice?: {
    toneAttributes: string[];
    narrativeStyle?: string;
    keyVocabulary?: string[];
    tabooTerms?: string[];
  };

  differentiator?: {
    competitiveMoat?: string;
    keyDifferentiator?: string;
    differentiatorRationale?: string;
  };

  visual?: {
    themeName: string;
    aestheticThesis: string;
    lightingMood?: string;
    palette?: {
      primary?: { name: string; hex: string };
      secondary?: { name: string; hex: string };
      accent?: { name: string; hex: string };
      background?: { name: string; hex: string };
      surface?: { name: string; hex: string };
    };
    displayFont?: string;
    density?: string;
  };

  consistency?: {
    integrityScore?: number;
    verdict?: string;
    executiveSummary?: string;
  };

  signals: BrandDnaSignal[];
  definedSignalsCount: number;
  totalSignalsCount: number;
  maturityLabel: 'Emerging' | 'Defined' | 'Refined';
  hasGuardianFoundation: boolean;
}

/**
 * Derives a clean, structured Brand DNA projection from the current BrandProject state.
 * Fully deterministic, zero side-effects, zero artificial scoring.
 */
export function deriveBrandDna(project: BrandProject): DerivedBrandDna {
  const brandName =
    project.selectedName?.trim() ||
    project.idea?.title?.trim() ||
    (project.name?.trim() !== 'New Brand Project' ? project.name?.trim() : undefined) ||
    project.name?.trim() ||
    'Untitled Brand System';

  // 1. Essence
  const tagline =
    project.shapeData?.tagline?.trim() ||
    project.selectedDirection?.taglineConcept?.trim() ||
    undefined;

  const conceptSummary =
    project.idea?.rawConcept?.trim() ||
    project.discovery?.summary?.trim() ||
    undefined;

  const hasEssence = Boolean(tagline || (project.idea?.title && project.idea?.rawConcept));

  // 2. Audience
  let targetAudience: DerivedBrandDna['targetAudience'] = undefined;
  if (project.discovery?.audience?.primarySegment) {
    targetAudience = {
      primarySegment: project.discovery.audience.primarySegment,
      painPoints: project.discovery.audience.painPoints?.filter(Boolean),
      desires: project.discovery.audience.desires?.filter(Boolean),
      urgencyDriver: project.discovery.audience.urgencyDriver,
    };
  } else if (project.selectedDirection?.targetSegment) {
    targetAudience = {
      primarySegment: project.selectedDirection.targetSegment,
    };
  } else if (project.launchKit?.launchPositioning?.targetAudienceSummary) {
    targetAudience = {
      primarySegment: project.launchKit.launchPositioning.targetAudienceSummary,
    };
  }
  const hasAudience = Boolean(targetAudience?.primarySegment);

  // 3. Strategic Positioning
  let positioning: DerivedBrandDna['positioning'] = undefined;
  if (project.selectedDirection) {
    positioning = {
      directionName: project.selectedDirection.name,
      archetype: project.selectedDirection.archetype,
      tradeoff: project.selectedDirection.strategicTradeoff,
      valueProposition: project.selectedDirection.valueProposition,
      isHumanSelected: true,
      rationale: project.positioning?.rationale,
    };
  } else if (project.positioning?.directions && project.positioning.directions.length > 0) {
    const firstDir = project.positioning.directions[0];
    positioning = {
      directionName: firstDir.name,
      archetype: firstDir.archetype,
      tradeoff: firstDir.strategicTradeoff,
      valueProposition: firstDir.valueProposition,
      isHumanSelected: false,
      rationale: project.positioning.rationale,
    };
  }
  const hasPositioning = Boolean(positioning?.directionName);

  // 4. Value Promise
  const valuePromise =
    project.selectedDirection?.valueProposition?.trim() ||
    project.launchKit?.launchPositioning?.corePromise?.trim() ||
    project.shapeData?.oneLinePitch?.trim() ||
    undefined;
  const hasPromise = Boolean(valuePromise);

  // 5. Personality
  const personalitySrc = project.shapeData?.personality || project.personality;
  let personality: DerivedBrandDna['personality'] = undefined;
  if (personalitySrc?.primaryArchetype) {
    personality = {
      primaryArchetype: personalitySrc.primaryArchetype,
      secondaryArchetype: personalitySrc.secondaryArchetype,
      coreTraits: (personalitySrc.coreTraits || []).map((t) => ({
        name: t.name,
        description: t.description,
        inAction: t.inAction,
      })),
      traitsToAvoid: (personalitySrc.traitsToAvoid || []).map((t) => ({
        name: t.name,
        reason: t.reason,
      })),
    };
  }
  const hasPersonality = Boolean(personality?.primaryArchetype);

  // 6. Voice
  const voiceSrc = project.shapeData?.voice || project.voice;
  let voice: DerivedBrandDna['voice'] = undefined;
  if (voiceSrc && (voiceSrc.toneAttributes?.length || voiceSrc.narrativeStyle)) {
    voice = {
      toneAttributes: voiceSrc.toneAttributes || [],
      narrativeStyle: voiceSrc.narrativeStyle,
      keyVocabulary: voiceSrc.keyVocabulary || [],
      tabooTerms: voiceSrc.tabooTerms || [],
    };
  }
  const hasVoice = Boolean(voice && (voice.toneAttributes.length > 0 || voice.narrativeStyle));

  // 7. Differentiator & Moat
  let differentiator: DerivedBrandDna['differentiator'] = undefined;
  if (
    project.selectedDirection?.keyDifferentiator ||
    project.selectedDirection?.competitiveMoat ||
    project.launchKit?.launchPositioning?.differentiatorRationale
  ) {
    differentiator = {
      keyDifferentiator: project.selectedDirection?.keyDifferentiator,
      competitiveMoat: project.selectedDirection?.competitiveMoat,
      differentiatorRationale: project.launchKit?.launchPositioning?.differentiatorRationale,
    };
  }
  const hasDifferentiator = Boolean(
    differentiator?.keyDifferentiator ||
    differentiator?.competitiveMoat ||
    differentiator?.differentiatorRationale
  );

  // 8. Visual System
  let visual: DerivedBrandDna['visual'] = undefined;
  if (project.visualDirection) {
    const vd = project.visualDirection;
    const palette = vd.colorMood?.palette;
    visual = {
      themeName: vd.colorMood?.themeName || 'Proprietary Theme',
      aestheticThesis: vd.aestheticThesis,
      lightingMood: vd.colorMood?.lightingMood,
      palette: palette
        ? {
            primary: palette.primary ? { name: palette.primary.name, hex: palette.primary.hex } : undefined,
            secondary: palette.secondary ? { name: palette.secondary.name, hex: palette.secondary.hex } : undefined,
            accent: palette.accent ? { name: palette.accent.name, hex: palette.accent.hex } : undefined,
            background: palette.background ? { name: palette.background.name, hex: palette.background.hex } : undefined,
            surface: palette.surface ? { name: palette.surface.name, hex: palette.surface.hex } : undefined,
          }
        : undefined,
      displayFont: vd.typography?.find((t) => t.role === 'display')?.fontFamily,
      density: vd.composition?.density,
    };
  }
  const hasVisual = Boolean(visual?.aestheticThesis || visual?.themeName);

  // 9. Consistency Shield
  let consistency: DerivedBrandDna['consistency'] = undefined;
  if (project.consistency) {
    consistency = {
      integrityScore: project.consistency.overallIntegrityScore,
      verdict: project.consistency.verdict,
      executiveSummary: project.consistency.executiveSummary,
    };
  }
  const hasConsistency = Boolean(consistency?.integrityScore !== undefined);

  // Defined Signals Tracking
  const signals: BrandDnaSignal[] = [
    { id: 'essence', name: 'Brand Essence', isDefined: hasEssence, stageSource: 'Stage 01 · Discover' },
    { id: 'audience', name: 'Target Audience', isDefined: hasAudience, stageSource: 'Stage 01 · Discover' },
    { id: 'positioning', name: 'Strategic Positioning', isDefined: hasPositioning, stageSource: 'Stage 02 · Position' },
    { id: 'promise', name: 'Value Promise', isDefined: hasPromise, stageSource: 'Stage 03 · Brand Battle' },
    { id: 'personality', name: 'Brand Personality', isDefined: hasPersonality, stageSource: 'Stage 04 · Shape' },
    { id: 'voice', name: 'Brand Voice', isDefined: hasVoice, stageSource: 'Stage 04 · Shape' },
    { id: 'differentiator', name: 'Competitive Moat', isDefined: hasDifferentiator, stageSource: 'Stage 03 & 07' },
    { id: 'visual', name: 'Visual Direction', isDefined: hasVisual, stageSource: 'Stage 05 · Visualize' },
    { id: 'consistency', name: 'Guardian Alignment', isDefined: hasConsistency, stageSource: 'Stage 06 · Consistency' },
  ];

  const definedSignalsCount = signals.filter((s) => s.isDefined).length;
  const totalSignalsCount = signals.length;

  let maturityLabel: DerivedBrandDna['maturityLabel'] = 'Emerging';
  if (definedSignalsCount >= 7) {
    maturityLabel = 'Refined';
  } else if (definedSignalsCount >= 4) {
    maturityLabel = 'Defined';
  }

  // Used by Guardian to keep future content aligned
  const hasGuardianFoundation = Boolean(hasPersonality && hasVoice);

  return {
    brandName,
    tagline,
    conceptSummary,
    targetAudience,
    positioning,
    valuePromise,
    personality,
    voice,
    differentiator,
    visual,
    consistency,
    signals,
    definedSignalsCount,
    totalSignalsCount,
    maturityLabel,
    hasGuardianFoundation,
  };
}
