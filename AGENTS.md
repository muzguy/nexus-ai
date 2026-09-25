# NEXUS — AI Coding Agent Operating Manual (`AGENTS.md`)

This document defines the strict operating rules, architectural invariants, and development guidelines for any AI coding agent working on the NEXUS codebase.

---

## 1. Project Identity & Philosophy

- **What NEXUS Is:** An AI-powered, multi-stage brand intelligence platform that transforms raw startup, creator, product, or community ideas into cohesive, launch-ready brand systems.
- **Cognitive Pipeline Paradigm:** NEXUS is deliberately designed as a **multi-stage cognitive workflow**, NOT a single prompt-to-response generation.
- **Cumulative Intelligence:** Each stage builds directly upon structured outputs and human selections from prior stages. Reasoning is never restarted from scratch.

---

## 2. Core Development Rules

1. **Inspect Before Acting:** Always read and inspect existing files, types, and component hierarchies before making edits.
2. **Preserve Working Code:** Never refactor, rewrite, or delete existing working code or features unless explicitly requested.
3. **Strictly Scoped Tasks:** Work **only** on the stage or feature requested by the user. Do not introduce speculative refactorings or unrequested "enhancements."
4. **Preserve UI & Design Language:**
   - Maintain the established aesthetic (dark/light themes, custom Tailwind palette: `nexus-*`, `accent-cyan`, glowing borders, badges, cards, mono accents).
   - Maintain mobile responsiveness across standard viewport breakpoints (320px–430px).
   - Do not redesign screens or change layout structure unless explicitly instructed.
5. **Reuse Existing Abstractions:** Always reuse existing types (`src/types/`), UI primitives (`src/components/ui/`), context hooks (`useBrandProject()`), and service interfaces (`src/services/ai/types.ts`).
6. **No Silent Mock Fallbacks:** Never silently substitute mock data or Aether OS sample data when a real AI call fails. Errors must be surfaced visibly to the user with a retry path.
7. **Production Build Validation:** After any code change, run `npm run build` to verify zero TypeScript or Next.js build errors.
8. **Report Changes Transparently:** Explicitly report which files were modified/created, test results, and build status.

---

## 3. AI & Google Gemini Integration Rules

- **Primary Provider:** Google Gemini API using the official `@google/genai` SDK.
- **Server-Side Only:**
  - `GEMINI_API_KEY` must remain strictly server-side (inside Next.js API routes under `src/app/api/ai/`).
  - **NEVER** expose, log, print, or commit `GEMINI_API_KEY` or any portion of it.
  - Do not prefix keys with `NEXT_PUBLIC_`.
- **Model Configuration:**
  - Read `GEMINI_MODEL` from `process.env.GEMINI_MODEL` with fallback to `gemini-3.5-flash-lite`.
  - Do not hardcode experimental or retired model names.
- **Structured Output Required:**
  - Every Gemini request must configure `responseMimeType: 'application/json'` and supply a strict `responseSchema` (using `@google/genai` `Type` definitions).
- **Mandatory Validation:**
  - Always validate raw AI JSON through a dedicated validator in `src/lib/validation/` before writing to `BrandProject` context.
- **Error Handling & Retries:**
  - Handle transient HTTP 503 / `UNAVAILABLE` errors with exponential backoff (e.g., max 3 attempts).
  - Return standardized HTTP error responses (`{ success: false, error: string }`) mapped to human-readable error messages for authentication (401), rate limits (429), and service demand (503).

---

## 4. Mock vs. Sample vs. Real Data Rules

- **Aether OS:** The built-in reference project representing a completed brand system.
- **Aether OS Data Boundary:**
  - Sample data belongs **only** in the explicit "Load Sample" demo mode.
  - **NEVER** inject Aether OS data as fallback or default values into a user's active, customized brand project.
  - Downstream stages must operate strictly on the active project's own accumulated state (`project.idea`, `project.discovery`, `project.selectedDirection`, etc.).
- **Stage Implementation Status Table:**

| Stage | Step | Status | Provider / Implementation |
|---|---|---|---|
| **Discover** | 1 | **REAL AI** | Gemini (`/api/ai/discover` + `ApiDiscoveryService`) |
| **Position** | 2 | **REAL AI** | Gemini (`/api/ai/position` + `ApiPositioningService`) |
| **Challenge** | 3 | **MOCK** | `MockChallengeService` (Awaiting migration) |
| **Shape** | 4 | **REAL AI** | Gemini (`/api/ai/shape` + `ApiShapeService`) |
| **Visualize** | 5 | **REAL AI** | Gemini (`/api/ai/visualize` + `ApiVisualizeService`) |
| **Consistency** | 6 | **REAL AI** | Gemini (`/api/ai/guardian` + `ApiGuardianService`) |
| **Launch** | 7 | **REAL AI** | Gemini (`/api/ai/launch` + `ApiLaunchService`) |

> **Rule:** Never claim a stage is "AI-powered" unless it actively executes a server-side Gemini call and writes validated output to `BrandProject`.

---

## 5. Architectural Pattern for Migrating Mock Stages to Real AI

When instructed to migrate a remaining mock stage to real Gemini, follow this exact unidirectional pipeline:

```
UI Component (e.g. StageWorkspace)
  ↓ triggers runCurrentStageAction()
Client AI Service Adapter (src/services/ai/api-*.ts)
  ↓ fetch POST with AbortSignal & progress hooks
Next.js Server API Route (src/app/api/ai/*/route.ts)
  ↓ reads server-side process.env.GEMINI_API_KEY
Google Gemini API (@google/genai generateContent with responseSchema)
  ↓ structured JSON response
Validation & Sanitization (src/lib/validation/*-validator.ts)
  ↓ verified typed payload
BrandProject Context (src/context/brand-project-context.tsx)
  ↓ updates project state & sets stageStatus: 'completed'
UI Re-renders with Real Intelligence
```

### Invariants:
1. Client components **never** talk to Gemini directly.
2. The AI service interface (`src/services/ai/types.ts`) must not be bypassed.
3. Validators must reject malformed data, throwing descriptive errors rather than corrupting state.
4. If synthesis fails, `stageStatus` must revert to `'idle'` (or remain at its previous valid state) and surface the error banner with a working **Retry** button.

---

## 6. Verification & Testing Protocol

Before marking any AI integration task complete:
1. **API Integration Test:** Execute a test against the API route using realistic project inputs (e.g., via a scratch Node script). Verify HTTP 200 and schema validity.
2. **Edge Case Test:** Test missing inputs or invalid JSON to ensure HTTP 400 with descriptive error messages.
3. **Build Check:** Run `npm run build` and ensure exit code 0.
4. **Git Hygiene:** Verify `.env.local` remains untracked in `.gitignore`.
