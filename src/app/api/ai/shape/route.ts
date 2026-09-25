import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { validateAndSanitizeShapeData } from '@/lib/validation/shape-validator';
import { InitialIdea, DiscoveryData } from '@/types/discovery';
import { PositioningData, PositioningDirection } from '@/types/positioning';

const SHAPE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tagline: {
      type: Type.STRING,
      description: 'The primary, punchy brand tagline encapsulating the chosen positioning direction.',
    },
    oneLinePitch: {
      type: Type.STRING,
      description: 'A sharp, compelling one-line elevator pitch for the brand.',
    },
    personality: {
      type: Type.OBJECT,
      properties: {
        primaryArchetype: {
          type: Type.STRING,
          description: 'Primary brand archetype (e.g. "The Sage", "The Creator", "The Outlaw", "The Ruler").',
        },
        secondaryArchetype: {
          type: Type.STRING,
          description: 'Secondary brand archetype that nuances the personality.',
        },
        coreTraits: {
          type: Type.ARRAY,
          description: 'Exactly 3 to 5 positive core personality traits with practical in-action examples.',
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Trait name (e.g. "Sovereign Craft", "Uncompromising Rigor").' },
              description: { type: Type.STRING, description: 'Deep explanation of this trait.' },
              inAction: { type: Type.STRING, description: 'How this trait tangibly manifests in the product or communication.' },
            },
            required: ['name', 'description', 'inAction'],
          },
        },
        traitsToAvoid: {
          type: Type.ARRAY,
          description: 'Exactly 3 to 4 strict negative boundaries / traits the brand must NEVER exhibit.',
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Negative trait name (e.g. "Syrupy Casualness", "Corporate Hype").' },
              reason: { type: Type.STRING, description: 'Why this trait undermines the strategic positioning.' },
              badExample: { type: Type.STRING, description: 'A concrete example of what this bad behavior looks like.' },
            },
            required: ['name', 'reason', 'badExample'],
          },
        },
      },
      required: ['primaryArchetype', 'secondaryArchetype', 'coreTraits', 'traitsToAvoid'],
    },
    naming: {
      type: Type.OBJECT,
      properties: {
        territories: {
          type: Type.ARRAY,
          description: 'Exactly 3 distinct linguistic and conceptual naming territories.',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Unique territory id, e.g. "territory_1".' },
              name: { type: Type.STRING, description: 'Territory conceptual name, e.g. "Architectural Sovereignty".' },
              premise: { type: Type.STRING, description: 'The semantic and strategic premise of this naming territory.' },
              candidates: {
                type: Type.ARRAY,
                description: '2 to 3 distinct name candidates within this territory.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: 'Unique candidate id, e.g. "cand_1".' },
                    name: { type: Type.STRING, description: 'The brand name candidate.' },
                    tagline: { type: Type.STRING, description: 'A paired concept tagline for this specific name.' },
                    rationale: { type: Type.STRING, description: 'Strategic and semantic rationale for this name.' },
                    linguisticRoot: { type: Type.STRING, description: 'Etymological or linguistic root (e.g. "Greek kratos (strength, sovereignty)").' },
                    domainFeasibility: { type: Type.STRING, description: 'Realistic domain or handle feasibility (e.g. "getcodename.com / codename.dev").' },
                    score: { type: Type.NUMBER, description: 'Defensibility and fit score from 1 to 10.' },
                  },
                  required: ['id', 'name', 'tagline', 'rationale', 'linguisticRoot', 'domainFeasibility', 'score'],
                },
              },
            },
            required: ['id', 'name', 'premise', 'candidates'],
          },
        },
        selectedCandidateId: {
          type: Type.STRING,
          description: 'The initially recommended candidate id (e.g. "cand_1").',
        },
      },
      required: ['territories'],
    },
    voice: {
      type: Type.OBJECT,
      properties: {
        toneAttributes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 to 5 tone descriptors (e.g. "Rigorous", "Sharp", "Direct", "Understated").',
        },
        narrativeStyle: {
          type: Type.STRING,
          description: 'Core storytelling and narrative style.',
        },
        keyVocabulary: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '5 to 8 preferred terms and signature vocabulary.',
        },
        tabooTerms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '5 to 8 banned buzzwords, clichés, or forbidden terms.',
        },
        rules: {
          type: Type.ARRAY,
          description: '3 to 4 concrete editorial voice rules with practical examples.',
          items: {
            type: Type.OBJECT,
            properties: {
              context: { type: Type.STRING, description: 'Situational context (e.g. "Feature Announcements", "Error Messages").' },
              sayThis: { type: Type.STRING, description: 'Preferred copy phrasing.' },
              avoidThis: { type: Type.STRING, description: 'Forbidden copy phrasing.' },
              rationale: { type: Type.STRING, description: 'Strategic rationale explaining the choice.' },
            },
            required: ['context', 'sayThis', 'avoidThis', 'rationale'],
          },
        },
      },
      required: ['toneAttributes', 'narrativeStyle', 'keyVocabulary', 'tabooTerms', 'rules'],
    },
  },
  required: ['tagline', 'oneLinePitch', 'personality', 'naming', 'voice'],
};

const SYSTEM_PROMPT = `You are the Master Brand Identity Strategist for NEXUS.
Your mission is to translate a verified product concept, structured discovery intelligence, and a human-selected market positioning direction into a cohesive, high-craft brand identity system.

CRITICAL OPERATIONAL RULES:
1. DEEP FIDELITY TO SELECTED POSITIONING: The identity MUST be an organic evolution of the user's selected positioning direction, honoring its target segment, competitive moat, and deliberate strategic sacrifices.
2. CONCRETE NEGATIVE BOUNDARIES: Every elite brand is defined as much by what it rejects as what it embraces. Formulate strict negative personality traits (with bad examples) and taboo vocabulary terms so automated consistency guardians can audit future copy.
3. GROUNDED, MEMORABLE NAMING TERRITORIES: Generate exactly 3 conceptually distinct naming territories. Each candidate must have genuine etymological roots, domain feasibility, and strategic rationale tailored specifically to this product. Avoid repetitive generic AI tech names ("Aether", "Omni", "Nexus", "SmartFlow").
4. DETERMINISTIC VOICE RULES: Provide actionable, situation-specific editorial rules showing exactly what to say versus what to avoid with explicit rationale.
5. SPEAK WITH ARCHITECTURAL CRAFT: Reject generic marketing fluff, buzzwords, and hand-waving platitudes. Every sentence must exhibit intellectual rigor and strategic alignment.`;

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  model: string,
  userPrompt: string,
  maxAttempts = 3
) {
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: SHAPE_RESPONSE_SCHEMA,
          temperature: 0.2,
        },
      });

      return response;
    } catch (err: any) {
      lastError = err;
      const status = err?.status;
      const rawMsg = typeof err?.message === 'string' ? err.message : '';

      const isTransient =
        status === 503 ||
        rawMsg.includes('high demand') ||
        rawMsg.includes('UNAVAILABLE') ||
        rawMsg.includes('temporarily exhausted') ||
        err?.code === 'ETIMEDOUT' ||
        rawMsg.includes('DEADLINE_EXCEEDED');

      if (isTransient && attempt < maxAttempts) {
        const delayMs = attempt * 1500;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    // 1. Verify Gemini API Key (Server-side ONLY)
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API key is missing. Please configure GEMINI_API_KEY in your .env.local file.',
        },
        { status: 500 }
      );
    }

    // 2. Parse & Validate Client Inputs
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request payload.',
        },
        { status: 400 }
      );
    }

    const { idea, discovery, positioning, selectedDirection } = (body || {}) as {
      idea?: InitialIdea;
      discovery?: DiscoveryData;
      positioning?: PositioningData;
      selectedDirection?: PositioningDirection;
    };

    if (!selectedDirection || typeof selectedDirection !== 'object' || !selectedDirection.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'A selected strategic positioning direction is required to shape the brand identity. Please select a direction first.',
        },
        { status: 400 }
      );
    }

    if (!discovery || typeof discovery !== 'object' || !discovery.summary) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid DiscoveryData is required to shape brand identity. Please complete Discover stage first.',
        },
        { status: 400 }
      );
    }

    const productTitle = idea?.title?.trim() || selectedDirection.name;
    const rawConcept = idea?.rawConcept?.trim() || '';
    const founderContext = idea?.founderContext?.trim() || '';

    // 3. Resolve Model (Default to active Free tier Flash-Lite model: gemini-3.5-flash-lite)
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';

    // 4. Initialize Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });

    // 5. Construct Rich Cumulative Context User Prompt
    const userPrompt = `Synthesize a comprehensive brand identity system (personality, naming territories, and voice) for the following active project:

PRODUCT OVERVIEW:
Product Working Name: ${productTitle}
Raw Concept: ${rawConcept || 'Grounded in discovery intelligence'}
Founder Context: ${founderContext || 'None specified'}

HUMAN-SELECTED STRATEGIC POSITIONING ANCHOR:
- Chosen Direction: "${selectedDirection.name}"
- Brand Archetype: ${selectedDirection.archetype}
- Target Segment Focus: ${selectedDirection.targetSegment}
- Concept Tagline: "${selectedDirection.taglineConcept}"
- Core Value Proposition: ${selectedDirection.valueProposition}
- Competitive Moat: ${selectedDirection.competitiveMoat}
- Key Differentiator: ${selectedDirection.keyDifferentiator}
- Explicit Strategic Sacrifice / Trade-off: ${selectedDirection.strategicTradeoff}
${
  selectedDirection.critique
    ? `
ADVERSARIAL STRESS-TEST INSIGHTS:
- Identified Cliché Risks: ${selectedDirection.critique.clicheNotes || 'None'}
- Vulnerable Assumptions: ${selectedDirection.critique.weakAssumptions?.join('; ') || 'None'}
- Strategic Counter-Recommendations: ${selectedDirection.critique.counterRecommendations?.join('; ') || 'Maintain distinctiveness'}
`
    : ''
}

STRUCTURED DISCOVERY FINDINGS:
- Executive Summary: ${discovery.summary}
- Audience Pain Points: ${discovery.audience?.painPoints?.join('; ') || 'Stated in summary'}
- Audience Core Desires: ${discovery.audience?.desires?.join('; ') || 'Stated in summary'}
- Core Problem: ${discovery.problem?.coreProblem || 'Stated in summary'}
- Market Failure / Incumbent Gaps: ${discovery.problem?.marketFailure || 'Incumbent friction'}
- Immediate Launch Goal: ${discovery.goals?.immediateLaunchGoal || 'Rapid market adoption'}
- Non-Negotiable Constraints: ${discovery.constraints?.nonNegotiables?.join('; ') || 'None stated'}

DELIVERABLES:
1. Refined Core Tagline & One-Line Pitch reflecting the selected strategy.
2. Brand Personality with primary/secondary archetypes, 3-5 positive core traits (in action), and 3-4 negative boundaries (traits to avoid with bad examples).
3. Exactly 3 distinct Naming Territories, each containing 2-3 specific, linguistically rooted name candidates with rationale, domain feasibility, and fit score (1-10).
4. Brand Voice guidelines with tone attributes, narrative style, signature key vocabulary, taboo terms to never say, and concrete situation-specific rules.

Generate the complete structured JSON response.`;

    // 6. Generate Structured Content with Google Gemini (with safe retry/backoff)
    const response = await callGeminiWithRetry(ai, model, userPrompt, 3);

    const rawJsonText = response.text;
    if (!rawJsonText) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini returned an empty response for brand shaping. Please retry.',
        },
        { status: 502 }
      );
    }

    // 7. Parse and Validate Structured JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJsonText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini returned malformed JSON for brand shaping. Please retry.',
        },
        { status: 502 }
      );
    }

    const validation = validateAndSanitizeShapeData(parsed);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'The brand identity output failed structural schema validation. Please retry.',
        },
        { status: 502 }
      );
    }

    // 8. Return Structured ShapeData
    return NextResponse.json({
      success: true,
      data: validation.data,
    });
  } catch (err: any) {
    // Safe error handling without exposing API keys or secrets
    const rawMsg = typeof err?.message === 'string' ? err.message : '';
    const status = err?.status;

    // 401: Invalid API Key
    if (
      status === 401 ||
      rawMsg.includes('API_KEY_INVALID') ||
      rawMsg.includes('API key not valid') ||
      (status === 400 && rawMsg.includes('API key'))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini authentication failed. Please verify that your GEMINI_API_KEY in .env.local is valid.',
        },
        { status: 401 }
      );
    }

    // 403: Access Denied
    if (
      status === 403 ||
      rawMsg.includes('PERMISSION_DENIED') ||
      rawMsg.toLowerCase().includes('permission')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied by Google Gemini API. Please check your API key permissions and enabled services.',
        },
        { status: 403 }
      );
    }

    // 429: Rate Limit / Quota Exceeded
    if (
      status === 429 ||
      rawMsg.includes('RESOURCE_EXHAUSTED') ||
      rawMsg.toLowerCase().includes('quota') ||
      rawMsg.toLowerCase().includes('rate limit')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini rate limit or quota exceeded. Please wait a moment and click Retry.',
        },
        { status: 429 }
      );
    }

    // 503: High Demand / Unavailable
    if (
      status === 503 ||
      rawMsg.includes('high demand') ||
      rawMsg.includes('UNAVAILABLE')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini is currently experiencing temporary high demand. Please click Retry in a moment.',
        },
        { status: 503 }
      );
    }

    // 504: Timeout
    if (
      status === 504 ||
      rawMsg.includes('timeout') ||
      rawMsg.includes('DEADLINE_EXCEEDED') ||
      err?.code === 'ETIMEDOUT'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'The request to Google Gemini timed out. Please check your network and click Retry.',
        },
        { status: 504 }
      );
    }

    // 404: Model Not Found / Retired
    if (
      status === 404 ||
      rawMsg.includes('no longer available') ||
      rawMsg.includes('NOT_FOUND')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'The configured Gemini model is unavailable for this key. Please use gemini-3.5-flash-lite in .env.local.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while communicating with Google Gemini. Please retry.',
      },
      { status: 500 }
    );
  }
}
