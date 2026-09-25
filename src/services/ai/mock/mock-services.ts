import {
  InitialIdea,
  DiscoveryData,
  PositioningData,
  PositioningDirection,
  ShapeData,
  VisualDirection,
  ConsistencyReport,
  LaunchKit,
  BrandProject,
} from '@/types';
import {
  AIExecutionOptions,
  IDiscoveryService,
  IPositioningService,
  IChallengeService,
  IShapeService,
  IVisualService,
  IConsistencyService,
  ILaunchService,
  IBrandAIServiceContainer,
} from '../types';
import { SAMPLE_PROJECT } from '@/lib/sample-project';
import { generateId } from '@/lib/utils';

// Helper to simulate realistic AI inference latency
const delay = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockDiscoveryService implements IDiscoveryService {
  async analyzeIdea(idea: InitialIdea, options?: AIExecutionOptions): Promise<DiscoveryData> {
    options?.onProgress?.('Parsing raw founder concept and market parameters...');
    await delay(700);

    options?.onProgress?.('Synthesizing target audience segments and latent pain points...');
    await delay(600);

    const title = idea.title.trim() || 'Modern Product Concept';
    const concept = idea.rawConcept.trim() || 'A high-impact technology product';

    return {
      summary: `Deconstructed brand architecture for "${title}". The concept focuses on: ${concept}. The primary strategic opportunity lies in addressing underserved high-velocity teams who are frustrated by fragmented workflows and generic legacy solutions.`,
      audience: {
        primarySegment: idea.targetMarketNotes
          ? `Primary: ${idea.targetMarketNotes}`
          : 'Early Adopter Founders & High-Autonomy Knowledge Workers',
        secondarySegment: 'Growth-Stage Product Operators & Independent Builders',
        painPoints: [
          'High cognitive overhead from using 4-6 disjointed tools to accomplish what should be a unified workflow.',
          'Loss of brand and product momentum due to prolonged agency cycles and alignment bottlenecks.',
          'Disillusionment with superficial "AI wrappers" that lack genuine craftsmanship and domain depth.',
        ],
        desires: [
          'An integrated, intelligent system that acts as a cognitive amplifier rather than a gimmick.',
          'Crisp, defensible positioning that immediately resonates with discerning users.',
          'Fast turnaround from strategic consensus to tangible, launch-ready assets.',
        ],
        urgencyDriver: 'Competitive market timing requiring swift category authority and high-impact GTM.',
      },
      problem: {
        coreProblem: `Builders lack a unified cognitive bridge between raw product intuition ("${title}") and a coherent, market-winning brand system.`,
        marketFailure:
          'Incumbent solutions either require prohibitive $40k+ agency retainers or reduce brand building to random, ungrounded single-prompt text generation.',
        currentWorkarounds: [
          'Ad-hoc Google Docs with inconsistent narrative frameworks.',
          'Generic landing page templates that lack strategic voice or defensibility.',
          'Fragmented design tokens scattered across Figma and CSS stylesheets.',
        ],
      },
      goals: {
        immediateLaunchGoal: 'Capture high-affinity lighthouse users and validate category positioning.',
        longTermVision: `Establish ${title} as the undisputed benchmark standard in its domain.`,
        keyMetric: 'Launch Conversion Rate & Brand Consistency Retention Score',
      },
      constraints: {
        nonNegotiables: [
          'Zero tolerance for generic corporate clichés (e.g. "supercharge", "all-in-one platform").',
          'Aesthetic and voice must reflect technical credibility and premium craft.',
        ],
        budgetOrResourceLimits: 'Rapid agile rollout with lean core team.',
        regulatoryOrComplianceNotes: ['Respect data sovereignty, modern privacy best practices.'],
      },
      openQuestions: [
        {
          id: generateId('oq'),
          question: 'Should the core narrative focus primarily on developer-level autonomy or executive-level ROI?',
          hypothesis: 'Start with builder autonomy to ignite organic grassroots adoption.',
          status: 'open',
        },
        {
          id: generateId('oq'),
          question: 'What is the primary defensible barrier against fast-following commodity tools?',
          hypothesis: 'A proprietary workflow graph linking strategy directly to design and copy tokens.',
          status: 'open',
        },
      ],
    };
  }
}

export class MockPositioningService implements IPositioningService {
  async generateDirections(
    idea: InitialIdea,
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<PositioningData> {
    options?.onProgress?.('Mapping category landscape and competitive White Spaces...');
    await delay(800);

    options?.onProgress?.('Generating 3 strategically divergent market vectors...');
    await delay(800);

    const title = idea.title || 'Nexus Project';

    return {
      rationale:
        'To establish a durable market advantage, we engineered three fundamentally distinct strategic vectors. Each vector targets a different buyer psychology and demands distinct brand trade-offs.',
      directions: [
        {
          id: 'pos_dir_architect',
          name: 'The Sovereign Architect',
          archetype: 'The Visionary Master Builder (Creator / Ruler)',
          targetSegment: 'Discerning technical founders, senior product architects, and design engineers.',
          taglineConcept: `The sovereign operating system for ${title}.`,
          valueProposition: `Elevates ${title} from a mere tool into an architectural framework that gives founders absolute control and precision.`,
          competitiveMoat:
            'Deep cognitive consistency model that locks narrative and design tokens into a unified, version-controlled system.',
          keyDifferentiator: 'Uncompromising rigor and minimal aesthetics; rejects hype in favor of undeniable craft.',
          strategicTradeoff:
            'Deliberately rejects casual low-intent consumers to cultivate intense loyalty among power users.',
          critique: {
            clicheRiskScore: 2,
            clicheNotes: 'Extremely strong differentiation; sets an authoritative, dignified category tone.',
            weakAssumptions: [
              'Assumes customers value craftsmanship enough to choose it over cheaper "instant" commodity tools.',
            ],
            contradictions: [],
            audienceMismatchRisk: 'Low risk; highly attuned to serious creators and builders.',
            differentiationScore: 9,
            strategicViability: 'high',
            challengeVerdict:
              'Highest long-term enterprise value and defensibility. Recommended primary direction.',
            counterRecommendations: [
              'Ensure the onboarding experience does not feel intimidate or overly academic.',
            ],
          },
        },
        {
          id: 'pos_dir_catalyst',
          name: 'The Frictionless Catalyst',
          archetype: 'The High-Velocity Rebel (Outlaw / Magician)',
          targetSegment: 'Agile hackathon teams, solo hackers, and fast-shipping startup operators.',
          taglineConcept: 'Unleash product velocity without friction.',
          valueProposition:
            'Instant, automated synthesis that compresses weeks of tedious brand alignment into 90 seconds.',
          competitiveMoat: 'Unbeatable time-to-value and viral distribution hooks.',
          keyDifferentiator: 'One-click full brand deployment directly to target repositories and CMS.',
          strategicTradeoff: 'Sacrifices deep strategic customization in exchange for raw speed.',
          critique: {
            clicheRiskScore: 7,
            clicheNotes: 'Significant risk of sounding like an undifferentiated AI wrapper or commodity utility.',
            weakAssumptions: [
              'Assumes speed is the main reason founders struggle with brand systems (in reality, quality and voice drift are worse).',
            ],
            contradictions: ['Fast generation often produces generic brands that users abandon.'],
            audienceMismatchRisk: 'High risk of attracting churn-prone bargain hunters.',
            differentiationScore: 4,
            strategicViability: 'high_risk',
            challengeVerdict:
              'Easy short-term viral signups, but weak moat and vulnerable to commoditization.',
            counterRecommendations: [
              'Infuse higher-order constraints and quality filters to differentiate from generic generators.',
            ],
          },
        },
        {
          id: 'pos_dir_syndicate',
          name: 'The Collective Vanguard',
          archetype: 'The Community Guildmaster (Everyman / Sage)',
          targetSegment: 'Collaborative teams, venture studios, and community-driven open ecosystems.',
          taglineConcept: 'Where high-impact teams build living brand lore.',
          valueProposition:
            'A multiplayer brand intelligence hub where distributed contributors co-create brand identity with AI assistance.',
          competitiveMoat: 'Network effects from team collaboration and cross-organization brand benchmarks.',
          keyDifferentiator: 'Focus on collective intelligence, lore-building, and continuous governance.',
          strategicTradeoff: 'Requires multi-user buy-in and longer adoption cycles than single-player workflows.',
          critique: {
            clicheRiskScore: 4,
            clicheNotes: 'Refreshing collaborative framing, though "community" can feel nebulous without concrete tooling.',
            weakAssumptions: ['Assumes distributed teams actively collaborate on early brand building.'],
            contradictions: [],
            audienceMismatchRisk: 'Medium; resonates with studios, less with solo founders in early stealth.',
            differentiationScore: 7,
            strategicViability: 'moderate',
            challengeVerdict:
              'Compelling expansion strategy after establishing initial founder-level product-market fit.',
            counterRecommendations: [
              'Lead with single-player utility first, then unlock team collaboration as an advanced tier.',
            ],
          },
        },
      ],
    };
  }
}

export class MockChallengeService implements IChallengeService {
  async stressTestDirections(
    directions: PositioningDirection[],
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<PositioningDirection[]> {
    options?.onProgress?.('Auditing directions against cliché databases and market fatigue tropes...');
    await delay(700);

    options?.onProgress?.('Stress-testing strategic trade-offs and audience alignment...');
    await delay(700);

    return directions.map((dir) => {
      if (dir.critique) return dir;
      return {
        ...dir,
        critique: {
          clicheRiskScore: 3,
          clicheNotes: 'Audited by Nexus Adversarial Critic.',
          weakAssumptions: ['Assumes market readiness for high-craft branding workflows.'],
          contradictions: [],
          audienceMismatchRisk: 'Low to moderate.',
          differentiationScore: 8,
          strategicViability: 'high',
          challengeVerdict: 'Viable strategic vector with strong internal consistency.',
          counterRecommendations: ['Refine value proposition to highlight concrete ROI metrics.'],
        },
      };
    });
  }
}

export class MockShapeService implements IShapeService {
  async shapeBrandIdentity(
    selectedDirection: PositioningDirection,
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<ShapeData> {
    options?.onProgress?.('Formulating brand personality archetypes and behavioral boundaries...');
    await delay(750);

    options?.onProgress?.('Synthesizing naming territories, linguistic roots, and voice rules...');
    await delay(800);

    const dirName = selectedDirection.name;

    return {
      tagline: selectedDirection.taglineConcept || 'Engineered Identity for High-Craft Brands',
      oneLinePitch: `${discovery.summary.slice(0, 140)}... Built on the strategic foundation of ${dirName}.`,
      personality: {
        primaryArchetype: `${selectedDirection.archetype}`,
        secondaryArchetype: 'The Precision Instrument Maker',
        coreTraits: [
          {
            name: 'Architectural Substance',
            description: 'Every statement is rooted in structural logic and concrete utility. Never hollow bravado.',
            inAction: 'Product communications explain mechanics before claiming benefits.',
          },
          {
            name: 'Restrained Authority',
            description: 'Confident, unhurried, and precise. Let the clarity of the work speak for itself.',
            inAction: 'Clean layouts with ample breathing room, devoid of desperate attention-seeking badges.',
          },
          {
            name: 'Intellectual Candor',
            description: 'Speaks with radical clarity about what the product is and what it chooses not to be.',
            inAction: 'Explicitly defining boundaries and target audience personas without fear of exclusion.',
          },
        ],
        traitsToAvoid: [
          {
            name: 'Sycophantic AI Hype',
            reason: 'Alienates intelligent builders who are sick of hearing about "magic" and "superpowers".',
            badExample: '"Supercharge your entire universe with revolutionary AI magic!"',
          },
          {
            name: 'Corporate Bureaucratese',
            reason: 'Drains vitality and signals a lack of founder conviction.',
            badExample: '"Leveraging cross-functional synergies to optimize stakeholder touchpoints."',
          },
        ],
      },
      naming: {
        selectedCandidateId: 'cand_1',
        territories: [
          {
            id: 'terr_arch',
            name: 'Structural Primaries',
            premise: 'Names grounded in spatial permanence, foundation stones, and timeless form.',
            candidates: [
              {
                id: 'cand_1',
                name: 'Aether OS',
                tagline: 'The Operating System for Sovereign Brands',
                rationale: 'Evokes the pristine, elemental medium that connects all living matter.',
                linguisticRoot: 'Ancient Greek αἰθήρ (pure, luminous upper atmosphere)',
                domainFeasibility: 'aetheros.dev (Available)',
                score: 9.5,
              },
              {
                id: 'cand_2',
                name: 'Kratos',
                tagline: 'Strength Through Structure',
                rationale: 'Clean, singular phonetic punch emphasizing sovereign authority.',
                linguisticRoot: 'Greek κράτος (sovereign strength, power)',
                domainFeasibility: 'kratos.systems (Available)',
                score: 8.7,
              },
            ],
          },
          {
            id: 'terr_dynam',
            name: 'Kinetic Clarity',
            premise: 'Names reflecting swift intellectual focus and frictionless computational flow.',
            candidates: [
              {
                id: 'cand_3',
                name: 'Vectra',
                tagline: 'Directional Brand Velocity',
                rationale: 'Modern, agile, and mathematically grounded in vector geometry.',
                linguisticRoot: 'Latin vector (carrier, direct trajectory)',
                domainFeasibility: 'vectra.build (Available)',
                score: 8.4,
              },
            ],
          },
        ],
      },
      voice: {
        toneAttributes: ['Architectural', 'Direct', 'Incisive', 'Unapologetic', 'Erudite'],
        narrativeStyle:
          'We write with the analytical depth of an experienced engineer and the aesthetic discernment of an industrial designer.',
        keyVocabulary: ['Sovereignty', 'Substance', 'Integrity', 'System', 'Primitive', 'Defensible', 'Craft'],
        tabooTerms: ['Supercharge', 'Unleash', 'Revolutionize', 'Magic', 'Seamless', 'Disrupt'],
        rules: [
          {
            context: 'Product Launch Announcements',
            sayThis: 'System v1.0 is live with deterministic positioning workflows.',
            avoidThis: 'We are thrilled to finally share our magical new AI tool!',
            rationale: 'Engineers respect precise mechanics over emotional hyperbole.',
          },
          {
            context: 'Call to Action Buttons',
            sayThis: 'Initialize brand workspace.',
            avoidThis: 'Start your magical journey today!',
            rationale: 'Dignified, intentional action verbs inspire serious commitment.',
          },
        ],
      },
    };
  }
}

export class MockVisualService implements IVisualService {
  async synthesizeVisualBrief(
    selectedDirection: PositioningDirection,
    shape: ShapeData,
    options?: AIExecutionOptions
  ): Promise<VisualDirection> {
    options?.onProgress?.('Calculating harmonious color ratios and optical contrast values...');
    await delay(750);

    options?.onProgress?.('Synthesizing typography hierarchy, composition grids, and imagery rules...');
    await delay(750);

    return SAMPLE_PROJECT.visualDirection!;
  }
}

export class MockConsistencyService implements IConsistencyService {
  async auditBrandSystem(
    project: BrandProject,
    options?: AIExecutionOptions
  ): Promise<ConsistencyReport> {
    options?.onProgress?.('Scanning naming candidates against positioning constraints...');
    await delay(600);

    options?.onProgress?.('Cross-referencing voice rules with launch copy tone...');
    await delay(600);

    options?.onProgress?.('Calculating systemic coherence index and guardian verification stamp...');
    await delay(600);

    return SAMPLE_PROJECT.consistency!;
  }
}

export class MockLaunchService implements ILaunchService {
  async generateLaunchKit(
    project: BrandProject,
    options?: AIExecutionOptions
  ): Promise<LaunchKit> {
    options?.onProgress?.('Drafting high-conversion landing page hero & value pillars...');
    await delay(700);

    options?.onProgress?.('Generating multiline X launch thread, LinkedIn post, and Product Hunt card...');
    await delay(750);

    return SAMPLE_PROJECT.launchKit!;
  }
}

export const mockAIServices: IBrandAIServiceContainer = {
  discovery: new MockDiscoveryService(),
  positioning: new MockPositioningService(),
  challenge: new MockChallengeService(),
  shape: new MockShapeService(),
  visual: new MockVisualService(),
  consistency: new MockConsistencyService(),
  launch: new MockLaunchService(),
};
