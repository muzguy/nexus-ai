# NEXUS — System Architecture & Cognitive Pipeline

This document defines the complete technical architecture, cognitive pipeline, data flows, and active codebase organization of NEXUS.

---

## 1. Conceptual Cognitive Pipeline

NEXUS transforms a rough initial concept into a launch-ready brand system via a staged cognitive workflow with embedded human strategic checkpoints.

```
                    ┌────────────────────────┐
                    │      ROUGH IDEA        │
                    │ (Name, Concept, Goals) │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │      1. DISCOVER       │ [REAL GEMINI]
                    │ Deconstruct Idea & Mkt │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │      2. POSITION       │ [REAL GEMINI]
                    │  3 Divergent Vectors   │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │      3. CHALLENGE      │ [MOCK -> AI MIGRATION]
                    │  Adversarial Critique  │
                    └───────────┬────────────┘
                                │
                                ▼
             ┌──────────────────────────────────────┐
             │   HUMAN STRATEGIC SELECTION (Anchor) │
             │     Choose 1 Winning Direction       │
             └──────────────────┬───────────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │        4. SHAPE        │ [REAL GEMINI]
                    │ Personality & Naming   │
                    └───────────┬────────────┘
                                │
                                ▼
             ┌──────────────────────────────────────┐
             │    HUMAN BRAND IDENTITY SELECTION    │
             │     Choose Verified Name / Anchor    │
             └──────────────────┬───────────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │      5. VISUALIZE      │ [MOCK -> AI MIGRATION]
                    │ Visual Design System   │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │ 6. CONSISTENCY GUARDIAN│ [MOCK -> AI MIGRATION]
                    │ Holistic Audit & Score │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │       7. LAUNCH        │ [MOCK -> AI MIGRATION]
                    │ GTM Campaign & Assets  │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │  COMPLETE BRAND SYSTEM │
                    │ (Exportable JSON / Kit)│
                    └────────────────────────┘
```

---

## 2. Stage-by-Stage Architectural Specifications

### Stage 1: DISCOVER
- **Purpose:** Deconstructs the raw product/founder idea into structured market, audience, and problem intelligence.
- **Inputs:**
  - `idea.title`: Product/concept working title
  - `idea.rawConcept`: Core value proposition & description
  - `idea.targetAudience`: Initial audience intuitions
  - `idea.problemSolved`: Intended problem solved
  - `idea.differentiators`: Perceived advantages
  - `idea.founderContext`: Founder domain context & philosophy
- **Outputs (`DiscoveryData`):**
  - `summary`: Executive synthesis narrative
  - `audience`: Primary & secondary personas, pain points, core desires, urgency driver
  - `problem`: Core problem, incumbent market failures, existing workarounds
  - `goals`: Immediate beachhead goal, long-term category vision, North Star metric
  - `constraints`: Non-negotiables, resource/budget limits
  - `openQuestions`: Strategic questions with validation status & working hypotheses
- **Implementation Status:** **REAL AI** via Google Gemini (`/api/ai/discover`, `ApiDiscoveryService`).

---

### Stage 2: POSITION
- **Purpose:** Synthesizes exactly 3 genuinely divergent, strategically defensible market positioning directions with explicit sacrifices.
- **Inputs:**
  - `InitialIdea`
  - `DiscoveryData` (from Stage 1)
- **Outputs (`PositioningData`):**
  - `rationale`: Strategic divergence thesis explaining the core tensions and trade-offs.
  - `directions` (Array of 3 `PositioningDirection` objects):
    - `id`: Vector identifier (`pos_dir_1`, `pos_dir_2`, `pos_dir_3`)
    - `name`: Evocative strategic moniker (e.g. *The Sovereign Architect*, *The Frictionless Catalyst*)
    - `archetype`: Core archetype pairing (e.g. *Creator / Sage*, *Outlaw / Rebel*)
    - `targetSegment`: Specific buyer psychology and focus
    - `taglineConcept`: Concept tagline
    - `valueProposition`: Clear, unambiguous transformation delivered
    - `competitiveMoat`: Defensible structural advantage
    - `keyDifferentiator`: Contrast against conventional incumbents
    - `strategicTradeoff`: Explicit sacrifice (what the brand deliberately rejects)
- **Implementation Status:** **REAL AI** via Google Gemini (`/api/ai/position`, `ApiPositioningService`).

---

### Stage 3: CHALLENGE & SELECTION
- **Purpose:** Subject all 3 positioning directions to an adversarial stress-test (identifying clichés, fragile assumptions, and audience mismatches) so the founder can make an informed strategic bet.
- **Inputs:**
  - `PositioningDirection[]`
  - `DiscoveryData`
- **Outputs (`PositioningDirection.critique`):**
  - `clicheWarning`: Overused category tropes detected
  - `weakAssumption`: Vulnerable premises underlying the direction
  - `differentiationScore`: Numerical defensibility score (0–100)
  - `failureMode`: Most probable market failure scenario
- **Human Strategic Selection:** The user selects ONE winning direction (`project.selectedDirection`), locking it as the strategic anchor for all subsequent stages.
- **Implementation Status:** **MOCK / SAMPLE** (`MockChallengeService`). *Scheduled for real Gemini migration.*

---

### Stage 4: SHAPE
- **Purpose:** Translates the selected strategic direction into a structured brand persona, naming system, and voice guidelines.
- **Inputs:**
  - `idea`: Original project concept
  - `discovery`: Discovery intelligence
  - `selectedDirection`: Human-selected positioning direction
- **Outputs (`ShapeData`):**
  - `tagline`: Primary brand tagline
  - `oneLinePitch`: High-impact one-line pitch
  - `personality`: Primary archetype, core attributes, tone of voice, traits to avoid (anti-patterns)
  - `naming`: Naming territories, name candidates (with linguistic rationale, domain availability potential, and fit score)
  - `voice`: Guiding voice principles, vocabulary dos and don'ts, example copy pairs
- **Human Interaction:** The user chooses a name candidate (`selectedCandidateId`), anchoring the final brand name.
- **Implementation Status:** **REAL AI** via Google Gemini (`/api/ai/shape`, `ApiShapeService`).

---

### Stage 5: VISUALIZE
- **Purpose:** Generates a comprehensive visual design brief translated directly from the shaped brand identity.
- **Inputs:**
  - `selectedDirection`: Strategy anchor
  - `shapeData`: Identity, personality, and selected name
- **Outputs (`VisualDirection`):**
  - `conceptThesis`: Architectural visual direction narrative
  - `colorPalette`: Primary, secondary, accent, neutral, and semantic colors (hex + semantic roles)
  - `typography`: Display/headline, body, and mono font pairings with styling rationale
  - `composition`: Spatial layout, grid density, whitespace rhythm
  - `shapes`: Border radii, geometric tendencies, elevation styling
  - `imagery`: Photography/render principles, art direction, lighting
  - `logoConcept`: Symbolic motif and lockup guidance
  - `visualDosAndDonts`: Clear guardrails for visual execution
- **Human Interaction:** Interactive selection of color variants, typography pairings, and layout modes.
- **Implementation Status:** **MOCK / SAMPLE** (`MockVisualService`). *Scheduled for real Gemini migration.*

---

### Stage 6: CONSISTENCY GUARDIAN
- **Purpose:** Holistic system integrity audit that reviews all generated artifacts across the entire pipeline to detect contradictions, cliché creep, and strategic drift.
- **Inputs:**
  - **ALL accumulated context** of the active `BrandProject` (`idea`, `discovery`, `selectedDirection`, `shapeData`, `visualDirection`).
  - **CRITICAL INVARIANT:** Must audit the **active user project**; must NEVER default to auditing Aether OS sample data.
- **Outputs (`ConsistencyReport`):**
  - `overallScore`: Comprehensive brand coherence score (0–100)
  - `dimensionScores`: Component scores for Positioning, Voice, Visuals, Naming, and Messaging
  - `findings`: Specific alignment observations categorized by severity (`critical`, `warning`, `optimal`)
  - `recommendations`: Actionable steps to tighten brand coherence
  - `strengths`: Verified high-defensibility traits
  - `vulnerabilities`: Identified risks of brand dilution
- **Implementation Status:** **MOCK / SAMPLE** (`MockConsistencyService`). *Scheduled for real Gemini migration.*

---

### Stage 7: LAUNCH KIT
- **Purpose:** Compiles the complete, audited brand system into production-ready go-to-market communication assets and exportable formats.
- **Inputs:**
  - Complete `BrandProject` state + `ConsistencyReport`
- **Outputs (`LaunchKit`):**
  - `heroSection`: Main headline, subheadline, primary & secondary CTAs
  - `pitches`: Elevator pitch, investor one-pager teaser, customer pitch
  - `socialLaunch`: X/Twitter launch thread (numbered tweets), LinkedIn launch post, Product Hunt maker comment & tagline
  - `pressRelease`: Formal launch announcement release
  - `launchChecklist`: Chronological GTM milestone tasks (pre-launch, launch day, post-launch)
  - `exportableBrandSystem`: Complete unified JSON data export
- **Implementation Status:** **MOCK / SAMPLE** (`MockLaunchService`). *Scheduled for real Gemini migration.*

---

## 3. Cumulative Data Flow & State Mechanics

NEXUS operates as a forward-accumulating state machine:

```
[InitialIdea]
     │
     ▼
[+ DiscoveryData]
     │
     ▼
[+ PositioningData (3 Vectors)]
     │
     ▼
[+ SelectedDirection (Human Anchor)]
     │
     ▼
[+ ShapeData (Personality, Naming Candidates, Voice)]
     │
     ▼
[+ Selected Name Candidate (Human Anchor)]
     │
     ▼
[+ VisualDirection (Palette, Fonts, Logo)]
     │
     ▼
[+ ConsistencyReport (Cross-System Integrity Audit)]
     │
     ▼
[+ LaunchKit (GTM Copy, Social Threads, Exportable Brand System)]
```

### Context Persistence
- Managed by `BrandProjectContext` in `src/context/brand-project-context.tsx`.
- Auto-persists to browser `localStorage` under the key `'nexus_brand_project_v1'`.
- Supports explicit "Reset Project" (clearing state to initial empty project) and "Load Sample Project" (populating completed Aether OS reference data).

---

## 4. Current Codebase Structure

```
nexus-pre-hackathon/
├── AGENTS.md                          # Operating rules for AI coding agents
├── NEXUS_ARCHITECTURE.md              # This architecture document
├── HACKATHON_REQUIREMENTS.md          # Hackathon rules, criteria & handbook mapping
├── .env.local                         # Local secrets (GEMINI_API_KEY, GEMINI_MODEL - git ignored)
├── .env.example                       # Template for environment configuration
├── package.json                       # Next.js 15.1, React 19, @google/genai 2.24, Tailwind 3.4
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout with ThemeProvider, fonts, metadata
│   │   ├── page.tsx                   # Main workstation page orchestrating sidebar & stages
│   │   ├── globals.css                # Tailwind directives & CSS custom properties
│   │   └── api/ai/                    # Server-side API endpoints
│   │       ├── discover/route.ts      # [REAL AI] Gemini Discovery analysis endpoint
│   │       ├── position/route.ts      # [REAL AI] Gemini Positioning directions endpoint
│   │       └── shape/route.ts         # [REAL AI] Gemini Shape identity endpoint
│   │
│   ├── types/                         # TypeScript interfaces
│   │   ├── index.ts                   # Unified type exports
│   │   ├── brand.ts                   # BrandProject entity & ProjectAction definitions
│   │   ├── stages.ts                  # WorkflowStage, StageStatus, StageConfig & WORKFLOW_STAGES
│   │   ├── discovery.ts               # InitialIdea, DiscoveryData, Audience, Problem, Goals, etc.
│   │   ├── positioning.ts             # PositioningDirection, PositioningData, DirectionCritique
│   │   ├── shape.ts                   # ShapeData, BrandPersonality, NamingSystem, BrandVoice
│   │   ├── visual.ts                  # VisualDirection, ColorPalette, Typography, LogoConcept
│   │   ├── consistency.ts             # ConsistencyReport, DimensionScore, Finding
│   │   └── launch.ts                  # LaunchKit, SocialPost, HeroSection, ChecklistItem
│   │
│   ├── services/ai/                   # AI service abstraction layer
│   │   ├── types.ts                   # IBrandAIServiceContainer & stage interfaces
│   │   ├── index.ts                   # Active service container exporting active implementations
│   │   ├── api-discovery-service.ts   # [REAL] Discovery client service calling /api/ai/discover
│   │   ├── api-positioning-service.ts # [REAL] Positioning client service calling /api/ai/position
│   │   ├── api-shape-service.ts       # [REAL] Shape client service calling /api/ai/shape
│   │   └── mock/
│   │       └── mock-services.ts       # [MOCK] Aether OS mock services for remaining stages
│   │
│   ├── lib/validation/                # Runtime schema validation
│   │   ├── discovery-validator.ts     # Validates and sanitizes DiscoveryData from Gemini
│   │   ├── positioning-validator.ts   # Validates and sanitizes PositioningData (3 vectors)
│   │   └── shape-validator.ts         # Validates and sanitizes ShapeData from Gemini
│   │
│   ├── context/
│   │   └── brand-project-context.tsx  # Central BrandProjectProvider & useBrandProject() hook
│   │
│   └── components/
│       ├── layout/                    # Shell and navigation components
│       │   ├── app-header.tsx         # Top bar with logo, project name, theme toggle
│       │   ├── workflow-sidebar.tsx   # Desktop 7-stage vertical progression rail
│       │   ├── mobile-workflow-nav.tsx# Mobile stage selector & bottom navigation
│       │   ├── stage-header.tsx       # Stage title, step badge, description, and status
│       │   └── theme-toggle.tsx       # Light / Dark mode toggle button
│       │
│       ├── stages/                    # Stage workspace views
│       │   ├── discover-stage.tsx     # Stage 1: Form inputs, synthesis triggers, results view
│       │   ├── position-stage.tsx     # Stage 2: 3-vector card grid, trade-offs, re-synthesis
│       │   ├── challenge-stage.tsx    # Stage 3: Critique breakdown, direction selection
│       │   ├── shape-stage.tsx        # Stage 4: Persona, naming candidates, voice rules
│       │   ├── visualize-stage.tsx    # Stage 5: Visual design brief & tokens
│       │   ├── consistency-stage.tsx  # Stage 6: Audit scorecards & vulnerability warnings
│       │   └── launch-stage.tsx       # Stage 7: GTM assets, copy decks, JSON export
│       │
│       └── ui/                        # Reusable component library
│           ├── alert-banner.tsx       # Standardized alert & error notifications
│           ├── badge.tsx              # Colored status and semantic badges
│           ├── button.tsx             # Button with loading spinner & variants
│           ├── card.tsx               # Card, CardHeader, CardContent, CardFooter
│           ├── empty-state.tsx        # Uninitialized stage prompts with action triggers
│           ├── input.tsx              # Form input primitive
│           └── textarea.tsx           # Form textarea primitive
```

---

## 5. Security & Secret Management Invariants

1. **Server Isolation:** `GEMINI_API_KEY` is loaded only in `src/app/api/ai/*/route.ts` via server-side `process.env`.
2. **Client Anonymity:** Client service adapters communicate with Next.js API routes over internal HTTP endpoints (`/api/ai/*`). No API keys or vendor endpoints exist in browser bundles.
3. **Repository Protection:** `.env.local` is strictly ignored in `.gitignore`. Only `.env.example` is committed.
4. **Sanitized Error Messaging:** API routes catch low-level Gemini errors and return user-safe descriptions (preventing leak of server configuration or raw stack traces).
