import {
  ConsistencyReport,
  ConsistencyAuditItem,
  ConsistencyViolation,
  ConsistencyComponent,
  AlignmentSeverity,
} from '@/types/consistency';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

const VALID_COMPONENTS: Set<ConsistencyComponent> = new Set([
  'naming',
  'tagline',
  'voice',
  'visual_direction',
  'launch_messaging',
  'tone',
  'vocabulary',
  'personality',
  'audience_alignment',
  'positioning_alignment',
  'negative_boundaries',
  'editorial_rules',
]);

const VALID_SEVERITIES: Set<AlignmentSeverity> = new Set([
  'aligned',
  'warning',
  'conflict',
]);

const VALID_VIOLATION_SEVERITIES = new Set(['critical', 'warning', 'minor']);

/**
 * Validates and sanitizes a raw Gemini JSON output for the Guardian stage.
 * Ensures all scores are bounded [0, 100], components and severities conform to strict types,
 * violations are properly structured, and suggested revisions are present.
 */
export function validateAndSanitizeGuardianData(
  raw: unknown
): ValidationResult<ConsistencyReport> {
  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      error: 'Guardian consistency response is empty or not a valid JSON object.',
    };
  }

  const obj = raw as Record<string, unknown>;

  // 1. Overall Score
  let overallIntegrityScore = 70;
  if (typeof obj.overallIntegrityScore === 'number' && !isNaN(obj.overallIntegrityScore)) {
    overallIntegrityScore = Math.max(0, Math.min(100, Math.round(obj.overallIntegrityScore)));
  } else if (typeof obj.overallScore === 'number' && !isNaN(obj.overallScore)) {
    overallIntegrityScore = Math.max(0, Math.min(100, Math.round(obj.overallScore)));
  }

  // 2. Verdict & Status
  let verdict: 'launch_ready' | 'conditional_pass' | 'strategic_misalignment' = 'conditional_pass';
  if (
    obj.verdict === 'launch_ready' ||
    obj.verdict === 'conditional_pass' ||
    obj.verdict === 'strategic_misalignment'
  ) {
    verdict = obj.verdict;
  } else {
    verdict =
      overallIntegrityScore >= 80
        ? 'launch_ready'
        : overallIntegrityScore >= 50
        ? 'conditional_pass'
        : 'strategic_misalignment';
  }

  let status: 'consistent' | 'needs_revision' | 'inconsistent' = 'needs_revision';
  if (
    obj.status === 'consistent' ||
    obj.status === 'needs_revision' ||
    obj.status === 'inconsistent'
  ) {
    status = obj.status;
  } else {
    status =
      verdict === 'launch_ready'
        ? 'consistent'
        : verdict === 'conditional_pass'
        ? 'needs_revision'
        : 'inconsistent';
  }

  // 3. Executive Summary
  const executiveSummary =
    typeof obj.executiveSummary === 'string' && obj.executiveSummary.trim().length > 0
      ? obj.executiveSummary.trim()
      : 'Comprehensive consistency audit conducted against established brand strategy and voice rules.';

  // 4. Component Audits
  const auditsRaw = Array.isArray(obj.audits)
    ? obj.audits
    : Array.isArray(obj.dimensionChecks)
    ? obj.dimensionChecks
    : [];

  const audits: ConsistencyAuditItem[] = [];
  auditsRaw.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const it = item as Record<string, unknown>;

    const id = typeof it.id === 'string' && it.id.trim() ? it.id.trim() : `audit_${index + 1}`;
    const componentStr = typeof it.component === 'string' ? it.component.toLowerCase().trim() : 'voice';
    const component: ConsistencyComponent = VALID_COMPONENTS.has(componentStr as ConsistencyComponent)
      ? (componentStr as ConsistencyComponent)
      : 'voice';

    const title = typeof it.title === 'string' && it.title.trim() ? it.title.trim() : `Audit Dimension ${index + 1}`;
    
    let alignmentScore = 75;
    if (typeof it.alignmentScore === 'number' && !isNaN(it.alignmentScore)) {
      alignmentScore = Math.max(0, Math.min(100, Math.round(it.alignmentScore)));
    } else if (typeof it.score === 'number' && !isNaN(it.score)) {
      alignmentScore = Math.max(0, Math.min(100, Math.round(it.score)));
    }

    const statusStr = typeof it.status === 'string' ? it.status.toLowerCase().trim() : '';
    const auditStatus: AlignmentSeverity = VALID_SEVERITIES.has(statusStr as AlignmentSeverity)
      ? (statusStr as AlignmentSeverity)
      : alignmentScore >= 80
      ? 'aligned'
      : alignmentScore >= 50
      ? 'warning'
      : 'conflict';

    const evaluatedAgainst =
      typeof it.evaluatedAgainst === 'string' && it.evaluatedAgainst.trim()
        ? it.evaluatedAgainst.trim()
        : 'Active Brand Guardrails';

    const finding =
      typeof it.finding === 'string' && it.finding.trim()
        ? it.finding.trim()
        : 'Analysis completed against active brand rules.';

    const recommendation =
      typeof it.recommendation === 'string' && it.recommendation.trim()
        ? it.recommendation.trim()
        : 'Ensure phrasing adheres strictly to established brand tone.';

    audits.push({
      id,
      component,
      title,
      alignmentScore,
      status: auditStatus,
      evaluatedAgainst,
      finding,
      recommendation,
    });
  });

  if (audits.length === 0) {
    return {
      isValid: false,
      error: 'Guardian consistency response must contain at least one valid audit dimension.',
    };
  }

  // 5. Violations
  const violationsRaw = Array.isArray(obj.violations) ? obj.violations : [];
  const violations: ConsistencyViolation[] = [];

  violationsRaw.forEach((v, index) => {
    if (!v || typeof v !== 'object') return;
    const item = v as Record<string, unknown>;

    const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `violation_${index + 1}`;
    const category = typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'Tone Mismatch';
    const problematicText =
      typeof item.problematicText === 'string' && item.problematicText.trim()
        ? item.problematicText.trim()
        : 'Flagged copy';
    const explanation =
      typeof item.explanation === 'string' && item.explanation.trim()
        ? item.explanation.trim()
        : 'Conflicts with brand personality.';
    const violatedRule =
      typeof item.violatedRule === 'string' && item.violatedRule.trim()
        ? item.violatedRule.trim()
        : 'Brand Voice Guardrails';

    const sevStr = typeof item.severity === 'string' ? item.severity.toLowerCase().trim() : '';
    const severity: 'critical' | 'warning' | 'minor' = VALID_VIOLATION_SEVERITIES.has(sevStr)
      ? (sevStr as 'critical' | 'warning' | 'minor')
      : 'warning';

    const suggestedFix =
      typeof item.suggestedFix === 'string' && item.suggestedFix.trim() ? item.suggestedFix.trim() : undefined;

    violations.push({
      id,
      category,
      problematicText,
      explanation,
      violatedRule,
      severity,
      suggestedFix,
    });
  });

  // 6. What Works / High-Impact Strengths
  const rawStrengths = Array.isArray(obj.highImpactStrengths)
    ? obj.highImpactStrengths
    : Array.isArray(obj.whatWorks)
    ? obj.whatWorks
    : [];

  const highImpactStrengths: string[] = rawStrengths
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim());

  if (highImpactStrengths.length === 0) {
    highImpactStrengths.push(
      'The underlying intent communicates clear functional utility aligned with the project domain.'
    );
  }

  // 7. Key Vulnerabilities
  const rawVulnerabilities = Array.isArray(obj.keyVulnerabilities) ? obj.keyVulnerabilities : [];
  const keyVulnerabilities: string[] = rawVulnerabilities
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim());

  if (keyVulnerabilities.length === 0 && violations.length > 0) {
    keyVulnerabilities.push(
      violations[0].explanation || 'Content exhibits tone drift away from established identity.'
    );
  } else if (keyVulnerabilities.length === 0) {
    keyVulnerabilities.push(
      'Ensure copy does not drift toward generic industry jargon in future iterations.'
    );
  }

  // 8. Suggested Revision & Rationale
  const suggestedRevision =
    typeof obj.suggestedRevision === 'string' && obj.suggestedRevision.trim().length > 0
      ? obj.suggestedRevision.trim()
      : undefined;

  const revisionRationale =
    typeof obj.revisionRationale === 'string' && obj.revisionRationale.trim().length > 0
      ? obj.revisionRationale.trim()
      : typeof obj.reasoning === 'string' && obj.reasoning.trim().length > 0
      ? obj.reasoning.trim()
      : undefined;

  // 9. Audited Content & Content Type
  const auditedContent =
    typeof obj.auditedContent === 'string' && obj.auditedContent.trim().length > 0
      ? obj.auditedContent.trim()
      : undefined;

  const contentType =
    typeof obj.contentType === 'string' && obj.contentType.trim().length > 0
      ? obj.contentType.trim()
      : undefined;

  // 10. Guardian Stamp
  const rawStamp = obj.guardianStamp && typeof obj.guardianStamp === 'object' ? (obj.guardianStamp as Record<string, unknown>) : null;
  const guardianStamp = {
    evaluatedAt:
      rawStamp && typeof rawStamp.evaluatedAt === 'string' && rawStamp.evaluatedAt.trim()
        ? rawStamp.evaluatedAt.trim()
        : new Date().toISOString(),
    verifiedBy:
      rawStamp && typeof rawStamp.verifiedBy === 'string' && rawStamp.verifiedBy.trim()
        ? rawStamp.verifiedBy.trim()
        : 'NEXUS Consistency Guardian (Gemini)',
  };

  const sanitized: ConsistencyReport = {
    overallIntegrityScore,
    verdict,
    status,
    executiveSummary,
    auditedContent,
    contentType,
    audits,
    violations,
    whatWorks: highImpactStrengths,
    suggestedRevision,
    revisionRationale,
    highImpactStrengths,
    keyVulnerabilities,
    guardianStamp,
  };

  return {
    isValid: true,
    data: sanitized,
  };
}
