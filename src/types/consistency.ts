export type ConsistencyComponent =
  | 'naming'
  | 'tagline'
  | 'voice'
  | 'visual_direction'
  | 'launch_messaging'
  | 'tone'
  | 'vocabulary'
  | 'personality'
  | 'audience_alignment'
  | 'positioning_alignment'
  | 'negative_boundaries'
  | 'editorial_rules';

export type AlignmentSeverity = 'aligned' | 'warning' | 'conflict';

export interface ConsistencyViolation {
  id: string;
  category: string;
  problematicText: string;
  explanation: string;
  violatedRule: string;
  severity: 'critical' | 'warning' | 'minor';
  suggestedFix?: string;
}

export interface ConsistencyAuditItem {
  id: string;
  component: ConsistencyComponent;
  title: string;
  alignmentScore: number; // 0-100
  status: AlignmentSeverity;
  evaluatedAgainst: string; // The strategic pillar or positioning decision
  finding: string;
  recommendation: string;
}

export interface ConsistencyReport {
  overallIntegrityScore: number; // 0-100
  verdict: 'launch_ready' | 'conditional_pass' | 'strategic_misalignment';
  status?: 'consistent' | 'needs_revision' | 'inconsistent';
  executiveSummary: string;
  auditedContent?: string;
  contentType?: string;
  audits: ConsistencyAuditItem[];
  violations?: ConsistencyViolation[];
  whatWorks?: string[];
  suggestedRevision?: string;
  revisionRationale?: string;
  highImpactStrengths: string[];
  keyVulnerabilities: string[];
  guardianStamp: {
    evaluatedAt: string;
    verifiedBy: string;
  };
}

