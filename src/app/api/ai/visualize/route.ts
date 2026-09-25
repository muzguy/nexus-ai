import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { validateAndSanitizeVisualData } from '@/lib/validation/visualize-validator';
import { InitialIdea, DiscoveryData } from '@/types/discovery';
import { PositioningData, PositioningDirection } from '@/types/positioning';
import { ShapeData } from '@/types/shape';

const SWATCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Evocative color name (e.g. "Obsidian Core", "Electric Cyan", "Warm Parchment").' },
    hex: { type: Type.STRING, description: 'Valid 6-character hexadecimal color string starting with # (e.g. "#0f172a").' },
    usageRole: { type: Type.STRING, description: 'Semantic usage role (e.g. "Primary Action", "Elevated Card Surface", "Accent Pill").' },
    meaning: { type: Type.STRING, description: 'Strategic or psychological rationale for this color choice.' },
  },
  required: ['name', 'hex', 'usageRole', 'meaning'],
};

const VISUALIZE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    aestheticThesis: {
      type: Type.STRING,
      description: 'Comprehensive creative thesis statement capturing the visual spirit and sensory posture of the brand.',
    },
    rationale: {
      type: Type.STRING,
      description: 'Explicit strategic explanation connecting Position -> Personality -> Visual System.',
    },
    colorMood: {
      type: Type.OBJECT,
      properties: {
        themeName: { type: Type.STRING, description: 'Theme archetype moniker (e.g. "Architectural Monochrome with Solar Flare").' },
        description: { type: Type.STRING, description: 'Detailed color narrative and atmospheric mood description.' },
        lightingMood: { type: Type.STRING, description: 'Lighting and tonal temperature (e.g. "High-contrast directional illumination with deep matte shadows").' },
        palette: {
          type: Type.OBJECT,
          properties: {
            primary: SWATCH_SCHEMA,
            secondary: SWATCH_SCHEMA,
            accent: SWATCH_SCHEMA,
            background: SWATCH_SCHEMA,
            surface: SWATCH_SCHEMA,
            border: SWATCH_SCHEMA,
          },
          required: ['primary', 'secondary', 'accent', 'background', 'surface', 'border'],
        },
      },
      required: ['themeName', 'description', 'lightingMood', 'palette'],
    },
    typography: {
      type: Type.ARRAY,
      description: 'Exactly 3 to 4 typography specifications covering display, headline, body, and monospace.',
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING, description: 'One of: "display", "headline", "body", "mono".' },
          fontFamily: { type: Type.STRING, description: 'Modern accessible font family pairing with fallbacks (e.g. "Outfit, sans-serif", "JetBrains Mono, monospace").' },
          recommendedWeights: { type: Type.STRING, description: 'Weights to use (e.g. "500, 700").' },
          letterSpacing: { type: Type.STRING, description: 'Tracking guidance (e.g. "-0.02em", "0.05em tracking-wider").' },
          lineHeight: { type: Type.STRING, description: 'Leading specification (e.g. "1.15", "1.6").' },
          usageRule: { type: Type.STRING, description: 'Concrete application rule for this typography role.' },
        },
        required: ['role', 'fontFamily', 'recommendedWeights', 'letterSpacing', 'lineHeight', 'usageRule'],
      },
    },
    composition: {
      type: Type.OBJECT,
      properties: {
        density: { type: Type.STRING, description: 'Must be one of: "ultra-minimal", "balanced-technical", "rich-editorial".' },
        gridPrinciple: { type: Type.STRING, description: 'Underlying grid alignment rule and layout cadence.' },
        whiteSpaceStrategy: { type: Type.STRING, description: 'Whitespace rhythm and cognitive breathing room philosophy.' },
      },
      required: ['density', 'gridPrinciple', 'whiteSpaceStrategy'],
    },
    shapesAndGeometry: {
      type: Type.OBJECT,
      properties: {
        cornerRadii: { type: Type.STRING, description: 'Corner curvature philosophy (e.g. "Sharp 2px corners with micro-chamfers", "Smooth 12px pill curves").' },
        borderPhilosophy: { type: Type.STRING, description: 'Border treatment (e.g. "Crisp 1px hairline boundaries", "Diffused ambient glow borders").' },
        shadowDepth: { type: Type.STRING, description: 'Elevation and shadow grading.' },
        geometricSignatures: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 distinct geometric recurring structural motifs.',
        },
      },
      required: ['cornerRadii', 'borderPhilosophy', 'shadowDepth', 'geometricSignatures'],
    },
    imageryPrinciples: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING, description: 'Art direction and imagery treatment.' },
        approvedMotifs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 to 5 approved visual motifs and subject matters.' },
        lightingAndGrading: { type: Type.STRING, description: 'Color grading, contrast, and atmospheric lighting treatment.' },
      },
      required: ['style', 'approvedMotifs', 'lightingAndGrading'],
    },
    visualAvoids: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 6 explicit visual anti-patterns and aesthetic forbidden treatments.',
    },
    logoDirection: {
      type: Type.OBJECT,
      properties: {
        concept: { type: Type.STRING, description: 'Core conceptual premise of the logo mark.' },
        symbolism: { type: Type.STRING, description: 'Metaphorical and symbolic meaning encoded in the mark.' },
        construction: { type: Type.STRING, description: 'Geometric construction rules and proportion guidelines.' },
        usageGuidance: { type: Type.STRING, description: 'Clear space and placement guidelines.' },
        avoids: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 explicit logo anti-patterns (e.g. "Do not tilt", "Do not apply drop shadows").',
        },
      },
      required: ['concept', 'symbolism', 'construction', 'usageGuidance', 'avoids'],
    },
    applicationPreview: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: 'Punchy headline for hero component preview.' },
        subheadline: { type: Type.STRING, description: 'Descriptive subheadline demonstrating the typography.' },
        callToAction: { type: Type.STRING, description: 'Primary button label.' },
        cardPreviewContext: { type: Type.STRING, description: 'Contextual sample content showing the visual language in action.' },
      },
      required: ['headline', 'subheadline', 'callToAction', 'cardPreviewContext'],
    },
  },
  required: [
    'aestheticThesis',
    'colorMood',
    'typography',
    'composition',
    'shapesAndGeometry',
    'imageryPrinciples',
    'visualAvoids',
    'logoDirection',
    'applicationPreview',
  ],
};

const SYSTEM_PROMPT = `You are the Executive Creative Director and Visual Design Architect for NEXUS.
Your mission is to translate a structured brand strategy, discovery intelligence, selected positioning vector, and shaped brand identity into an uncompromising, publication-grade Visual Design Brief.

CRITICAL OPERATIONAL RULES:
1. DEEP DERIVATION FROM STRATEGY: The visual system MUST directly reinforce the user's chosen positioning vector and shaped brand personality. If the brand is technical and academic, use disciplined structural typography and focused palettes. If the brand is high-velocity, use kinetic typography and electric accents. Never generate generic filler.
2. RIGOROUS COLOR HARMONY: Formulate exact 6-character hexadecimal color codes starting with "#". Ensure high functional contrast between background, surface, and text/action elements.
3. CONCRETE LOGO DIRECTION: Provide an honest, structural architectural direction for the logo mark (geometry, symbolism, proportions, and anti-patterns) without pretending to output a bitmap image.
4. EXPLICIT STRATEGIC RATIONALE: Clearly explain the strategic relationship between Position -> Personality -> Visual System in the rationale field.
5. NO AETHER OS OR MOCK FALLBACK: You are designing for THIS SPECIFIC ACTIVE USER PROJECT. Do not mention Aether OS or use canned sample data.`;

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
          responseSchema: VISUALIZE_RESPONSE_SCHEMA,
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
          error: 'AI API key is missing. Please configure GEMINI_API_KEY in your .env.local file.',
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

    const { idea, discovery, positioning, selectedDirection, shape, selectedName } = (body || {}) as {
      idea?: InitialIdea;
      discovery?: DiscoveryData;
      positioning?: PositioningData;
      selectedDirection?: PositioningDirection;
      shape?: ShapeData;
      selectedName?: string;
    };

    if (!selectedDirection || typeof selectedDirection !== 'object' || !selectedDirection.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'A selected strategic positioning direction is required to generate the visual brief. Please select a direction first.',
        },
        { status: 400 }
      );
    }

    if (!shape || typeof shape !== 'object' || !shape.personality) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shaped brand identity data (personality, naming, voice) is required to generate the visual brief. Please complete the Shape stage first.',
        },
        { status: 400 }
      );
    }

    const productTitle = selectedName || idea?.title?.trim() || selectedDirection.name;
    const rawConcept = idea?.rawConcept?.trim() || '';
    const founderContext = idea?.founderContext?.trim() || '';

    // 3. Resolve Model (Default to active Free tier Flash-Lite model: gemini-3.5-flash-lite)
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';

    // 4. Initialize Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });

    // 5. Construct Rich Cumulative Context User Prompt
    const userPrompt = `Synthesize a comprehensive Visual Design Brief for the following active user project:

BRAND IDENTITY CONTEXT:
Active Brand Name: "${productTitle}"
Tagline: "${shape.tagline || selectedDirection.taglineConcept}"
One-Line Pitch: "${shape.oneLinePitch || selectedDirection.valueProposition}"
Raw Concept: ${rawConcept || 'Grounded in discovery findings'}
Founder Vision / Context: ${founderContext || 'None specified'}

SHAPED PERSONALITY & BEHAVIORAL DNA:
- Primary Archetype: ${shape.personality.primaryArchetype}
- Secondary Archetype: ${shape.personality.secondaryArchetype}
- Core Traits:
${shape.personality.coreTraits.map((t) => `  * ${t.name}: ${t.description} (In action: ${t.inAction})`).join('\n')}
- Strict Negative Boundaries (What the brand must NEVER look or sound like):
${shape.personality.traitsToAvoid.map((a) => `  * [AVOID] ${a.name}: ${a.reason}`).join('\n')}

BRAND VOICE & VERBAL ATTRIBUTES:
- Tone Descriptors: ${shape.voice.toneAttributes?.join(', ') || 'Direct, Precise'}
- Narrative Style: ${shape.voice.narrativeStyle}
- Key Vocabulary: ${shape.voice.keyVocabulary?.join(', ') || 'None'}
- Taboo Terms to Avoid: ${shape.voice.tabooTerms?.join(', ') || 'None'}

STRATEGIC POSITIONING ANCHOR:
- Chosen Direction: "${selectedDirection.name}"
- Target Segment: ${selectedDirection.targetSegment}
- Competitive Moat: ${selectedDirection.competitiveMoat}
- Key Differentiator: ${selectedDirection.keyDifferentiator}
- Strategic Sacrifice: ${selectedDirection.strategicTradeoff}

DISCOVERY FINDINGS SUMMARY:
- Problem Space: ${discovery?.problem?.coreProblem || 'Defined in concept'}
- Immediate Goal: ${discovery?.goals?.immediateLaunchGoal || 'Adoption and focus'}

MISSION:
Derive an architectural visual system that gives physical, typographic, and chromatic reality to this exact brand.
Generate the complete structured JSON response complying strictly with the provided responseSchema.`;

    // 6. Generate Structured Content with Google Gemini (with safe retry/backoff)
    const response = await callGeminiWithRetry(ai, model, userPrompt, 3);

    const rawJsonText = response.text;
    if (!rawJsonText) {
      return NextResponse.json(
        {
          success: false,
          error: 'NEXUS AI returned an empty response for visual brief. Please retry.',
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
          error: 'NEXUS AI returned an unparseable response for visual brief. Please retry.',
        },
        { status: 502 }
      );
    }

    const validation = validateAndSanitizeVisualData(parsed);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'The visual brief output failed structural schema validation. Please retry.',
        },
        { status: 502 }
      );
    }

    // 8. Return Structured VisualDirection
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
          error: 'AI authentication failed. Please verify that your GEMINI_API_KEY in .env.local is valid.',
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
          error: 'Access denied by AI service. Please check your API key permissions and enabled services.',
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
          error: 'NEXUS AI rate limit or quota exceeded. Please wait a moment and click Retry.',
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
          error: 'NEXUS AI is currently experiencing temporary high demand. Please click Retry in a moment.',
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
          error: 'The request to NEXUS AI timed out. Please check your network and click Retry.',
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
          error: 'The configured AI model is unavailable for this key. Please use gemini-3.5-flash-lite in .env.local.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while communicating with NEXUS AI. Please retry.',
      },
      { status: 500 }
    );
  }
}
