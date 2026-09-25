# NEXUS — Hackathon Requirements & Alignment Matrix

This document maps the official Hackathon Participant Handbook specifications to the NEXUS product architecture, judging criteria, and submission deliverables.

---

## 1. Challenge Definition & Objective

- **Core Challenge:** Build an AI-powered product that transforms a rough startup, product, creator, or community idea into a structured, cohesive, and launch-ready brand system.
- **Key Capabilities Required:**
  - **Audience Understanding:** Granular persona identification, pain points, urgency drivers, and emotional desires.
  - **Problem Deconstruction:** Core friction points, incumbent market failures, and current workarounds.
  - **Strategic Value Proposition:** Sharp category definition, defensible competitive moats, and trade-offs.
  - **Brand Personality & Voice:** Archetype definition, tonal attributes, anti-patterns (what to never sound like), and vocabulary rules.
  - **Naming System:** Linguistic territories, candidate ideation, rationale, and fit scoring.
  - **Visual Design Brief:** Design philosophy, color palettes, typography pairings, layout geometry, and logo motifs.
  - **Go-To-Market / Market Entry:** High-impact landing page copy, elevator pitches, and multi-channel launch campaigns.
  - **Consistency & Quality Checking:** Cross-system auditing to prevent strategic drift, clichés, or contradictions.

---

## 2. Avoiding the "One-Prompt Trap"

A primary directive of the hackathon is to strictly avoid building a "single prompt → single LLM response" application.

### Handbook Suggested Stages vs. NEXUS Cognitive Pipeline

| Handbook Stage | NEXUS Implementation | Role in Workflow |
|---|---|---|
| **1. Discover** | **1. Discover** *(Real Gemini)* | Deconstructs rough input into structured audience & problem intelligence. |
| **2. Position** | **2. Position** *(Real Gemini)* | Engineers 3 divergent strategic market vectors with explicit trade-offs. |
| — | **3. Challenge & Select** *(Mock → Gemini)* | Adversarial stress-test exposing clichés and weak assumptions, followed by **human strategic selection**. |
| **3. Shape** | **4. Shape** *(Real Gemini)* | Develops personality, voice boundaries, naming territories, and name candidate selection. |
| **4. Visualize** | **5. Visualize** *(Mock → Gemini)* | Translates shaped brand identity into an executive visual design brief. |
| **5. Challenge** | **6. Consistency Guardian** *(Mock → Gemini)* | System-wide audit evaluating alignment across all stages to score brand integrity. |
| **6. Deliver** | **7. Launch Kit** *(Mock → Gemini)* | Generates production-ready copy, social launch decks, checklists, and exportable brand JSON. |

---

## 3. Core Hackathon Expectations

1. **Working Product:** Fully interactive web application capable of running live brand synthesis flows.
2. **Actual AI Workflow:** Tangible pipeline where stages perform distinct cognitive tasks rather than generic text generation.
3. **Information Passing Between Stages:** Cumulative context accumulation where downstream stages inherit upstream data.
4. **Visible AI Decisions:** Explainable AI outputs (e.g., strategic divergence thesis, trade-off rationale, stress-test critiques).
5. **Checks & Evaluation:** Dedicated evaluation mechanisms (Adversarial Challenge & Consistency Guardian scoring).
6. **Human-in-the-Loop Review:** Strategic anchor points where the human creator directs the pathway (selecting positioning direction and brand name).
7. **Launch-Ready Outputs:** Usable, tangible communication assets rather than abstract theory.
8. **Exportable / Shareable System:** Complete brand system exportable to structured JSON or portable kit.

---

## 4. Recommended Technical Techniques & NEXUS Alignment

| Technique | NEXUS Architecture Alignment | Status |
|---|---|---|
| **Structured JSON** | Gemini `responseSchema` with `@google/genai` strict Type constraints + validator sanitization | Active (Stages 1 & 2) |
| **Prompt Chains** | Multi-step pipeline passing structured artifacts forward sequentially | Active (Architecture) |
| **Agent Roles / Debate** | Strategic divergence in Position; Adversarial critic in Challenge; Integrity auditor in Guardian | Designed / Active |
| **Scoring & Evaluation** | Numerical defensibility scores (Challenge) & component alignment scores (Guardian) | Active in types/mock |
| **Human Review / Selection** | Direction selector (Stage 3) and Name candidate selector (Stage 4) anchoring state | Active in UI & Context |
| **Multimodal Approaches** | Future expansion for visual generation / color rendering | Architectural roadmap |

---

## 5. Official Judging Categories & Weighting

| Evaluation Criterion | Weight | NEXUS Strategy & Highlights |
|---|---|---|
| **Prompt Engineering & AI Workflow** | **25%** | Deep structured system prompts; strict schema enforcement; multi-stage chaining with context passing; adversarial critique and system-wide consistency auditing. |
| **Originality** | **20%** | Moves beyond generic AI naming/slogan generators to build a rigorous brand intelligence engine that forces real strategic divergence and painful trade-offs. |
| **Working Implementation** | **20%** | Live Next.js 15 application; zero-build-error TypeScript codebase; responsive mobile/desktop UI; real server-side Gemini endpoints; safe error/retry states. |
| **Problem-Solving & Usefulness** | **15%** | Solves the hardest problem for early-stage founders: translating fragmented ideas into a defensible brand strategy and GTM collateral without agency fees. |
| **UI / UX** | **10%** | Premium cyber-intelligence aesthetic; seamless light/dark mode; responsive mobile drawer navigation; interactive stage cards; visual scorecards. |
| **Demo & Explanation** | **10%** | Clear cognitive progression walkthrough showing a real founder concept synthesized from rough idea to launch kit in minutes. |

---

## 6. Official Submission Requirements Checklist

- [ ] **Public / Judge-Accessible GitHub Repository:**
  - Clean repository with clear commit history.
  - Well-documented setup instructions.
  - `.env.example` provided (with all local secrets ignored).
- [ ] **Live Deployed Product:**
  - Fast, accessible production deployment (Vercel / Cloudflare).
  - Configured with live Gemini API keys for seamless judge evaluation.
- [ ] **Demo Video:**
  - 3–5 minute high-fidelity walkthrough of the complete end-to-end cognitive workflow.
  - Highlighting real AI synthesis, human selection checkpoints, and final launch outputs.
- [ ] **Social Posts & Public Links:**
  - Project announcement post on X/Twitter and LinkedIn tagging the hackathon organizers.
- [ ] **Individual Contribution & Role Information:**
  - Clear attribution of team member roles and contributions.
- [ ] **Inkloom Portal Compliance:**
  - Final project submission submitted through the official Inkloom hackathon portal before the deadline.
