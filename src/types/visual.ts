export interface ColorSwatch {
  name: string;
  hex: string;
  usageRole: string; // e.g. "Primary Action", "Obsidian Surface", "High-Energy Accent"
  meaning: string;
}

export interface ColorMood {
  themeName: string;
  description: string;
  palette: {
    primary: ColorSwatch;
    secondary: ColorSwatch;
    accent: ColorSwatch;
    background: ColorSwatch;
    surface: ColorSwatch;
    border: ColorSwatch;
  };
  lightingMood: string;
}

export interface TypographySpec {
  role: 'display' | 'headline' | 'body' | 'mono';
  fontFamily: string;
  recommendedWeights: string;
  letterSpacing: string;
  lineHeight: string;
  usageRule: string;
}

export interface LogoDirection {
  concept: string;
  symbolism: string;
  construction: string;
  usageGuidance: string;
  avoids: string[];
}

export interface BrandApplicationPreview {
  headline: string;
  subheadline: string;
  callToAction: string;
  cardPreviewContext: string;
}

export interface VisualDirection {
  aestheticThesis: string;
  rationale?: string; // Strategic relationship: Position -> Personality -> Visual System
  colorMood: ColorMood;
  typography: TypographySpec[];
  composition: {
    density: 'ultra-minimal' | 'balanced-technical' | 'rich-editorial';
    gridPrinciple: string;
    whiteSpaceStrategy: string;
  };
  shapesAndGeometry: {
    cornerRadii: string;
    borderPhilosophy: string;
    shadowDepth: string;
    geometricSignatures: string[];
  };
  imageryPrinciples: {
    style: string;
    approvedMotifs: string[];
    lightingAndGrading: string;
  };
  visualAvoids: string[];
  logoDirection?: LogoDirection;
  applicationPreview?: BrandApplicationPreview;
}
