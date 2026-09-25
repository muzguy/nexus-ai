import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { validateAndSanitizePositioningData } from '@/lib/validation/positioning-validator';
import { InitialIdea, DiscoveryData } from '@/types/discovery';
import { executeWithFailover, handleRouterError } from '@/lib/ai';

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


export async function POST(req: Request) {
  try {
    // 1. Parse & Validate Client Inputs
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

    // 2. Execute via AI Provider Router (Gemini primary with transient retries -> Groq backup)
    const result = await executeWithFailover(
      {
        systemInstruction: SYSTEM_PROMPT,
        userPrompt,
        schema: POSITIONING_RESPONSE_SCHEMA,
        signal: req.signal,
      },
      {
        validate: validateAndSanitizePositioningData,
      }
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      provider: result.provider,
    });
  } catch (err: any) {
    return handleRouterError(err);
  }
}
