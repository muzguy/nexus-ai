import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { validateAndSanitizeLaunchData } from '@/lib/validation/launch-validator';
import { executeWithFailover, handleRouterError } from '@/lib/ai';
import { InitialIdea, DiscoveryData } from '@/types/discovery';
import { PositioningData, PositioningDirection } from '@/types/positioning';
import { ShapeData } from '@/types/shape';
import { VisualDirection } from '@/types/visual';
import { ConsistencyReport } from '@/types/consistency';

const VALUE_PILLAR_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Short evocative title for this value pillar.' },
    badge: { type: Type.STRING, description: 'Category pill badge, e.g. "Syllabus Match", "Zero Fluff".' },
    description: { type: Type.STRING, description: '1-2 sentence compelling description.' },
    proofPoint: { type: Type.STRING, description: 'Concrete proof or defensible metric supporting this pillar.' },
  },
  required: ['title', 'badge', 'description', 'proofPoint'],
};

const LAUNCH_CHANNEL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'Unique identifier, e.g. "chan_campus", "chan_x".' },
    name: {
      type: Type.STRING,
      description: 'Channel name, e.g. "Galgotias Department WhatsApp Cohorts", "X/Twitter Technical Thread".',
    },
    priority: { type: Type.STRING, description: 'One of: "primary", "secondary", "experimental".' },
    purpose: { type: Type.STRING, description: 'Strategic launch objective for this channel.' },
    fitRationale: {
      type: Type.STRING,
      description: 'Why this channel specifically fits the target audience and brand tone.',
    },
    suggestedFormat: { type: Type.STRING, description: 'Suggested content format and creative execution.' },
    recommendedAction: { type: Type.STRING, description: 'Concrete immediate action to execute on this channel.' },
  },
  required: ['id', 'name', 'priority', 'purpose', 'fitRationale', 'suggestedFormat', 'recommendedAction'],
};

const LAUNCH_SEQUENCE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    phase: { type: Type.STRING, description: 'One of: "pre_launch", "launch_day", "post_launch".' },
    title: { type: Type.STRING, description: 'Phase title, e.g. "Closed Academic Cohort Drop", "Public Campus Release".' },
    timing: { type: Type.STRING, description: 'Timing window, e.g. "T-Minus 3 Days", "Launch Day", "Day +3 to +7".' },
    action: { type: Type.STRING, description: 'Primary strategic execution action for this phase.' },
    purpose: { type: Type.STRING, description: 'Underlying goal of this phase.' },
    suggestedContent: { type: Type.STRING, description: 'Sample copy or announcement asset for this phase.' },
    successSignal: { type: Type.STRING, description: 'Measurable signal indicating phase success.' },
  },
  required: ['phase', 'title', 'timing', 'action', 'purpose', 'suggestedContent', 'successSignal'],
};

const FIRST_WEEK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    day: { type: Type.STRING, description: 'E.g. "Day 1", "Day 2-3", "Day 4-5", "Day 6-7".' },
    focus: { type: Type.STRING, description: 'Daily priority focus.' },
    action: { type: Type.STRING, description: 'Concrete operational or outreach action.' },
    targetOutcome: { type: Type.STRING, description: 'Specific expected outcome or milestone.' },
  },
  required: ['day', 'focus', 'action', 'targetOutcome'],
};

const SUCCESS_SIGNAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    metric: { type: Type.STRING, description: 'Measurable early metric relevant to the project.' },
    target: { type: Type.STRING, description: 'Realistic target benchmark for launch period.' },
    whyItMatters: {
      type: Type.STRING,
      description: 'Why this metric indicates authentic brand adoption and retention.',
    },
  },
  required: ['metric', 'target', 'whyItMatters'],
};

const AUDIENCE_ANGLE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    segment: { type: Type.STRING, description: 'Audience segment name.' },
    angle: { type: Type.STRING, description: 'Strategic message angle for this segment.' },
    tailoredHook: { type: Type.STRING, description: 'Tailored hook sentence matching brand voice.' },
  },
  required: ['segment', 'angle', 'tailoredHook'],
};

const LAUNCH_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    oneLinePitch: { type: Type.STRING, description: 'Punchy 1-line pitch adhering strictly to brand voice.' },
    elevatorPitch: { type: Type.STRING, description: '30-second conversational elevator pitch without buzzwords.' },
    pressSnippet: { type: Type.STRING, description: 'Official press / announcement release statement.' },
    landingPage: {
      type: Type.OBJECT,
      properties: {
        announcementPill: { type: Type.STRING, description: 'Top pill badge text, e.g. "System Live: Unit Exam Prep".' },
        headline: { type: Type.STRING, description: 'High-impact landing page hero headline.' },
        subheadline: { type: Type.STRING, description: 'Supporting subheadline expanding on the value proposition.' },
        primaryCta: { type: Type.STRING, description: 'Primary action button copy.' },
        secondaryCta: { type: Type.STRING, description: 'Secondary exploratory button copy.' },
        valuePillars: {
          type: Type.ARRAY,
          items: VALUE_PILLAR_SCHEMA,
          description: 'Exactly 3 value pillars with proof points.',
        },
      },
      required: ['announcementPill', 'headline', 'subheadline', 'primaryCta', 'secondaryCta', 'valuePillars'],
    },
    socialLaunch: {
      type: Type.OBJECT,
      properties: {
        xTwitterThread: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Numbered 4-5 tweet launch thread.',
        },
        linkedInPost: { type: Type.STRING, description: 'High-conviction, professional launch post for LinkedIn.' },
        productHuntCard: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Product name.' },
            tagline: { type: Type.STRING, description: 'Tagline strictly under 60 characters.' },
            firstComment: { type: Type.STRING, description: 'Founder / Maker initial comment.' },
          },
          required: ['name', 'tagline', 'firstComment'],
        },
      },
      required: ['xTwitterThread', 'linkedInPost', 'productHuntCard'],
    },
    launchChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: 'Actionable milestone or check item.' },
          done: { type: Type.BOOLEAN, description: 'Initial completion status.' },
          category: { type: Type.STRING, description: 'Category, e.g. "Operations", "Distribution", "Analytics".' },
        },
        required: ['item', 'done', 'category'],
      },
      description: '4-6 pre-flight checklist milestones.',
    },
    launchPositioning: {
      type: Type.OBJECT,
      properties: {
        positioningStatement: { type: Type.STRING, description: 'Formal concise positioning statement.' },
        targetAudienceSummary: { type: Type.STRING, description: 'Primary launch audience definition.' },
        corePromise: { type: Type.STRING, description: 'Uncompromising core brand promise.' },
        differentiatorRationale: { type: Type.STRING, description: 'Why this brand is defensibly differentiated.' },
      },
      required: ['positioningStatement', 'targetAudienceSummary', 'corePromise', 'differentiatorRationale'],
    },
    coreMessage: {
      type: Type.OBJECT,
      properties: {
        primaryHeadline: { type: Type.STRING },
        supportingStatement: { type: Type.STRING },
        primaryCta: { type: Type.STRING },
        elevatorPitch: { type: Type.STRING },
        launchAnnouncement: { type: Type.STRING },
      },
      required: ['primaryHeadline', 'supportingStatement', 'primaryCta', 'elevatorPitch', 'launchAnnouncement'],
    },
    audienceAngles: {
      type: Type.ARRAY,
      items: AUDIENCE_ANGLE_SCHEMA,
      description: '2 to 3 audience-specific message angles.',
    },
    launchChannels: {
      type: Type.ARRAY,
      items: LAUNCH_CHANNEL_SCHEMA,
      description: '3 to 4 recommended launch channels tailored specifically to the project.',
    },
    launchContent: {
      type: Type.OBJECT,
      properties: {
        launchAnnouncement: { type: Type.STRING },
        socialPost: { type: Type.STRING },
        homepageHero: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
          required: ['headline', 'subheadline', 'cta'],
        },
        founderLetter: { type: Type.STRING },
        communityPost: { type: Type.STRING },
      },
      required: ['launchAnnouncement', 'socialPost', 'homepageHero', 'founderLetter', 'communityPost'],
    },
    launchSequence: {
      type: Type.ARRAY,
      items: LAUNCH_SEQUENCE_SCHEMA,
      description: '3 phases: Pre-launch, Launch Day, and Post-launch.',
    },
    firstWeekPlan: {
      type: Type.ARRAY,
      items: FIRST_WEEK_SCHEMA,
      description: 'Concrete Day 1 to Day 7 chronological execution plan.',
    },
    successSignals: {
      type: Type.ARRAY,
      items: SUCCESS_SIGNAL_SCHEMA,
      description: '3 realistic early validation metrics.',
    },
  },
  required: [
    'oneLinePitch',
    'elevatorPitch',
    'pressSnippet',
    'landingPage',
    'socialLaunch',
    'launchChecklist',
    'launchPositioning',
    'coreMessage',
    'audienceAngles',
    'launchChannels',
    'launchContent',
    'launchSequence',
    'firstWeekPlan',
    'successSignals',
  ],
};

const LAUNCH_SYSTEM_INSTRUCTION = `You are the NEXUS Launch & Go-To-Market Strategist—the final stage in the cognitive brand pipeline.
Your mission is to synthesize a complete, launch-ready Launch Kit from the cumulative strategic decisions made across all previous stages.

CRITICAL INVARIANTS:
1. SPECIFIC TO THIS BRAND: Do not output generic SaaS launch templates or Aether OS defaults. All copy, channels, sequences, and metrics must be 100% specific to THIS project's domain, audience, and curriculum/product context.
2. ENFORCE GUARDIAN RULES & BRAND VOICE: Strictly adhere to the established tone attributes, negative boundaries, editorial rules, and taboo terms.
   - If taboo words like "supercharge", "magical", "revolutionize", "disrupt", or "hacks" are forbidden in this brand, NEVER use them in any launch copy.
   - Embody the brand's primary archetype and personality.
3. GROUNDED CHANNELS & SEQUENCE: Recommend channels that actually match where this target audience congregates (e.g. university department cohorts, student Telegram channels, technical threads) rather than generic generic press releases.
4. COHESIVE MESSAGING: Landing page copy, pitch variations, and social threads must all reinforce the chosen positioning moat and strategic sacrifice.
5. STRICT JSON OUTPUT: Return clean JSON conforming exactly to the responseSchema without markdown backticks.`;

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
      consistency?: ConsistencyReport;
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
      consistency,
    } = body;

    // Validate prerequisite state
    if (!selectedDirection || typeof selectedDirection !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error:
            'A selected strategic positioning direction is required to generate the Launch Kit. Please complete prior stages first.',
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
            'Shaped brand identity data (personality and voice rules) is required to generate the Launch Kit. Please complete the Shape stage first.',
        },
        { status: 400 }
      );
    }

    const brandName = selectedName || idea?.title?.trim() || selectedDirection.name;

    // Construct Comprehensive Cumulative Context Prompt
    const userPrompt = `Compile a production-ready, launch-ready GTM Launch Kit for the active brand "${brandName}":

=== ACCUMULATED BRAND SYSTEM ARCHITECTURE ===
Brand Name: "${brandName}"
Tagline: "${shape?.tagline || selectedDirection.taglineConcept}"
One-Line Pitch: "${shape?.oneLinePitch || selectedDirection.valueProposition}"
Target Audience: ${discovery?.audience?.primarySegment || idea?.targetMarketNotes || 'Core target users'}

DISCOVERY INTELLIGENCE:
- Problem Statement: ${discovery?.problem?.coreProblem || idea?.rawConcept || 'Defined in concept'}
- Incumbent Market Failures: ${discovery?.problem?.marketFailure || 'Generic one-size-fits-all tools'}
- Immediate Beachhead Goal: ${discovery?.goals?.immediateLaunchGoal || 'Rapid early cohort adoption'}
- Long-Term Vision: ${discovery?.goals?.longTermVision || 'Category leadership'}

STRATEGIC POSITIONING ANCHOR:
- Strategy Moniker: "${selectedDirection.name}"
- Archetype Pairing: ${selectedDirection.archetype}
- Buyer Psychology: ${selectedDirection.targetSegment}
- Value Proposition: ${selectedDirection.valueProposition}
- Competitive Moat: ${selectedDirection.competitiveMoat}
- Key Differentiator: ${selectedDirection.keyDifferentiator}
- Strategic Sacrifice: ${selectedDirection.strategicTradeoff}

BRAND PERSONALITY & DNA:
- Primary Archetype: ${brandPersonality.primaryArchetype}
- Secondary Archetype: ${brandPersonality.secondaryArchetype}
- Core Traits:
${brandPersonality.coreTraits.map((t) => `  * ${t.name}: ${t.description}`).join('\n')}
- Negative Boundaries (Anti-Patterns to avoid):
${brandPersonality.traitsToAvoid.map((a) => `  * [AVOID] ${a.name}: ${a.reason}`).join('\n')}

BRAND VOICE & EDITORIAL MANDATE:
- Tonal Descriptors: ${brandVoice.toneAttributes?.join(', ') || 'Direct, Rigorous, Understated'}
- Narrative Style: ${brandVoice.narrativeStyle}
- Key Vocabulary (Approved): ${brandVoice.keyVocabulary?.join(', ') || 'None'}
- STRICT TABOO TERMS (FORBIDDEN IN ALL LAUNCH COPY): ${brandVoice.tabooTerms?.join(', ') || 'None'}
- Editorial Rules:
${brandVoice.rules?.map((r) => `  * Context: ${r.context} | SAY: "${r.sayThis}" | AVOID: "${r.avoidThis}"`).join('\n') || '  * None'}

VISUAL DESIGN CONTEXT (from Visualize):
- Aesthetic Thesis: ${visual?.aestheticThesis || 'Sovereign clarity and precision'}
- Visual Avoids: ${visual?.visualAvoids?.join('; ') || 'None'}

GUARDIAN AUDIT CONTEXT (from Stage 6):
- Guardian Verdict: ${consistency?.verdict || 'launch_ready'}
- Consistency Summary: ${consistency?.executiveSummary || 'Verified brand consistency.'}
- Verified Strengths: ${consistency?.highImpactStrengths?.join('; ') || 'Strong strategic alignment.'}

=== GTM DIRECTIVE ===
Synthesize the complete structured Launch Kit.
Ensure:
1. Every headline, pitch, tweet, and announcement strictly follows the established brand voice.
2. ZERO use of forbidden taboo terms.
3. Realistic, specific launch channels tailored directly to where this audience can be reached.
4. A concrete Pre-launch -> Launch Day -> Post-launch sequence.
5. A realistic Day 1 through Day 7 execution plan.
6. Measurable early validation metrics.`;

    // Execute via AI Provider Router (Gemini primary with transient retries -> Groq backup)
    const result = await executeWithFailover(
      {
        systemInstruction: LAUNCH_SYSTEM_INSTRUCTION,
        userPrompt,
        schema: LAUNCH_RESPONSE_SCHEMA,
        signal: req.signal,
      },
      {
        validate: validateAndSanitizeLaunchData,
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
