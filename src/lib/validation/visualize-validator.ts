import {
  VisualDirection,
  ColorMood,
  ColorSwatch,
  TypographySpec,
  LogoDirection,
  BrandApplicationPreview,
} from '@/types/visual';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

const HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;

function sanitizeHex(hexRaw: any, defaultFallback: string): string {
  let val = String(hexRaw || '').trim();
  if (!val) return defaultFallback;
  if (!val.startsWith('#')) {
    val = `#${val}`;
  }
  return HEX_REGEX.test(val) ? val : defaultFallback;
}

/**
 * Validates and sanitizes raw JSON returned by Google Gemini into a strict VisualDirection structure.
 * Ensures BrandProject state is protected from malformed or incomplete visual brief data.
 */
export function validateAndSanitizeVisualData(raw: unknown): ValidationResult<VisualDirection> {
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, error: 'AI output is not a valid JSON object.' };
  }

  const obj = raw as Record<string, any>;

  // 1. Validate Aesthetic Thesis
  const aestheticThesis = String(obj.aestheticThesis || '').trim();
  if (!aestheticThesis) {
    return { isValid: false, error: 'Missing or empty aesthetic thesis in visual brief data.' };
  }

  const rationale = String(obj.rationale || '').trim();

  // 2. Validate Color Mood & Palette
  const cm = obj.colorMood;
  if (!cm || typeof cm !== 'object') {
    return { isValid: false, error: 'Missing or malformed color mood in visual brief data.' };
  }

  const themeName = String(cm.themeName || '').trim();
  if (!themeName) {
    return { isValid: false, error: 'Missing color theme name in visual brief data.' };
  }

  const description = String(cm.description || '').trim();
  const lightingMood = String(cm.lightingMood || 'High-contrast focused lighting').trim();

  const pal = cm.palette;
  if (!pal || typeof pal !== 'object') {
    return { isValid: false, error: 'Missing color palette in visual brief data.' };
  }

  const parseSwatch = (swatch: any, fallbackName: string, fallbackHex: string, fallbackRole: string): ColorSwatch => {
    if (!swatch || typeof swatch !== 'object') {
      return {
        name: fallbackName,
        hex: fallbackHex,
        usageRole: fallbackRole,
        meaning: `Essential ${fallbackName.toLowerCase()} element.`,
      };
    }
    return {
      name: String(swatch.name || fallbackName).trim(),
      hex: sanitizeHex(swatch.hex, fallbackHex),
      usageRole: String(swatch.usageRole || fallbackRole).trim(),
      meaning: String(swatch.meaning || `${fallbackName} token.`).trim(),
    };
  };

  const primary = parseSwatch(pal.primary, 'Primary Accent', '#6366f1', 'Primary Action');
  const secondary = parseSwatch(pal.secondary, 'Secondary Surface', '#4338ca', 'Secondary Surface');
  const accent = parseSwatch(pal.accent, 'High-Energy Accent', '#06b6d4', 'Highlight / Badge');
  const background = parseSwatch(pal.background, 'Deep Void', '#090d16', 'App Canvas Background');
  const surface = parseSwatch(pal.surface, 'Elevated Surface', '#0f172a', 'Card & Panel Surface');
  const border = parseSwatch(pal.border, 'Subtle Border', '#1e293b', 'Structural Dividers');

  const colorMood: ColorMood = {
    themeName,
    description: description || `Curated color mood for ${themeName}.`,
    lightingMood,
    palette: {
      primary,
      secondary,
      accent,
      background,
      surface,
      border,
    },
  };

  // 3. Validate Typography Specifications
  if (!Array.isArray(obj.typography) || obj.typography.length < 2) {
    return { isValid: false, error: 'Visual brief must define at least 2 typography roles.' };
  }

  const validRoles = new Set(['display', 'headline', 'body', 'mono']);
  const typography: TypographySpec[] = [];

  for (let i = 0; i < obj.typography.length; i++) {
    const t = obj.typography[i];
    if (!t || typeof t !== 'object') continue;

    const rawRole = String(t.role || '').toLowerCase().trim();
    const role: TypographySpec['role'] = validRoles.has(rawRole)
      ? (rawRole as TypographySpec['role'])
      : i === 0
      ? 'headline'
      : i === 1
      ? 'body'
      : 'mono';

    const fontFamily = String(t.fontFamily || (role === 'mono' ? 'JetBrains Mono, monospace' : 'Inter, sans-serif')).trim();
    const recommendedWeights = String(t.recommendedWeights || '400, 600, 700').trim();
    const letterSpacing = String(t.letterSpacing || 'normal').trim();
    const lineHeight = String(t.lineHeight || '1.5').trim();
    const usageRule = String(t.usageRule || `Primary styling for ${role} elements.`).trim();

    typography.push({
      role,
      fontFamily,
      recommendedWeights,
      letterSpacing,
      lineHeight,
      usageRule,
    });
  }

  if (typography.length < 2) {
    return { isValid: false, error: 'At least 2 valid typography specifications are required.' };
  }

  // 4. Validate Composition
  const comp = obj.composition;
  if (!comp || typeof comp !== 'object') {
    return { isValid: false, error: 'Missing or malformed composition settings in visual brief.' };
  }

  const validDensities = new Set(['ultra-minimal', 'balanced-technical', 'rich-editorial']);
  const rawDensity = String(comp.density || '').trim();
  const density: VisualDirection['composition']['density'] = validDensities.has(rawDensity)
    ? (rawDensity as VisualDirection['composition']['density'])
    : 'balanced-technical';

  const composition = {
    density,
    gridPrinciple: String(comp.gridPrinciple || 'Fluid responsive column grid with disciplined 8px modular baseline.').trim(),
    whiteSpaceStrategy: String(comp.whiteSpaceStrategy || 'Generous functional whitespace to focus cognitive attention.').trim(),
  };

  // 5. Validate Shapes & Geometry
  const sg = obj.shapesAndGeometry;
  if (!sg || typeof sg !== 'object') {
    return { isValid: false, error: 'Missing or malformed geometry settings in visual brief.' };
  }

  const shapesAndGeometry = {
    cornerRadii: String(sg.cornerRadii || '8px to 12px softly rounded corners').trim(),
    borderPhilosophy: String(sg.borderPhilosophy || 'Delicate 1px semi-transparent borders with subtle inner glow').trim(),
    shadowDepth: String(sg.shadowDepth || 'Low-elevation layered ambient shadows').trim(),
    geometricSignatures: Array.isArray(sg.geometricSignatures) && sg.geometricSignatures.length > 0
      ? sg.geometricSignatures.map((s: any) => String(s).trim()).filter(Boolean)
      : ['Crisp 90-degree content cards', 'Micro-rounded pills', 'Hairline accents'],
  };

  // 6. Validate Imagery Principles
  const ip = obj.imageryPrinciples;
  if (!ip || typeof ip !== 'object') {
    return { isValid: false, error: 'Missing or malformed imagery principles in visual brief.' };
  }

  const imageryPrinciples = {
    style: String(ip.style || 'High-fidelity technical renders and clean architectural interfaces.').trim(),
    approvedMotifs: Array.isArray(ip.approvedMotifs) && ip.approvedMotifs.length > 0
      ? ip.approvedMotifs.map((m: any) => String(m).trim()).filter(Boolean)
      : ['Abstract data streams', 'Architectural wireframes', 'Clean monochrome diagrams'],
    lightingAndGrading: String(ip.lightingAndGrading || 'Cool rim lighting with deep cinematic contrast.').trim(),
  };

  // 7. Validate Visual Avoids
  const visualAvoids = Array.isArray(obj.visualAvoids) && obj.visualAvoids.length > 0
    ? obj.visualAvoids.map((a: any) => String(a).trim()).filter(Boolean)
    : ['Cluttered dashboard noise', 'Generic corporate stock photography', 'Unbalanced high-saturation gradients'];

  if (visualAvoids.length < 2) {
    visualAvoids.push('Garish high-contrast neon accents without functional hierarchy.');
  }

  // 8. Validate Logo Direction
  let logoDirection: LogoDirection | undefined;
  if (obj.logoDirection && typeof obj.logoDirection === 'object') {
    const ld = obj.logoDirection;
    logoDirection = {
      concept: String(ld.concept || 'Geometric monogram embodying precision and clarity.').trim(),
      symbolism: String(ld.symbolism || 'Convergence of intelligence and structural sovereignty.').trim(),
      construction: String(ld.construction || 'Engineered on an equilateral geometric grid with consistent stroke weight.').trim(),
      usageGuidance: String(ld.usageGuidance || 'Clear space of at least 1.5x logo height on all four sides.').trim(),
      avoids: Array.isArray(ld.avoids) && ld.avoids.length > 0
        ? ld.avoids.map((a: any) => String(a).trim()).filter(Boolean)
        : ['Do not apply drop shadows to the mark', 'Do not distort aspect ratio', 'Do not place over busy backgrounds'],
    };
  } else {
    logoDirection = {
      concept: 'Minimalist structural mark anchored in clarity and modern engineering.',
      symbolism: 'Balance, focus, and deliberate architectural execution.',
      construction: 'Vector-based mathematical geometry with balanced counter-spaces.',
      usageGuidance: 'Maintain minimum clear space equal to mark diameter.',
      avoids: ['Avoid skeuomorphic bevels', 'Avoid low-contrast background placements'],
    };
  }

  // 9. Validate Application Preview
  let applicationPreview: BrandApplicationPreview | undefined;
  if (obj.applicationPreview && typeof obj.applicationPreview === 'object') {
    const ap = obj.applicationPreview;
    applicationPreview = {
      headline: String(ap.headline || 'Intelligence Built for Depth').trim(),
      subheadline: String(ap.subheadline || 'A unified environment tailored for focus and craft.').trim(),
      callToAction: String(ap.callToAction || 'Launch System').trim(),
      cardPreviewContext: String(ap.cardPreviewContext || 'Executive application card').trim(),
    };
  } else {
    applicationPreview = {
      headline: 'Intelligence Built for Depth',
      subheadline: 'A unified environment tailored for focus and craft.',
      callToAction: 'Launch System',
      cardPreviewContext: 'Interactive application preview component',
    };
  }

  return {
    isValid: true,
    data: {
      aestheticThesis,
      rationale: rationale || undefined,
      colorMood,
      typography,
      composition,
      shapesAndGeometry,
      imageryPrinciples,
      visualAvoids,
      logoDirection,
      applicationPreview,
    },
  };
}
