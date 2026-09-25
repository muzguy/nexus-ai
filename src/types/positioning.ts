export interface PositioningCritique {
  clicheRiskScore: number; // 1-10 (1 = fresh, 10 = extreme cliché)
  clicheNotes: string;
  weakAssumptions: string[];
  contradictions: string[];
  audienceMismatchRisk: string;
  differentiationScore: number; // 1-10
  strategicViability: 'high' | 'moderate' | 'high_risk';
  challengeVerdict: string;
  counterRecommendations: string[];
}

export interface PositioningDirection {
  id: string;
  name: string; // e.g. "The Autonomous Co-Pilot"
  archetype: string; // e.g. "The Sovereign Architect"
  targetSegment: string;
  taglineConcept: string;
  valueProposition: string;
  competitiveMoat: string;
  keyDifferentiator: string;
  strategicTradeoff: string; // What is deliberately sacrificed
  critique?: PositioningCritique;
}

export interface PositioningData {
  directions: PositioningDirection[];
  rationale: string;
}
