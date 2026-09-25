import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { validateAndSanitizeDiscoveryData } from '@/lib/validation/discovery-validator';

// Strict schema conforming to Google GenAI controlled generation format
const DISCOVERY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'Executive synthesis of the foundational idea, its core value proposition, and strategic opportunity.',
    },
    audience: {
      type: Type.OBJECT,
      properties: {
        primarySegment: {
          type: Type.STRING,
          description: 'The primary user persona or customer segment grounded in user input.',
        },
        secondarySegment: {
          type: Type.STRING,
          description: 'Secondary or adjacent segment if inferred or stated, otherwise empty.',
        },
        painPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2 to 4 critical, high-friction pain points experienced by this audience.',
        },
        desires: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2 to 4 core desires and functional/emotional outcomes sought by the audience.',
        },
        urgencyDriver: {
          type: Type.STRING,
          description: 'The specific catalyst or urgency trigger driving immediate need for this solution.',
        },
      },
      required: ['primarySegment', 'painPoints', 'desires', 'urgencyDriver'],
    },
    problem: {
      type: Type.OBJECT,
      properties: {
        coreProblem: {
          type: Type.STRING,
          description: 'The root problem and structural tension being solved.',
        },
        marketFailure: {
          type: Type.STRING,
          description: 'Why existing tools, competitors, or incumbents fail to solve this adequately.',
        },
        currentWorkarounds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Sub-optimal workarounds, hacks, or fragmented processes users currently resort to.',
        },
      },
      required: ['coreProblem', 'marketFailure', 'currentWorkarounds'],
    },
    goals: {
      type: Type.OBJECT,
      properties: {
        immediateLaunchGoal: {
          type: Type.STRING,
          description: 'Measurable beachhead milestone for initial launch.',
        },
        longTermVision: {
          type: Type.STRING,
          description: 'Long-term category trajectory or enduring ecosystem goal.',
        },
        keyMetric: {
          type: Type.STRING,
          description: 'The single North Star metric measuring product-brand resonance and adoption.',
        },
      },
      required: ['immediateLaunchGoal', 'longTermVision', 'keyMetric'],
    },
    constraints: {
      type: Type.OBJECT,
      properties: {
        nonNegotiables: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Mandatory brand or technical guardrails (e.g. anti-cliché rules, privacy principles).',
        },
        budgetOrResourceLimits: {
          type: Type.STRING,
          description: 'Known resource or team limits, if stated.',
        },
        regulatoryOrComplianceNotes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Compliance, regulatory, or technical standards, if applicable.',
        },
      },
      required: ['nonNegotiables'],
    },
    openQuestions: {
      type: Type.ARRAY,
      description: '2 to 4 strategic open questions and hypotheses distinguishing assumptions from validated truths.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'Identifier such as oq_1, oq_2.',
          },
          question: {
            type: Type.STRING,
            description: 'Crucial strategic uncertainty or unverified assumption requiring validation.',
          },
          hypothesis: {
            type: Type.STRING,
            description: 'The working hypothesis or inferred angle.',
          },
          status: {
            type: Type.STRING,
            enum: ['open', 'validated', 'dismissed'],
            description: "Validation status. Default to 'open' for unverified founder assumptions.",
          },
        },
        required: ['id', 'question', 'status'],
      },
    },
  },
  required: ['summary', 'audience', 'problem', 'goals', 'constraints', 'openQuestions'],
};

const SYSTEM_PROMPT = `You are an expert strategic brand researcher, product strategist, and market intelligence analyst for NEXUS.
Your mission is to analyze an early-stage product or founder concept and deconstruct it into structured, rigorous strategic intelligence.

CRITICAL OPERATIONAL PRINCIPLES:
1. STRICTLY AVOID GENERIC MARKETING COPY: Never output generic buzzwords, cheerleading fluff ("supercharge", "revolutionary", "seamless", "game-changer", "magic"), or shallow summaries. Act as a disciplined brand strategist.
2. RIGOROUS FIDELITY TO INPUTS: Ground your analysis strictly in the provided product concept, audience clues, and founder context. DO NOT invent fictitious clients, fake revenue, or fabricated proprietary algorithms.
3. CLEAR SEPARATION OF EVIDENCE:
   - What the founder explicitly stated: Preserve and treat as foundational product ground truth.
   - What can reasonably be inferred: State as logical inferences grounded in market dynamics.
   - What is unknown or uncertain: Mark explicitly as unverified assumptions or Open Questions with 'open' status.
4. PROBLEM & MARKET FRICTION: Articulate the structural reasons why incumbent tools or alternative workflows fail the audience, and what messy workarounds users currently use.
5. GOALS & METRICS: Propose a crisp, tangible beachhead launch goal and a measurable North Star brand metric.
6. CONSTRAINTS: Formulate sharp non-negotiables (e.g. anti-clichés, tone boundaries, integrity rules).
7. OPEN QUESTIONS: Formulate 2 to 4 crucial strategic questions that need validation before positioning.`;

/**
 * Execute Gemini generateContent with safe transient retry & increasing backoff.
 * Retries only 503 / UNAVAILABLE / high demand or connection timeouts (maximum 3 attempts).
 */
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
          responseSchema: DISCOVERY_RESPONSE_SCHEMA,
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

      // Only retry transient 503/high-demand/timeouts, never permanent errors (400, 401, 403, 404, 429)
      if (isTransient && attempt < maxAttempts) {
        const delayMs = attempt * 1500; // 1.5s, then 3s
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

    const { productName, audienceClues, rawConcept, founderContext } = body || {};

    const trimmedName = typeof productName === 'string' ? productName.trim() : '';
    const trimmedConcept = typeof rawConcept === 'string' ? rawConcept.trim() : '';

    if (!trimmedName || !trimmedConcept) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product / Concept Name and Raw Concept & Value Proposition are required.',
        },
        { status: 400 }
      );
    }

    // 3. Resolve Model (Default to fast, active Flash-Lite model: gemini-3.5-flash-lite)
    const configuredModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';

    // 4. Initialize Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `Analyze the following foundational product and founder inputs:

Product / Concept Name:
${trimmedName}

Target Market / Audience Clues:
${typeof audienceClues === 'string' && audienceClues.trim() ? audienceClues.trim() : 'Not explicitly specified by founder. Infer potential primary audience and mark secondary audience as unconfirmed.'}

Raw Concept & Value Proposition:
${trimmedConcept}

Founder Context & Personal Conviction:
${typeof founderContext === 'string' && founderContext.trim() ? founderContext.trim() : 'None provided. Infer only from the product concept and explicitly note working assumptions.'}`;

    // 5. Generate Structured Content with Google Gemini (with safe retry/backoff)
    const response = await callGeminiWithRetry(ai, configuredModel, userPrompt, 3);

    const rawJsonText = response.text;

    if (!rawJsonText) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Gemini returned an empty response. Please retry.',
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
          error: 'Google Gemini returned malformed JSON. Please retry.',
        },
        { status: 502 }
      );
    }

    const validation = validateAndSanitizeDiscoveryData(parsed);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'The AI output failed structural schema validation. Please retry.',
        },
        { status: 502 }
      );
    }

    // 7. Return Structured DiscoveryData
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

    // 403: Access Denied / Permission Denied
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

    // 504: Timeout / Deadline Exceeded
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

    // Generic fallback
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while communicating with Google Gemini. Please retry.',
      },
      { status: 500 }
    );
  }
}
