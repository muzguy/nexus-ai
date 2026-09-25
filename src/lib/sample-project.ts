import { BrandProject } from '@/types';

export const SAMPLE_PROJECT: BrandProject = {
  id: 'proj_sample_nexus_01',
  name: 'Aether OS',
  createdAt: '2026-09-25T10:00:00Z',
  updatedAt: '2026-09-25T12:30:00Z',
  currentStage: 'launch',
  stageStatus: {
    discover: 'completed',
    position: 'completed',
    challenge: 'completed',
    shape: 'completed',
    visualize: 'completed',
    consistency: 'completed',
    launch: 'completed',
  },
  idea: {
    title: 'Aether OS',
    rawConcept:
      'An autonomous context engine and brand OS for modern product builders that turns messy thoughts into living design and narrative architectures.',
    targetMarketNotes: 'Technical founders, creative engineers, and elite design studios building next-gen software.',
    founderContext: 'Ex-design leads frustrated with generic AI tools and fragmented brand management.',
  },
  discovery: {
    summary:
      'High-velocity product teams face a severe disconnect between raw technical iteration and cohesive brand narrative. Traditional branding agencies are too slow (months), while standard LLMs yield generic, ungrounded cliché templates.',
    audience: {
      primarySegment: 'Creative Engineers & Founding Designers',
      secondarySegment: 'Product-led Venture Studios & Solo Dev-Preneurs',
      painPoints: [
        'Branding and positioning feel detached from weekly product code deployments.',
        'Copy and visual design drift apart as team members produce ad-hoc assets.',
        'Existing AI tools generate robotic, cliché marketing jargon that insults their intelligence.',
      ],
      desires: [
        'A single source of truth for narrative, tone, and visual guidelines that updates with the product.',
        'Unapologetically sophisticated aesthetic and strategic depth, not canned advice.',
        'Zero-latency translation from raw product concepts to launch-grade collateral.',
      ],
      urgencyDriver: 'Preparing for imminent public beta launch and Series Seed fundraising.',
    },
    problem: {
      coreProblem:
        'Founders possess immense product conviction but lack the systematic vocabulary to codify and scale their brand essence.',
      marketFailure:
        'Existing brand tooling forces a false dichotomy: $50k 3-month agency retainer or generic ChatGPT regurgitation.',
      currentWorkarounds: [
        'Scattered Notion docs that nobody reads after week one.',
        'One-off ChatGPT prompts with no memory of prior positioning decisions.',
        'Ad-hoc Figma files with mismatched typefaces and conflicting color tones.',
      ],
    },
    goals: {
      immediateLaunchGoal: 'Establish an undeniable category presence and acquire first 500 lighthouse design partners.',
      longTermVision: 'Become the default operating system for high-craft technology brands.',
      keyMetric: 'Weekly Brand Asset Velocity & Consistency Index across all public touchpoints.',
    },
    constraints: {
      nonNegotiables: [
        'Must avoid corporate startup clichés like "revolutionize", "seamless", and "supercharge".',
        'Visual identity must feel native to dark-mode developer tools, not generic enterprise SaaS.',
      ],
      budgetOrResourceLimits: 'Lean team of 3 builders with 6-week runway to launch.',
      regulatoryOrComplianceNotes: ['Open-source telemetry friendly, strict data privacy standards.'],
    },
    openQuestions: [
      {
        id: 'oq_1',
        question: 'Should the voice lean into hardcore technical precision or poetic design philosophy?',
        hypothesis: 'A hybrid: technical rigor wrapped in architectural minimalism.',
        status: 'validated',
      },
      {
        id: 'oq_2',
        question: 'Does the name need to explicitly describe "OS" or exist as an abstract vessel?',
        hypothesis: 'An evocative abstract vessel with architectural grounding.',
        status: 'validated',
      },
    ],
  },
  positioning: {
    rationale:
      'Evaluated three fundamentally divergent strategic vectors across the accessibility vs craft spectrum.',
    directions: [
      {
        id: 'pos_dir_1',
        name: 'The Sovereign Architect',
        archetype: 'The Visionary Builder & High-Craft Artisan',
        targetSegment: 'Technical founders and design engineers building sovereign, high-margin software.',
        taglineConcept: 'The operating system for uncompromising software brands.',
        valueProposition:
          'Transforms raw code and product mechanics into living, high-craft brand systems with architectural precision.',
        competitiveMoat:
          'Deep semantic graph connecting product codebase architecture directly to brand rules and visual assets.',
        keyDifferentiator:
          'Rejects generic LLM optimism in favor of sharp, minimalist strategic discipline.',
        strategicTradeoff:
          'Sacrifices mass-market non-technical users to build fanatic loyalty among top 1% engineering designers.',
        critique: {
          clicheRiskScore: 2,
          clicheNotes: 'Extremely differentiated; completely avoids standard "AI assistant" tropes.',
          weakAssumptions: [
            'Assumes technical founders value brand rigor enough to pay premium rates.',
          ],
          contradictions: [],
          audienceMismatchRisk: 'Low; specifically tailored to engineering aesthetics.',
          differentiationScore: 9,
          strategicViability: 'high',
          challengeVerdict:
            'Strongest defensible stance. High willingness to pay and extreme resonance with target audience.',
          counterRecommendations: [
            'Ensure documentation and onboarding do not feel overly austere or gatekept.',
          ],
        },
      },
      {
        id: 'pos_dir_2',
        name: 'The Frictionless Dynamo',
        archetype: 'The Catalyst & Accelerator',
        targetSegment: 'Early-stage bootstrappers and hackathon founders shipping MVPs weekly.',
        taglineConcept: 'Zero to brand in 60 seconds.',
        valueProposition:
          'Instant, end-to-end brand generation from a single terminal command or prompt.',
        competitiveMoat: 'Speed and low friction.',
        keyDifferentiator: 'One-click full brand deployment directly to Vercel and GitHub.',
        strategicTradeoff: 'Lacks deep customization and high-craft strategic nuance.',
        critique: {
          clicheRiskScore: 8,
          clicheNotes: 'High cliché danger; sounds like 50 existing wrapper products.',
          weakAssumptions: ['Assumes speed is the primary bottleneck rather than brand quality.'],
          contradictions: ['Fast generation often yields disposable, forgettable brands.'],
          audienceMismatchRisk: 'High; risks attracting churn-heavy low-LTV users.',
          differentiationScore: 3,
          strategicViability: 'high_risk',
          challengeVerdict: 'Commoditizes the product into a race to the bottom.',
          counterRecommendations: ['Do not pursue unless willing to compete solely on price and distribution.'],
        },
      },
      {
        id: 'pos_dir_3',
        name: 'The Living Narrative',
        archetype: 'The Storyteller & Culture Weaver',
        targetSegment: 'Creator-founders, community leaders, and narrative-first consumer startups.',
        taglineConcept: 'Where technical breakthroughs find their mythos.',
        valueProposition:
          'Translates complex technology into captivating cultural narratives and community lore.',
        competitiveMoat: 'Narrative synthesis algorithms and cultural trend mapping.',
        keyDifferentiator: 'Focus on emotional resonance and myth-making rather than UI tokens.',
        strategicTradeoff: 'Weaker integration with developer tools and technical workflows.',
        critique: {
          clicheRiskScore: 4,
          clicheNotes: 'Compelling angle, but may feel too fluffy for hardcore engineers.',
          weakAssumptions: ['Founders might struggle to see immediate ROI on "mythos".'],
          contradictions: [],
          audienceMismatchRisk: 'Medium; resonates strongly with consumer founders, less with B2B dev tools.',
          differentiationScore: 7,
          strategicViability: 'moderate',
          challengeVerdict: 'Powerful secondary narrative pillar, but narrower primary TAM.',
          counterRecommendations: ['Incorporate storytelling elements as a module under the Architect pillar.'],
        },
      },
    ],
  },
  selectedDirection: {
    id: 'pos_dir_1',
    name: 'The Sovereign Architect',
    archetype: 'The Visionary Builder & High-Craft Artisan',
    targetSegment: 'Technical founders and design engineers building sovereign, high-margin software.',
    taglineConcept: 'The operating system for uncompromising software brands.',
    valueProposition:
      'Transforms raw code and product mechanics into living, high-craft brand systems with architectural precision.',
    competitiveMoat:
      'Deep semantic graph connecting product codebase architecture directly to brand rules and visual assets.',
    keyDifferentiator:
      'Rejects generic LLM optimism in favor of sharp, minimalist strategic discipline.',
    strategicTradeoff:
      'Sacrifices mass-market non-technical users to build fanatic loyalty among top 1% engineering designers.',
    critique: {
      clicheRiskScore: 2,
      clicheNotes: 'Extremely differentiated; completely avoids standard "AI assistant" tropes.',
      weakAssumptions: [
        'Assumes technical founders value brand rigor enough to pay premium rates.',
      ],
      contradictions: [],
      audienceMismatchRisk: 'Low; specifically tailored to engineering aesthetics.',
      differentiationScore: 9,
      strategicViability: 'high',
      challengeVerdict:
        'Strongest defensible stance. High willingness to pay and extreme resonance with target audience.',
      counterRecommendations: [
        'Ensure documentation and onboarding do not feel overly austere or gatekept.',
      ],
    },
  },
  personality: {
    primaryArchetype: 'The Sovereign Architect (Creator / Sage)',
    secondaryArchetype: 'The Unflinching Critic (Ruler / Outlaw)',
    coreTraits: [
      {
        name: 'Architectural Rigor',
        description: 'Every statement, token, and decision has structural necessity. No ornamentation without function.',
        inAction: 'Writing documentation with mathematical clarity and structural hierarchy.',
      },
      {
        name: 'Understated Confidence',
        description: 'Never shouts, pleads, or begs for engagement. Conviction is communicated through precision.',
        inAction: 'Clean monochrome interfaces with purposeful micro-accents instead of rainbow confetti.',
      },
      {
        name: 'Intellectual Honesty',
        description: 'Calls out flaws, trade-offs, and edge cases with candid clarity.',
        inAction: 'Explicitly warning users when an idea is derivative or structurally unsound.',
      },
    ],
    traitsToAvoid: [
      {
        name: 'Hype-Merchant Cheerleading',
        reason: 'Eats away credibility with technical leaders who distrust marketing fluff.',
        badExample: '"Supercharge your mind-blowing brand with AI magic!"',
      },
      {
        name: 'Corporate Blandness',
        reason: 'Blends into the gray soup of forgettable enterprise software.',
        badExample: '"Next-generation paradigm solutions for synergistic stakeholders."',
      },
    ],
  },
  naming: {
    selectedCandidateId: 'name_1',
    territories: [
      {
        id: 'terr_1',
        name: 'Architectural Vessels',
        premise: 'Names evoking spatial permanence, structural scaffolds, and classical geometry.',
        candidates: [
          {
            id: 'name_1',
            name: 'Aether OS',
            tagline: 'The Operating System for Sovereign Brands',
            rationale: 'Evokes the pristine, elemental medium that connects all living matter.',
            linguisticRoot: 'Ancient Greek αἰθήρ (pure, pristine air / cosmic medium)',
            domainFeasibility: 'aetheros.dev (Available), aether.brand (Pending)',
            score: 9.4,
          },
          {
            id: 'name_2',
            name: 'Forma',
            tagline: 'Structure Before Substance',
            rationale: 'Clean Latinate simplicity; immediate connection to morphology and architecture.',
            linguisticRoot: 'Latin forma (shape, mold, structure)',
            domainFeasibility: 'forma.build (Available)',
            score: 8.8,
          },
        ],
      },
      {
        id: 'terr_2',
        name: 'Kinetic Logic',
        premise: 'Names evoking computational momentum and immutable execution.',
        candidates: [
          {
            id: 'name_3',
            name: 'Kratos Matrix',
            tagline: 'Engineered Identity',
            rationale: 'Dense, muscular authority for infrastructure-level brand operations.',
            linguisticRoot: 'Greek κράτος (strength, power, dominion)',
            domainFeasibility: 'kratosmatrix.io (Available)',
            score: 8.1,
          },
        ],
      },
    ],
  },
  voice: {
    toneAttributes: ['Architectural', 'Crisp', 'Direct', 'Unadorned', 'Discerning'],
    narrativeStyle:
      'We write like senior systems architects who also appreciate brutalist typography: concise, factual, and deeply intentional.',
    keyVocabulary: ['Sovereignty', 'Substance', 'Integrity', 'System', 'Primitive', 'Defensible', 'Craft'],
    tabooTerms: ['Supercharge', 'Unleash', 'Revolutionize', 'Magic', 'Seamless', 'Disrupt'],
    rules: [
      {
        context: 'Feature Announcement',
        sayThis: 'System update 2.4 introduces deterministic color harmony algorithms.',
        avoidThis: 'We are thrilled to unveil our magical new color AI!',
        rationale: 'Engineers respect precise mechanics over emotional hyperbole.',
      },
      {
        context: 'Call to Action',
        sayThis: 'Initialize your brand workspace.',
        avoidThis: 'Click here to start your exciting journey today!',
        rationale: 'Action-oriented, calm imperative tone.',
      },
    ],
  },
  shapeData: {
    tagline: 'The Operating System for Sovereign Brands',
    oneLinePitch:
      'Aether OS empowers technical builders to synthesize, stress-test, and govern launch-ready brand systems with computational rigor.',
    personality: {
      primaryArchetype: 'The Sovereign Architect (Creator / Sage)',
      secondaryArchetype: 'The Unflinching Critic (Ruler / Outlaw)',
      coreTraits: [
        {
          name: 'Architectural Rigor',
          description: 'Every statement, token, and decision has structural necessity. No ornamentation without function.',
          inAction: 'Writing documentation with mathematical clarity and structural hierarchy.',
        },
      ],
      traitsToAvoid: [
        {
          name: 'Hype-Merchant Cheerleading',
          reason: 'Eats away credibility with technical leaders who distrust marketing fluff.',
          badExample: '"Supercharge your mind-blowing brand with AI magic!"',
        },
      ],
    },
    naming: {
      selectedCandidateId: 'name_1',
      territories: [],
    },
    voice: {
      toneAttributes: ['Architectural', 'Crisp', 'Direct'],
      narrativeStyle: 'Concise, factual, intentional.',
      keyVocabulary: ['Sovereignty', 'Substance', 'Integrity'],
      tabooTerms: ['Supercharge', 'Unleash'],
      rules: [],
    },
  },
  visualDirection: {
    aestheticThesis:
      'Dark obsidian substrates paired with razor-sharp monospaced coordinates, subtle cyan refraction, and architectural grids.',
    colorMood: {
      themeName: 'Obsidian Void & Refractive Cyan',
      description: 'A disciplined, deep-space palette engineered for high contrast and sustained cognitive focus.',
      palette: {
        background: { name: 'Deep Void', hex: '#07090E', usageRole: 'Canvas Background', meaning: 'Infinite depth, distraction-free focus' },
        surface: { name: 'Obsidian Slab', hex: '#0E131F', usageRole: 'Component Cards & Panels', meaning: 'Tactile, grounded digital masonry' },
        border: { name: 'Subtle Slate Line', hex: '#1C263B', usageRole: 'Borders & Dividers', meaning: 'Precision framing and structural boundaries' },
        primary: { name: 'Luminescent Cyan', hex: '#00E5FF', usageRole: 'Primary Interaction & Signals', meaning: 'High-energy electrical focus' },
        secondary: { name: 'Spectral Indigo', hex: '#6366F1', usageRole: 'Supportive Accents & Highlights', meaning: 'Intellectual depth and cohesion' },
        accent: { name: 'Solar Amber', hex: '#F59E0B', usageRole: 'Alerts & Critical Callouts', meaning: 'Intentional attention redirection' },
      },
      lightingMood: 'Subtle rim lights and controlled ambient glows against pure dark planes.',
    },
    typography: [
      {
        role: 'display',
        fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
        recommendedWeights: '600, 700',
        letterSpacing: '-0.03em',
        lineHeight: '1.1',
        usageRule: 'Reserve strictly for hero statements and section titles. Never italicize.',
      },
      {
        role: 'headline',
        fontFamily: 'Inter, system-ui, sans-serif',
        recommendedWeights: '500, 600',
        letterSpacing: '-0.02em',
        lineHeight: '1.25',
        usageRule: 'Use for card titles, module headings, and key takeaway statements.',
      },
      {
        role: 'body',
        fontFamily: 'Inter, system-ui, sans-serif',
        recommendedWeights: '400, 500',
        letterSpacing: '-0.01em',
        lineHeight: '1.6',
        usageRule: 'Core narrative and documentation readability.',
      },
      {
        role: 'mono',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        recommendedWeights: '400, 500',
        letterSpacing: '0em',
        lineHeight: '1.4',
        usageRule: 'Status tags, system coordinates, metrics, and structural tokens.',
      },
    ],
    composition: {
      density: 'balanced-technical',
      gridPrinciple: 'Strict 8pt base grid with asymmetric 12-column editorial layouts.',
      whiteSpaceStrategy: 'Generous external margins with dense, highly organized internal card clusters.',
    },
    shapesAndGeometry: {
      cornerRadii: '6px to 10px — crisp and restrained, avoiding bubbly 24px+ circles.',
      borderPhilosophy: '1px crisp hairline borders with 15% opacity accents.',
      shadowDepth: 'Diffuse dark ambient occlusion shadows with zero colored blur spam.',
      geometricSignatures: ['Hairline crosshair coordinates', 'Subtle 1px bracket corners', 'Structured tabular dividers'],
    },
    imageryPrinciples: {
      style: 'Dark mode isometric wireframes, optical ray-traced caustics, and architectural schematics.',
      approvedMotifs: ['Prismatic light refractions', 'Vector lattice topologies', 'Laser-etched typography samples'],
      lightingAndGrading: 'High key rim lighting against near-black matte backdrops.',
    },
    visualAvoids: [
      'Pastel "SaaS illustration" flat cartoon characters',
      'Blurry gradient blobs floating meaninglessly',
      'Overly rounded 30px pill buttons that look like toys',
      'Stock photography of smiling office workers pointing at glass whiteboards',
    ],
  },
  consistency: {
    overallIntegrityScore: 96,
    verdict: 'launch_ready',
    executiveSummary:
      'The brand ecosystem demonstrates exceptional internal coherence. The "Sovereign Architect" positioning provides an airtight justification for the restrained Obsidian visual palette, the authoritative voice guidelines, and the surgical launch messaging.',
    guardianStamp: {
      evaluatedAt: '2026-09-25T14:15:00Z',
      verifiedBy: 'Nexus Consistency Guardian v1.0',
    },
    audits: [
      {
        id: 'audit_1',
        component: 'naming',
        title: 'Name & Archetype Harmony',
        alignmentScore: 98,
        status: 'aligned',
        evaluatedAgainst: 'The Sovereign Architect Positioning',
        finding: '"Aether OS" anchors the product as infrastructure rather than a flimsy utility.',
        recommendation: 'Maintain strict capitalization and pairing with the "OS" designation.',
      },
      {
        id: 'audit_2',
        component: 'tagline',
        title: 'Tagline Precision & Subtlety',
        alignmentScore: 94,
        status: 'aligned',
        evaluatedAgainst: 'Non-Negotiable Cliché Avoidance',
        finding: '"The Operating System for Sovereign Brands" completely excludes hype-phrases and sets a dignified bar.',
        recommendation: 'Ensure all subhead copy maintains the same restraint.',
      },
      {
        id: 'audit_3',
        component: 'voice',
        title: 'Tone Discipline & Technical Respect',
        alignmentScore: 95,
        status: 'aligned',
        evaluatedAgainst: 'Creative Engineer Audience Profile',
        finding: 'The prohibition of buzzwords like "supercharge" directly answers developer skepticism.',
        recommendation: 'Publish the voice rules publicly as a manifesto to build immediate trust.',
      },
      {
        id: 'audit_4',
        component: 'visual_direction',
        title: 'Palette Tone vs Narrative Identity',
        alignmentScore: 97,
        status: 'aligned',
        evaluatedAgainst: 'Obsidian Void & Refractive Cyan',
        finding: 'The visual palette mirrors the tools engineers live in (VS Code, Terminal, Raycast).',
        recommendation: 'Guard against over-saturating the cyan; preserve it for stateful actions.',
      },
      {
        id: 'audit_5',
        component: 'launch_messaging',
        title: 'GTM Narrative Alignment',
        alignmentScore: 96,
        status: 'aligned',
        evaluatedAgainst: 'Seed-Stage Lighthouse Partners Goal',
        finding: 'Pitch deck and launch messaging target high-craft founders with surgical relevance.',
        recommendation: 'Ready to deploy to production launch channels.',
      },
    ],
    highImpactStrengths: [
      'Unbroken chain of reasoning from founder discovery to launch kit copy.',
      'Distinct visual and verbal stance that immediately stands out from generic AI wrappers.',
      'Defensible market positioning with explicit strategic trade-offs.',
    ],
    keyVulnerabilities: [
      'High aesthetic standard requires team discipline to avoid slipping into generic shortcuts during asset production.',
    ],
  },
  launchKit: {
    oneLinePitch:
      'Aether OS is the intelligent brand operating system built for technical founders who refuse to compromise on design craft.',
    elevatorPitch:
      'Great software dies in silence when wrapped in generic branding. Aether OS turns raw code and product mechanics into a living, launch-ready brand system — from positioning and voice rules to visual briefs and launch copy — in hours instead of months.',
    landingPage: {
      announcementPill: 'Introducing Aether OS v1.0 • Private Founder Beta',
      headline: 'The Operating System for Sovereign Brands',
      subheadline:
        'Transform raw product concepts into defensible positioning, uncompromising visual briefs, and launch-grade narratives with computational rigor.',
      primaryCta: 'Initialize Brand Workspace',
      secondaryCta: 'Explore Architecture Spec',
      valuePillars: [
        {
          title: 'Architectural Grounding',
          badge: 'Strategy',
          description: 'No generic brainstorms. Nexus generates and stress-tests 3 divergent strategic positions with clear trade-offs.',
          proofPoint: 'Every decision backed by competitive moats and anti-cliché audits.',
        },
        {
          title: 'Systemic Voice & Rules',
          badge: 'Identity',
          description: 'Define your exact vocabulary, tone boundaries, and taboo terms so your team never ships embarrassing hype.',
          proofPoint: 'Deterministic dos & don’ts for every launch channel.',
        },
        {
          title: 'Consistency Guardian',
          badge: 'Integrity',
          description: 'Automated audits check every artifact against your core thesis before a single pixel goes live.',
          proofPoint: '100-point coherence verification across design and copy.',
        },
      ],
    },
    socialLaunch: {
      xTwitterThread: [
        '1/ Most AI branding tools generate forgettable pastel garbage that insults your intelligence.\n\nWe spent 6 months building something different.\n\nIntroducing @AetherOS: The operating system for sovereign software brands. 🧵👇',
        '2/ When you’re building deep technology, traditional branding agencies are too slow (months, $50k), and ChatGPT gives you "revolutionary synergy".\n\nAether OS gives founders a multi-stage cognitive pipeline: Discover ➔ Position ➔ Challenge ➔ Shape ➔ Visualize ➔ Guardian.',
        '3/ We don’t ask for one prompt and pray. We stress-test your assumptions, audit for clichés, and forge a living brand system that your engineers and designers will actually respect.',
        '4/ Today we’re opening private beta access to 100 lighthouse product builders.\n\nReserve your workspace now: https://aetheros.dev',
      ],
      linkedInPost:
        'Software founders often spend 80 hours a week perfecting their distributed systems, only to wrap the launch in a generic landing page template.\n\nToday, we are announcing Aether OS.\n\nAether OS is an intelligent brand operating system designed specifically for technical teams. It brings architectural discipline to brand building — synthesizing strategic positioning, brand voice rules, and visual briefs directly from your product truth.\n\nThank you to our early design partners. Request beta access at https://aetheros.dev',
      productHuntCard: {
        name: 'Aether OS',
        tagline: 'The brand intelligence operating system for technical founders',
        firstComment:
          'Hey Product Hunt! 👋 We built Aether OS because we were sick of seeing brilliant software launched with generic, robotic marketing copy. Aether OS treats brand building like systems architecture. We would love your feedback on our multi-stage workflow!',
      },
    },
    pressSnippet:
      'SAN FRANCISCO — Nexus Labs today announced Aether OS, a pioneering brand intelligence platform engineered for modern software builders. Designed to eliminate the disconnect between technical rigor and brand storytelling, Aether OS provides an end-to-end cognitive architecture for turning early-stage products into iconic market leaders.',
    launchChecklist: [
      { item: 'Verify DNS and custom domain SSL certificates', done: true, category: 'Infrastructure' },
      { item: 'Review Consistency Guardian audit scores (Target > 90)', done: true, category: 'Brand QA' },
      { item: 'Sync color tokens and typography to Tailwind CSS theme', done: true, category: 'Design System' },
      { item: 'Schedule X launch thread and founder personal notes', done: true, category: 'Distribution' },
      { item: 'Prepare Product Hunt launch assets and first comment', done: true, category: 'Distribution' },
    ],
  },
};

export const INITIAL_EMPTY_PROJECT: BrandProject = {
  id: 'proj_new_brand',
  name: 'Untitled Brand System',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStage: 'discover',
  stageStatus: {
    discover: 'idle',
    position: 'idle',
    challenge: 'idle',
    shape: 'idle',
    visualize: 'idle',
    consistency: 'idle',
    launch: 'idle',
  },
  idea: {
    title: '',
    rawConcept: '',
    targetMarketNotes: '',
    founderContext: '',
  },
};
