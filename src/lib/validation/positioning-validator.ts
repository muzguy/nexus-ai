import { PositioningData, PositioningDirection } from '@/types/positioning';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates and sanitizes raw JSON returned by the AI into a strict PositioningData structure.
 * Ensures BrandProject state is protected from malformed or incomplete positioning data.
 */
export function validateAndSanitizePositioningData(raw: unknown): ValidationResult<PositioningData> {
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, error: 'AI output is not a valid JSON object.' };
  }

  const obj = raw as Record<string, any>;

  // 1. Validate Rationale
  if (typeof obj.rationale !== 'string' || !obj.rationale.trim()) {
    return { isValid: false, error: 'Missing or empty strategic divergence rationale in positioning data.' };
  }

  // 2. Validate Directions Array
  if (!Array.isArray(obj.directions) || obj.directions.length === 0) {
    return { isValid: false, error: 'Positioning data must contain at least one strategic direction.' };
  }

  const directions: PositioningDirection[] = [];

  for (let i = 0; i < obj.directions.length; i++) {
    const d = obj.directions[i];
    if (!d || typeof d !== 'object') {
      return { isValid: false, error: `Positioning direction at index ${i} is not a valid object.` };
    }

    const name = String(d.name || '').trim();
    if (!name) {
      return { isValid: false, error: `Positioning direction ${i + 1} is missing a name.` };
    }

    const archetype = String(d.archetype || '').trim();
    if (!archetype) {
      return { isValid: false, error: `Positioning direction "${name}" is missing a brand archetype.` };
    }

    const targetSegment = String(d.targetSegment || '').trim();
    if (!targetSegment) {
      return { isValid: false, error: `Positioning direction "${name}" is missing a target segment.` };
    }

    const taglineConcept = String(d.taglineConcept || '').trim();
    if (!taglineConcept) {
      return { isValid: false, error: `Positioning direction "${name}" is missing a concept tagline.` };
    }

    const valueProposition = String(d.valueProposition || '').trim();
    if (!valueProposition) {
      return { isValid: false, error: `Positioning direction "${name}" is missing a value proposition.` };
    }

    const competitiveMoat = String(d.competitiveMoat || '').trim();
    if (!competitiveMoat) {
      return { isValid: false, error: `Positioning direction "${name}" is missing a competitive moat.` };
    }

    const keyDifferentiator = String(d.keyDifferentiator || d.competitiveMoat || '').trim();

    const strategicTradeoff = String(d.strategicTradeoff || '').trim();
    if (!strategicTradeoff) {
      return { isValid: false, error: `Positioning direction "${name}" is missing an explicit strategic trade-off.` };
    }

    directions.push({
      id: d.id ? String(d.id).trim() : `pos_dir_${i + 1}`,
      name,
      archetype,
      targetSegment,
      taglineConcept,
      valueProposition,
      competitiveMoat,
      keyDifferentiator,
      strategicTradeoff,
      critique: d.critique && typeof d.critique === 'object' ? d.critique : undefined,
    });
  }

  if (directions.length < 3) {
    return { isValid: false, error: `Expected 3 positioning directions, but received ${directions.length}.` };
  }

  return {
    isValid: true,
    data: {
      rationale: obj.rationale.trim(),
      directions: directions.slice(0, 3), // Ensure exactly 3 directions
    },
  };
}
