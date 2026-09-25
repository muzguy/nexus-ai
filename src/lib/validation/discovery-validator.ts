import { DiscoveryData } from '@/types/discovery';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates and sanitizes raw JSON returned by the AI into a strict DiscoveryData structure.
 * Ensures BrandProject state is protected from malformed or incomplete data.
 */
export function validateAndSanitizeDiscoveryData(raw: unknown): ValidationResult<DiscoveryData> {
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, error: 'AI output is not a valid JSON object.' };
  }

  const obj = raw as Record<string, any>;

  // 1. Summary
  if (typeof obj.summary !== 'string' || !obj.summary.trim()) {
    return { isValid: false, error: 'Missing or empty executive summary in discovery data.' };
  }

  // 2. Target Audience Profile
  if (!obj.audience || typeof obj.audience !== 'object') {
    return { isValid: false, error: 'Missing audience profile in discovery data.' };
  }
  const primarySegment = String(obj.audience.primarySegment || '').trim();
  if (!primarySegment) {
    return { isValid: false, error: 'Missing primary audience segment in audience profile.' };
  }
  const painPoints = Array.isArray(obj.audience.painPoints)
    ? obj.audience.painPoints.map((p: any) => String(p).trim()).filter(Boolean)
    : [];
  if (painPoints.length === 0) {
    return { isValid: false, error: 'Audience profile requires at least one pain point.' };
  }
  const desires = Array.isArray(obj.audience.desires)
    ? obj.audience.desires.map((d: any) => String(d).trim()).filter(Boolean)
    : [];
  if (desires.length === 0) {
    return { isValid: false, error: 'Audience profile requires at least one core desire.' };
  }
  const urgencyDriver = String(obj.audience.urgencyDriver || '').trim();
  if (!urgencyDriver) {
    return { isValid: false, error: 'Audience profile requires an urgency driver.' };
  }

  // 3. Problem Space
  if (!obj.problem || typeof obj.problem !== 'object') {
    return { isValid: false, error: 'Missing problem space in discovery data.' };
  }
  const coreProblem = String(obj.problem.coreProblem || '').trim();
  if (!coreProblem) {
    return { isValid: false, error: 'Missing core problem definition in problem space.' };
  }
  const marketFailure = String(obj.problem.marketFailure || '').trim();
  if (!marketFailure) {
    return { isValid: false, error: 'Missing market failure explanation in problem space.' };
  }
  const currentWorkarounds = Array.isArray(obj.problem.currentWorkarounds)
    ? obj.problem.currentWorkarounds.map((w: any) => String(w).trim()).filter(Boolean)
    : [];

  // 4. Project Goals
  if (!obj.goals || typeof obj.goals !== 'object') {
    return { isValid: false, error: 'Missing project goals in discovery data.' };
  }
  const immediateLaunchGoal = String(obj.goals.immediateLaunchGoal || '').trim();
  if (!immediateLaunchGoal) {
    return { isValid: false, error: 'Missing immediate launch goal.' };
  }
  const longTermVision = String(obj.goals.longTermVision || '').trim();
  if (!longTermVision) {
    return { isValid: false, error: 'Missing long-term category vision.' };
  }
  const keyMetric = String(obj.goals.keyMetric || '').trim();
  if (!keyMetric) {
    return { isValid: false, error: 'Missing key metric.' };
  }

  // 5. Constraints
  if (!obj.constraints || typeof obj.constraints !== 'object') {
    return { isValid: false, error: 'Missing project constraints in discovery data.' };
  }
  const nonNegotiables = Array.isArray(obj.constraints.nonNegotiables)
    ? obj.constraints.nonNegotiables.map((n: any) => String(n).trim()).filter(Boolean)
    : [];
  if (nonNegotiables.length === 0) {
    nonNegotiables.push('Ground all brand messaging in actual product mechanics without hyperbole.');
  }

  // 6. Open Questions
  const openQuestions = Array.isArray(obj.openQuestions)
    ? obj.openQuestions
        .map((q: any, idx: number) => ({
          id: q.id ? String(q.id) : `oq_${idx + 1}`,
          question: String(q.question || '').trim(),
          hypothesis: q.hypothesis ? String(q.hypothesis).trim() : undefined,
          status: (['open', 'validated', 'dismissed'].includes(q.status) ? q.status : 'open') as
            | 'open'
            | 'validated'
            | 'dismissed',
        }))
        .filter((q) => q.question.length > 0)
    : [];

  const sanitized: DiscoveryData = {
    summary: obj.summary.trim(),
    audience: {
      primarySegment,
      secondarySegment: obj.audience.secondarySegment ? String(obj.audience.secondarySegment).trim() : undefined,
      painPoints,
      desires,
      urgencyDriver,
    },
    problem: {
      coreProblem,
      marketFailure,
      currentWorkarounds: currentWorkarounds.length > 0 ? currentWorkarounds : ['Manual ad-hoc spreadsheets and notes', 'Generic off-the-shelf tools'],
    },
    goals: {
      immediateLaunchGoal,
      longTermVision,
      keyMetric,
    },
    constraints: {
      nonNegotiables,
      budgetOrResourceLimits: obj.constraints.budgetOrResourceLimits
        ? String(obj.constraints.budgetOrResourceLimits).trim()
        : undefined,
      regulatoryOrComplianceNotes: Array.isArray(obj.constraints.regulatoryOrComplianceNotes)
        ? obj.constraints.regulatoryOrComplianceNotes.map((r: any) => String(r).trim()).filter(Boolean)
        : undefined,
    },
    openQuestions:
      openQuestions.length > 0
        ? openQuestions
        : [
            {
              id: 'oq_1',
              question: 'What is the primary friction point preventing early user activation?',
              hypothesis: 'Users require rapid proof of value before modifying existing habits.',
              status: 'open',
            },
          ],
  };

  return { isValid: true, data: sanitized };
}
