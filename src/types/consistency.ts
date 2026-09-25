export type ConsistencyComponent =
  | 'naming'
  | 'tagline'
  | 'voice'
  | 'visual_direction'
  | 'launch_messaging';

export type AlignmentSeverity = 'aligned' | 'warning' | 'conflict';

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
  executiveSummary: string;
  audits: ConsistencyAuditItem[];
  highImpactStrengths: string[];
  keyVulnerabilities: string[];
  guardianStamp: {
    evaluatedAt: string;
    verifiedBy: string;
  };
}
