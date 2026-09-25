export interface BrandTrait {
  name: string;
  description: string;
  inAction: string;
}

export interface AvoidTrait {
  name: string;
  reason: string;
  badExample: string;
}

export interface BrandPersonality {
  primaryArchetype: string;
  secondaryArchetype: string;
  coreTraits: BrandTrait[];
  traitsToAvoid: AvoidTrait[];
}

export interface NameCandidate {
  id: string;
  name: string;
  tagline: string;
  rationale: string;
  linguisticRoot: string;
  domainFeasibility: string;
  score: number;
}

export interface NamingTerritory {
  id: string;
  name: string; // e.g. "Kinetic Precision", "Elemental Clarity"
  premise: string;
  candidates: NameCandidate[];
}

export interface NamingSystem {
  territories: NamingTerritory[];
  selectedCandidateId?: string;
}

export interface VoiceRule {
  context: string;
  sayThis: string;
  avoidThis: string;
  rationale: string;
}

export interface BrandVoice {
  toneAttributes: string[]; // e.g. ["Rigorous", "Sharp", "Direct", "Understated"]
  narrativeStyle: string;
  keyVocabulary: string[];
  tabooTerms: string[];
  rules: VoiceRule[];
}

export interface ShapeData {
  personality: BrandPersonality;
  naming: NamingSystem;
  tagline: string;
  oneLinePitch: string;
  voice: BrandVoice;
}
