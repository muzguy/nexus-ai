export interface InitialIdea {
  title: string;
  rawConcept: string;
  targetMarketNotes?: string;
  founderContext?: string;
}

export interface TargetAudienceProfile {
  primarySegment: string;
  secondarySegment?: string;
  painPoints: string[];
  desires: string[];
  urgencyDriver: string;
}

export interface ProblemSpace {
  coreProblem: string;
  marketFailure: string;
  currentWorkarounds: string[];
}

export interface ProjectGoals {
  immediateLaunchGoal: string;
  longTermVision: string;
  keyMetric: string;
}

export interface ProjectConstraints {
  nonNegotiables: string[];
  budgetOrResourceLimits?: string;
  regulatoryOrComplianceNotes?: string[];
}

export interface OpenQuestion {
  id: string;
  question: string;
  hypothesis?: string;
  status: 'open' | 'validated' | 'dismissed';
}

export interface DiscoveryData {
  summary: string;
  audience: TargetAudienceProfile;
  problem: ProblemSpace;
  goals: ProjectGoals;
  constraints: ProjectConstraints;
  openQuestions: OpenQuestion[];
}
