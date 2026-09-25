import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { validateAndSanitizeGuardianData } from '@/lib/validation/guardian-validator';
import { InitialIdea, DiscoveryData } from '@/types/discovery';
import { PositioningData, PositioningDirection } from '@/types/positioning';
import { ShapeData } from '@/types/shape';
import { VisualDirection } from '@/types/visual';
import { executeWithFailover, handleRouterError } from '@/lib/ai';

const AUDIT_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'Unique identifier, e.g. "audit_tone", "audit_vocab".' },
    component: {
      type: Type.STRING,
      description:
        'One of: "tone", "vocabulary", "personality", "positioning_alignment", "negative_boundaries", "editorial_rules", "naming", "tagline", "voice", "visual_direction", "launch_messaging".',
    },
    title: { type: Type.STRING, description: 'Descriptive title of this check dimension.' },
    alignmentScore: { type: Type.INTEGER, description: 'Integer score from 0 to 100 for this dimension.' },
    status: { type: Type.STRING, description: 'Must be one of: "aligned", "warning", "conflict".' },
    evaluatedAgainst: { type: Type.STRING, description: 'The exact brand rule, trait, or pillar evaluated.' },
    finding: { type: Type.STRING, description: 'Detailed finding describing how the content behaves relative to the rule.' },
    recommendation: { type: Type.STRING, description: 'Specific actionable recommendation for this dimension.' },
  },
  required: ['id', 'component', 'title', 'alignmentScore', 'status', 'evaluatedAgainst', 'finding', 'recommendation'],
};

const VIOLATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'Unique identifier, e.g. "viol_1".' },
    category: {
      type: Type.STRING,
      description: 'Violation category, e.g. "Taboo Terminology", "Tone Mismatch", "Hype / Hyperbole", "Negative Boundary", "Audience Alienation".',
    },
    problematicText: { type: Type.STRING, description: 'Exact quote or phrase from the content that triggered the violation.' },
    explanation: { type: Type.STRING, description: 'Detailed explanation of why this phrase conflicts with the brand system.' },
    violatedRule: { type: Type.STRING, description: 'The specific brand rule, taboo term, or negative boundary violated.' },
    severity: { type: Type.STRING, description: 'Must be one of: "critical", "warning", "minor".' },
    suggestedFix: { type: Type.STRING, description: 'Alternative phrasing or correction for this specific phrase.' },
  },
  required: ['id', 'category', 'problematicText', 'explanation', 'violatedRule', 'severity'],
};

const GUARDIAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallIntegrityScore: {
      type: Type.INTEGER,
      description: 'Holistic brand consistency score from 0 to 100 (80+ = launch ready, 50-79 = needs revision, <50 = inconsistent).',
    },
    verdict: {
      type: Type.STRING,
      description: 'One of: "launch_ready", "conditional_pass", "strategic_misalignment".',
    },
    status: {
      type: Type.STRING,
      description: 'One of: "consistent", "needs_revision", "inconsistent".',
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'Executive narrative diagnosing the content consistency and explaining the verdict.',
    },
    audits: {
      type: Type.ARRAY,
      items: AUDIT_ITEM_SCHEMA,
      description: '4 to 6 structured dimension checks covering tone, vocabulary, positioning, negative boundaries, and editorial rules.',
    },
    violations: {
      type: Type.ARRAY,
      items: VIOLATION_SCHEMA,
      description: 'Specific detected violations. Empty array if the content is 100% aligned with zero violations.',
    },
    highImpactStrengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 4 positive brand-aligned observations and strengths in the content.',
    },
    keyVulnerabilities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 strategic vulnerabilities or risks of brand dilution identified.',
    },
    suggestedRevision: {
      type: Type.STRING,
      description: "A completely rewritten version of the content that preserves the user's intended message while bringing it 100% in line with the brand system.",
    },
    revisionRationale: {
      type: Type.STRING,
      description: 'Detailed explanation of the strategic changes made: Brand Rule -> Detected Issue -> Correction.',
    },
  },
  required: [
    'overallIntegrityScore',
    'verdict',
    'status',
    'executiveSummary',
    'audits',
    'violations',
    'highImpactStrengths',
    'keyVulnerabilities',
    'suggestedRevision',
    'revisionRationale',
  ],
};

const GUARDIAN_SYSTEM_INSTRUCTION = `You are the NEXUS Consistency Guardian—an uncompromising, adversarial brand integrity auditor.
Your job is to inspect new, user-submitted content and determine whether it faithfully sounds and behaves like the accumulated brand system created in earlier stages.

CORE RULES:
1. GROUNDED IN SPECIFICITY: Audit strictly against THIS brand's exact traits, tone descriptors, negative boundaries, taboo terms, editorial rules, and positioning trade-offs. NEVER use generic branding advice or Aether OS defaults.
2. CAUSAL REASONING: Connect every violation directly to a specific brand rule (Brand Rule -> Detected Violation -> Strategic Impact).
3. ACCURACY & FAIRNESS: If the submitted copy is genuinely consistent with the brand, award a high score (80+) and celebrate its strengths. If it violates negative boundaries or uses taboo words, ruthlessly flag them with appropriate severity.
4. ACTIONABLE SUGGESTION: Always provide a polished 'suggestedRevision' that preserves the user's underlying message, intent, and information while expressing it with 100% brand fidelity.
5. STRICT OUTPUT: Return valid JSON matching the exact response schema without markdown backticks.`;


export async function POST(req: Request) {
  try {
    // 1. Parse Request Body
    let body: {
      selectedDirection?: PositioningDirection;
      shape?: ShapeData;
      personality?: unknown;
      voice?: unknown;
      idea?: InitialIdea;
      discovery?: DiscoveryData;
      positioning?: PositioningData;
      selectedName?: string;
      visual?: VisualDirection;
      contentToAudit?: string;
      contentType?: string;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const {
      selectedDirection,
      shape,
      personality,
      voice,
      idea,
      discovery,
      selectedName,
      visual,
      contentType,
    } = body;

    // Validate prerequisite state
    if (!selectedDirection || typeof selectedDirection !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error:
            'A selected strategic positioning direction is required to run the Consistency Guardian audit. Please complete prior stages first.',
        },
        { status: 400 }
      );
    }

    const brandPersonality = shape?.personality || (personality as ShapeData['personality']);
    const brandVoice = shape?.voice || (voice as ShapeData['voice']);

    if (!brandPersonality || !brandVoice) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Shaped brand identity data (personality and voice rules) is required to run the Consistency Guardian audit. Please complete the Shape stage first.',
        },
        { status: 400 }
      );
    }

    const brandName = selectedName || idea?.title?.trim() || selectedDirection.name;
    const rawContent = body.contentToAudit?.trim();

    // Default to a sensible draft if content was not provided
    const contentToAudit =
      rawContent && rawContent.length > 0
        ? rawContent
        : shape?.tagline && shape?.oneLinePitch
        ? `${shape.tagline} — ${shape.oneLinePitch}`
        : idea?.rawConcept || selectedDirection.valueProposition;

    const resolvedContentType = contentType?.trim() || 'General Marketing Copy';

    // Construct Prompt with Complete Cumulative Context
    const userPrompt = `Perform an adversarial Brand Consistency Audit on the following content for the active project "${brandName}":

=== CONTENT SUBMITTED FOR AUDIT ===
Content Type: ${resolvedContentType}
Content Text:
"""
${contentToAudit}
"""

=== ACTIVE BRAND SYSTEM & GUARDRAILS ===
Brand Working Title: "${brandName}"
Tagline: "${shape?.tagline || selectedDirection.taglineConcept}"
One-Line Pitch: "${shape?.oneLinePitch || selectedDirection.valueProposition}"
Target Audience: ${discovery?.audience?.primarySegment || idea?.targetMarketNotes || 'Core target users'}

STRATEGIC POSITIONING ANCHOR:
- Chosen Direction: "${selectedDirection.name}" (${selectedDirection.archetype})
- Target Buyer Psychology: ${selectedDirection.targetSegment}
- Value Proposition: ${selectedDirection.valueProposition}
- Competitive Moat: ${selectedDirection.competitiveMoat}
- Key Differentiator: ${selectedDirection.keyDifferentiator}
- Strategic Sacrifice (What this brand rejects): ${selectedDirection.strategicTradeoff}

SHAPED BRAND PERSONALITY & DNA:
- Primary Archetype: ${brandPersonality.primaryArchetype}
- Secondary Archetype: ${brandPersonality.secondaryArchetype}
- Core Traits:
${brandPersonality.coreTraits.map((t) => `  * ${t.name}: ${t.description} (In action: ${t.inAction})`).join('\n')}
- Strict Negative Boundaries (Anti-Patterns):
${brandPersonality.traitsToAvoid.map((a) => `  * [AVOID] ${a.name}: ${a.reason} (Bad example: "${a.badExample}")`).join('\n')}

BRAND VOICE & EDITORIAL RULES:
- Tonal Mandate: ${brandVoice.toneAttributes?.join(', ') || 'Direct, Rigorous, Understated'}
- Narrative Style: ${brandVoice.narrativeStyle}
- Key Vocabulary (Encouraged): ${brandVoice.keyVocabulary?.join(', ') || 'None specified'}
- Strict Taboo Terms (FORBIDDEN): ${brandVoice.tabooTerms?.join(', ') || 'None'}
- Editorial Voice Rules:
${brandVoice.rules
  ?.map((r) => `  * Context: ${r.context} | SAY: "${r.sayThis}" | AVOID: "${r.avoidThis}" | Rationale: ${r.rationale}`)
  .join('\n') || '  * None'}

VISUAL & AESTHETIC PRINCIPLES (from Visualize):
- Aesthetic Thesis: ${visual?.aestheticThesis || 'Grounded in brand identity'}
- Visual Avoids: ${visual?.visualAvoids?.join('; ') || 'None'}

=== AUDIT DIRECTIVE ===
Inspect every sentence of the submitted content against these active guardrails.
1. Check for TABOO TERMS and buzzwords.
2. Check for TONE MISMATCH against the tonal mandate.
3. Check for NEGATIVE BOUNDARY violations (e.g. hype, childish gimmicks, generic corporate jargon).
4. Check for ALIGNMENT with the selected strategic sacrifice and positioning moat.
5. Identify any specific strengths where the copy successfully captures the brand's true voice.
6. Provide a pristine suggested rewrite that communicates the user's underlying message with 100% brand consistency.`;

    // Execute via AI Provider Router (Gemini primary with transient retries -> Groq backup)
    const result = await executeWithFailover(
      {
        systemInstruction: GUARDIAN_SYSTEM_INSTRUCTION,
        userPrompt,
        schema: GUARDIAN_RESPONSE_SCHEMA,
        signal: req.signal,
      },
      {
        validate: validateAndSanitizeGuardianData,
      }
    );

    // Attach request metadata
    result.data.auditedContent = contentToAudit;
    result.data.contentType = resolvedContentType;

    return NextResponse.json({
      success: true,
      data: result.data,
      provider: result.provider,
    });
  } catch (err: any) {
    return handleRouterError(err);
  }
}
