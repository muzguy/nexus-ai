export type WorkflowStage =
  | 'discover'
  | 'position'
  | 'challenge'
  | 'shape'
  | 'visualize'
  | 'consistency'
  | 'launch';

export type StageStatus = 'idle' | 'in_progress' | 'completed' | 'needs_review' | 'blocked';

export interface StageConfig {
  id: WorkflowStage;
  stepNumber: number;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  requiredStage?: WorkflowStage;
}

export const WORKFLOW_STAGES: StageConfig[] = [
  {
    id: 'discover',
    stepNumber: 1,
    label: '1. Discover',
    shortLabel: 'Discover',
    tagline: 'Foundational Intelligence',
    description: 'Deconstruct your idea, target audience, critical problem, goals, constraints, and open questions.',
  },
  {
    id: 'position',
    stepNumber: 2,
    label: '2. Position',
    shortLabel: 'Position',
    tagline: 'Strategic Divergence',
    description: 'Synthesize 3 distinct, defensible market positioning directions with clear strategic trade-offs.',
    requiredStage: 'discover',
  },
  {
    id: 'challenge',
    stepNumber: 3,
    label: '3. Challenge & Select',
    shortLabel: 'Challenge',
    tagline: 'Adversarial Stress-Test',
    description: 'Stress-test directions for clichés, audience mismatch, and weak assumptions, then select your winning path.',
    requiredStage: 'position',
  },
  {
    id: 'shape',
    stepNumber: 4,
    label: '4. Shape',
    shortLabel: 'Shape',
    tagline: 'Brand Identity & Persona',
    description: 'Forge brand personality, naming territories, candidates, taglines, and distinct brand voice.',
    requiredStage: 'challenge',
  },
  {
    id: 'visualize',
    stepNumber: 5,
    label: '5. Visualize',
    shortLabel: 'Visualize',
    tagline: 'Visual Design Brief',
    description: 'Generate an executive visual brief covering typography, color palettes, geometry, and imagery principles.',
    requiredStage: 'shape',
  },
  {
    id: 'consistency',
    stepNumber: 6,
    label: '6. Consistency Guardian',
    shortLabel: 'Guardian',
    tagline: 'System Alignment Audit',
    description: 'Run automated integrity checks verifying that all brand artifacts remain tightly aligned with strategy.',
    requiredStage: 'visualize',
  },
  {
    id: 'launch',
    stepNumber: 7,
    label: '7. Launch Kit',
    shortLabel: 'Launch',
    tagline: 'Go-To-Market Assets',
    description: 'Assemble launch-ready landing page copy, one-line pitch, and multichannel social launch campaigns.',
    requiredStage: 'consistency',
  },
];
