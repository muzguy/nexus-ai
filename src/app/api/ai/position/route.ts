import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { validateAndSanitizePositioningData } from '@/lib/validation/positioning-validator';
import { InitialIdea } from '@/types/discovery';
import { DiscoveryData } from '@/types/discovery';

const POSITIONING_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rationale: {
      type: Type.STRING,
      description:
        'Strategic divergence thesis explaining the tension, trade-offs, and why three fundamentally divergent market vectors were engineered.',
    },
    directions: {
      type: Type.ARRAY,
      description:
        'Exactly three strategically distinct, mutually exclusive positioning vectors with explicit trade-offs.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'Unique identifier, e.g. pos_dir_1, pos_dir_2, pos_dir_3.',
          },
          name: {
            type: Type.STRING,
            description: 'Evocative strategic moniker (e.g. "The Sovereign Architect", "The Frictionless Catalyst").',
          },
          archetype: {
            type: Type.STRING,
            description: 'Core brand archetype pairing (e.g. "The Creator / Sage", "The Rebel / Outlaw").',
          },
          targetSegment: {
            type: Type.STRING,
            description: 'Specific focused sub-segment or buyer psychology this direction targets.',
          },
          taglineConcept: {
            type: Type.STRING,
            description: 'Provocative concept tagline capturing the essence of this positioning.',
          },
          valueProposition: {
            type: Type.STRING,
            description: 'Direct, unambiguous value proposition and transformation delivered.',
          },
          competitiveMoat: {
            type: Type.STRING,
            description: 'The structural, defensible competitive advantage underpinning this vector.',
          },
          keyDifferentiator: {
            type: Type.STRING,
            description: 'Sharp contrast against conventional incumbents and alternative choices.',
          },
          strategicTradeoff: {
            type: Type.STRING,
            description: 'Explicit strategic sacrifice: what this brand deliberately says NO to or gives up.',
          },
        },
        required: [
          'id',
          'name',
          'archetype',
          'targetSegment',
          'taglineConcept',
          'valueProposition',
          'competitiveMoat',
          'keyDifferentiator',
          'strategicTradeoff',
        ],
      },
    },
  },
  required: ['rationale', 'directions'],
};

const SYSTEM_PROMPT = `You are an elite brand positioning strategist for NEXUS.
Your mission is to synthesize exactly THREE fundamentally divergent, strategically defensible market positioning directions for a product based on its structured Discovery Intelligence.

CRITICAL OPERATIONAL RULES:
1. DIVERGENT STRATEGIC VECTORS: The three directions must represent genuinely different strategic trade-offs and buyer psychologies, NOT minor semantic variations of the same generic idea.
   - Vector 1: Focus on high-craft, sovereignty, and deep capability (e.g. The Sovereign Architect).
   - Vector 2: Focus on frictionless velocity, radical simplicity, and immediate activation (e.g. The Frictionless Catalyst).
   - Vector 3: Focus on cultural resonance, community empowerment, or category redefinition (e.g. The Movement Weaver / Counter-Culture Challenger).
2. EXPLICIT STRATEGIC SACRIFICES: Strategy is about what you choose NOT to do. Every direction MUST have an explicit, painful trade-off (what customer segment, feature category, or market norm it deliberately abandons).
3. DEEP FIDELITY TO DISCOVERY: Ground all directions in the provided DiscoveryData (target audience pain points, problem space dynamics, and non-negotiables). Do NOT invent generic SaaS platitudes.
4. EXACTLY THREE DIRECTIONS: You must return exactly 3 positioning directions.
5. NO MARKETING HYPE: Avoid empty buzzwords ("supercharge", "revolutionary", "all-in-one", "magic"). Speak with architectural clarity.`;

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
          responseSchema: POSITIONING_RESPONSE_SCHEMA,
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

    const { idea, discovery } = (body || {}) as { idea?: InitialIdea; discovery?: DiscoveryData };

    if (!discovery || typeof discovery !== 'object' || !discovery.summary) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid DiscoveryData is required to synthesize positioning vectors. Please complete Discover stage first.',
        },
        { status: 400 }
      );
    }

    const productTitle = idea?.title?.trim() || 'Product';
    const rawConcept = idea?.rawConcept?.trim() || '';
    const founderContext = idea?.founderContext?.trim() || '';

    // 3. Resolve Model (Default to active Free tier Flash-Lite model: gemini-3.5-flash-lite)
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';

    // 4. Initialize Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `Synthesize 3 divergent market positioning directions for the following validated brand:

PRODUCT INFORMATION:
Product Name: ${productTitle}
Raw Concept: ${rawConcept || 'Grounded in discovery findings'}
Founder Context: ${founderContext || 'None provided'}

STRUCTURED DISCOVERY FINDINGS:
Executive Summary:
${discovery.summary}

Target Audience Profile:
- Primary Segment: ${discovery.audience?.primarySegment || 'Target users'}
- Secondary Segment: ${discovery.audience?.secondarySegment || 'None'}
- Critical Pain Points: ${discovery.audience?.painPoints?.join('; ') || 'Stated in summary'}
- Core Desires: ${discovery.audience?.desires?.join('; ') || 'Stated in summary'}
- Urgency Driver: ${discovery.audience?.urgencyDriver || 'Immediate market need'}

Problem Space & Friction:
- Core Problem: ${discovery.problem?.coreProblem || 'Stated in summary'}
- Market Failure / Incumbent Gaps: ${discovery.problem?.marketFailure || 'Incumbents fail to solve this'}
- Current Workarounds: ${discovery.problem?.currentWorkarounds?.join('; ') || 'Ad-hoc methods'}

Strategic Goals:
- Immediate Beachhead Goal: ${discovery.goals?.immediateLaunchGoal || 'Initial market adoption'}
- Long-term Category Vision: ${discovery.goals?.longTermVision || 'Category leadership'}
- North Star Metric: ${discovery.goals?.keyMetric || 'Retention and growth'}

Constraints & Non-Negotiables:
${discovery.constraints?.nonNegotiables?.map((n) => `- ${n}`).join('\n') || '- None stated'}
${discovery.constraints?.budgetOrResourceLimits ? `Resource Limits: ${discovery.constraints.budgetOrResourceLimits}` : ''}

Generate exactly 3 strategically distinct, mutually exclusive vectors with painful strategic sacrifices.`;

    // 5. Generate Structured Content with Google Gemini (with safe retry/backoff)
    const response = await callGeminiWithRetry(ai, model, userPrompt, 3);

    const rawJsonText = response.text;

    if (!rawJsonText) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini returned an empty response for positioning. Please retry.',
        },
        { status: 502 }
      );
    }

    // 6. Parse and Validate Structured JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJsonText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini returned malformed JSON for positioning. Please retry.',
        },
        { status: 502 }
      );
    }

    const validation = validateAndSanitizePositioningData(parsed);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'The positioning output failed structural schema validation. Please retry.',
        },
        { status: 502 }
      );
    }

    // 7. Return Structured PositioningData
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
