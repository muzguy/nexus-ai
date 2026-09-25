import {
  ShapeData,
  BrandPersonality,
  BrandTrait,
  AvoidTrait,
  NamingSystem,
  NamingTerritory,
  NameCandidate,
  BrandVoice,
  VoiceRule,
} from '@/types/shape';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates and sanitizes raw JSON returned by Google Gemini into a strict ShapeData structure.
 * Ensures BrandProject state is protected from malformed or incomplete brand identity data.
 */
export function validateAndSanitizeShapeData(raw: unknown): ValidationResult<ShapeData> {
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, error: 'AI output is not a valid JSON object.' };
  }

  const obj = raw as Record<string, any>;

  // 1. Validate Tagline & One-Line Pitch
  const tagline = String(obj.tagline || '').trim();
  if (!tagline) {
    return { isValid: false, error: 'Missing or empty brand tagline in shape data.' };
  }

  const oneLinePitch = String(obj.oneLinePitch || '').trim();
  if (!oneLinePitch) {
    return { isValid: false, error: 'Missing or empty one-line pitch in shape data.' };
  }

  // 2. Validate Brand Personality
  const p = obj.personality;
  if (!p || typeof p !== 'object') {
    return { isValid: false, error: 'Missing or malformed brand personality in shape data.' };
  }

  const primaryArchetype = String(p.primaryArchetype || '').trim();
  if (!primaryArchetype) {
    return { isValid: false, error: 'Missing primary archetype in brand personality.' };
  }

  const secondaryArchetype = String(p.secondaryArchetype || primaryArchetype).trim();

  // Core traits (at least 2 required)
  if (!Array.isArray(p.coreTraits) || p.coreTraits.length < 2) {
    return { isValid: false, error: 'Brand personality must contain at least 2 core traits.' };
  }

  const coreTraits: BrandTrait[] = [];
  for (let i = 0; i < p.coreTraits.length; i++) {
    const t = p.coreTraits[i];
    if (!t || typeof t !== 'object') continue;
    const name = String(t.name || '').trim();
    const description = String(t.description || '').trim();
    const inAction = String(t.inAction || '').trim();
    if (name && description) {
      coreTraits.push({
        name,
        description,
        inAction: inAction || `Manifested in clear, intentional product decisions.`,
      });
    }
  }

  if (coreTraits.length < 2) {
    return { isValid: false, error: 'At least 2 valid core personality traits are required.' };
  }

  // Traits to avoid (negative boundaries, at least 2 required)
  if (!Array.isArray(p.traitsToAvoid) || p.traitsToAvoid.length < 2) {
    return { isValid: false, error: 'Brand personality must contain at least 2 negative boundaries (traits to avoid).' };
  }

  const traitsToAvoid: AvoidTrait[] = [];
  for (let i = 0; i < p.traitsToAvoid.length; i++) {
    const a = p.traitsToAvoid[i];
    if (!a || typeof a !== 'object') continue;
    const name = String(a.name || '').trim();
    const reason = String(a.reason || '').trim();
    const badExample = String(a.badExample || '').trim();
    if (name && reason) {
      traitsToAvoid.push({
        name,
        reason,
        badExample: badExample || `Overly generic or cliché communication.`,
      });
    }
  }

  if (traitsToAvoid.length < 2) {
    return { isValid: false, error: 'At least 2 valid negative boundaries are required.' };
  }

  const personality: BrandPersonality = {
    primaryArchetype,
    secondaryArchetype,
    coreTraits,
    traitsToAvoid,
  };

  // 3. Validate Naming System & Territories
  const n = obj.naming;
  if (!n || typeof n !== 'object') {
    return { isValid: false, error: 'Missing or malformed naming system in shape data.' };
  }

  if (!Array.isArray(n.territories) || n.territories.length < 2) {
    return { isValid: false, error: 'Naming system must contain at least 2 naming territories.' };
  }

  const territories: NamingTerritory[] = [];
  let allCandidateIds: string[] = [];

  for (let i = 0; i < n.territories.length; i++) {
    const t = n.territories[i];
    if (!t || typeof t !== 'object') continue;

    const territoryId = t.id ? String(t.id).trim() : `territory_${i + 1}`;
    const territoryName = String(t.name || '').trim();
    const premise = String(t.premise || '').trim();

    if (!territoryName) {
      return { isValid: false, error: `Naming territory ${i + 1} is missing a name.` };
    }

    if (!Array.isArray(t.candidates) || t.candidates.length === 0) {
      return { isValid: false, error: `Naming territory "${territoryName}" contains no candidates.` };
    }

    const candidates: NameCandidate[] = [];
    for (let j = 0; j < t.candidates.length; j++) {
      const c = t.candidates[j];
      if (!c || typeof c !== 'object') continue;

      const candId = c.id ? String(c.id).trim() : `cand_${i + 1}_${j + 1}`;
      const name = String(c.name || '').trim();
      const candTagline = String(c.tagline || '').trim();
      const rationale = String(c.rationale || '').trim();
      const linguisticRoot = String(c.linguisticRoot || '').trim();
      const domainFeasibility = String(c.domainFeasibility || '').trim();
      const rawScore = Number(c.score);
      const score = !isNaN(rawScore) && rawScore >= 1 && rawScore <= 10 ? rawScore : 8.5;

      if (!name) continue;

      candidates.push({
        id: candId,
        name,
        tagline: candTagline || tagline,
        rationale: rationale || `Strategic linguistic candidate aligned with ${territoryName}.`,
        linguisticRoot: linguisticRoot || 'Modern English derivation',
        domainFeasibility: domainFeasibility || `${name.toLowerCase()}.com / ${name.toLowerCase()}.dev`,
        score,
      });

      allCandidateIds.push(candId);
    }

    if (candidates.length === 0) {
      return { isValid: false, error: `Naming territory "${territoryName}" must have at least one valid candidate.` };
    }

    territories.push({
      id: territoryId,
      name: territoryName,
      premise: premise || `Linguistic exploration focused on ${territoryName}.`,
      candidates,
    });
  }

  if (territories.length < 2) {
    return { isValid: false, error: 'At least 2 valid naming territories are required.' };
  }

  // Determine initial selectedCandidateId (ensure it matches an existing candidate)
  let selectedCandidateId = String(n.selectedCandidateId || '').trim();
  if (!selectedCandidateId || !allCandidateIds.includes(selectedCandidateId)) {
    selectedCandidateId = allCandidateIds[0] || 'cand_1';
  }

  const naming: NamingSystem = {
    territories,
    selectedCandidateId,
  };

  // 4. Validate Brand Voice
  const v = obj.voice;
  if (!v || typeof v !== 'object') {
    return { isValid: false, error: 'Missing or malformed brand voice in shape data.' };
  }

  const toneAttributes = Array.isArray(v.toneAttributes)
    ? v.toneAttributes.map((t: any) => String(t).trim()).filter(Boolean)
    : [];

  if (toneAttributes.length < 2) {
    return { isValid: false, error: 'Brand voice must define at least 2 tone attributes.' };
  }

  const narrativeStyle = String(v.narrativeStyle || '').trim();
  if (!narrativeStyle) {
    return { isValid: false, error: 'Brand voice is missing a narrative style description.' };
  }

  const keyVocabulary = Array.isArray(v.keyVocabulary)
    ? v.keyVocabulary.map((t: any) => String(t).trim()).filter(Boolean)
    : [];

  const tabooTerms = Array.isArray(v.tabooTerms)
    ? v.tabooTerms.map((t: any) => String(t).trim()).filter(Boolean)
    : [];

  // Voice rules (at least 2 required)
  if (!Array.isArray(v.rules) || v.rules.length < 2) {
    return { isValid: false, error: 'Brand voice must provide at least 2 editorial rules.' };
  }

  const rules: VoiceRule[] = [];
  for (let i = 0; i < v.rules.length; i++) {
    const r = v.rules[i];
    if (!r || typeof r !== 'object') continue;

    const context = String(r.context || '').trim();
    const sayThis = String(r.sayThis || '').trim();
    const avoidThis = String(r.avoidThis || '').trim();
    const rationale = String(r.rationale || '').trim();

    if (context && sayThis && avoidThis) {
      rules.push({
        context,
        sayThis,
        avoidThis,
        rationale: rationale || 'Maintains strategic brand alignment.',
      });
    }
  }

  if (rules.length < 2) {
    return { isValid: false, error: 'At least 2 complete editorial voice rules are required.' };
  }

  const voice: BrandVoice = {
    toneAttributes,
    narrativeStyle,
    keyVocabulary: keyVocabulary.length > 0 ? keyVocabulary : ['Precision', 'Clarity', 'Integrity'],
    tabooTerms: tabooTerms.length > 0 ? tabooTerms : ['Synergy', 'Revolutionary', 'Disruptive'],
    rules,
  };

  return {
    isValid: true,
    data: {
      tagline,
      oneLinePitch,
      personality,
      naming,
      voice,
    },
  };
}
