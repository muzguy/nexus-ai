'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BrandProject,
  WorkflowStage,
  InitialIdea,
  PositioningDirection,
  DiscoveryData,
  PositioningData,
  ShapeData,
  VisualDirection,
  ConsistencyReport,
  LaunchKit,
  WORKFLOW_STAGES,
} from '@/types';
import { SAMPLE_PROJECT, INITIAL_EMPTY_PROJECT } from '@/lib/sample-project';
import { aiServices } from '@/services/ai';

interface BrandProjectContextValue {
  project: BrandProject;
  activeStage: WorkflowStage;
  setActiveStage: (stage: WorkflowStage) => void;
  isExecutingStage: boolean;
  executionProgress: string;
  error: string | null;
  clearError: () => void;

  // Actions
  updateIdea: (fields: Partial<InitialIdea>) => void;
  selectPositioningDirection: (direction: PositioningDirection) => void;
  selectNameCandidate: (candidateId: string) => void;
  runCurrentStageAction: () => Promise<void>;
  resetToEmptyProject: () => void;
  loadSampleProject: () => void;
  canAdvanceToStage: (stage: WorkflowStage) => boolean;
  goToNextStage: () => void;
  goToPreviousStage: () => void;
}

const BrandProjectContext = createContext<BrandProjectContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'nexus_brand_project_v1';

export function BrandProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<BrandProject>(() => {
    // Start with the sample project by default so the user immediately gets a rich, responsive experience,
    // or can click "New Project" to start blank!
    return SAMPLE_PROJECT;
  });

  const [activeStage, setActiveStage] = useState<WorkflowStage>('discover');
  const [isExecutingStage, setIsExecutingStage] = useState<boolean>(false);
  const [executionProgress, setExecutionProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          setProject(parsed);
          if (parsed.currentStage) {
            setActiveStage(parsed.currentStage);
          }
        }
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(project));
    } catch {
      // ignore
    }
  }, [project]);

  const updateIdea = useCallback((fields: Partial<InitialIdea>) => {
    setProject((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      idea: {
        ...prev.idea,
        ...fields,
      },
    }));
  }, []);

  const selectPositioningDirection = useCallback((direction: PositioningDirection) => {
    setProject((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      selectedDirection: direction,
      stageStatus: {
        ...prev.stageStatus,
        challenge: 'completed',
      },
    }));
  }, []);

  const selectNameCandidate = useCallback((candidateId: string) => {
    setProject((prev) => {
      const namingSystem = prev.naming || prev.shapeData?.naming;
      if (!namingSystem) return prev;

      let candidateName = prev.name;
      for (const t of namingSystem.territories || []) {
        const found = t.candidates?.find((c) => c.id === candidateId);
        if (found) {
          candidateName = found.name;
          break;
        }
      }

      const updatedNaming = {
        ...namingSystem,
        selectedCandidateId: candidateId,
      };

      return {
        ...prev,
        name: candidateName,
        selectedName: candidateName,
        updatedAt: new Date().toISOString(),
        naming: updatedNaming,
        shapeData: prev.shapeData
          ? {
              ...prev.shapeData,
              naming: updatedNaming,
            }
          : undefined,
      };
    });
  }, []);

  const resetToEmptyProject = useCallback(() => {
    setProject(INITIAL_EMPTY_PROJECT);
    setActiveStage('discover');
    setError(null);
  }, []);

  const loadSampleProject = useCallback(() => {
    setProject(SAMPLE_PROJECT);
    setActiveStage('discover');
    setError(null);
  }, []);

  const canAdvanceToStage = useCallback(
    (stage: WorkflowStage): boolean => {
      const stageIdx = WORKFLOW_STAGES.findIndex((s) => s.id === stage);
      if (stageIdx <= 0) return true;

      // Check if previous stage is completed
      const prevStage = WORKFLOW_STAGES[stageIdx - 1];
      return project.stageStatus[prevStage.id] === 'completed';
    },
    [project.stageStatus]
  );

  const goToNextStage = useCallback(() => {
    const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === activeStage);
    if (currentIndex < WORKFLOW_STAGES.length - 1) {
      setActiveStage(WORKFLOW_STAGES[currentIndex + 1].id);
    }
  }, [activeStage]);

  const goToPreviousStage = useCallback(() => {
    const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === activeStage);
    if (currentIndex > 0) {
      setActiveStage(WORKFLOW_STAGES[currentIndex - 1].id);
    }
  }, [activeStage]);

  // Orchestrate the execution of the active stage using the AI service container
  const runCurrentStageAction = useCallback(async () => {
    setIsExecutingStage(true);
    setError(null);
    setExecutionProgress('Initializing AI workflow agent...');

    try {
      switch (activeStage) {
        case 'discover': {
          const title = project.idea.title?.trim();
          const rawConcept = project.idea.rawConcept?.trim();

          if (!title || !rawConcept) {
            throw new Error(
              'Please provide both a Product / Concept Name and a Raw Concept & Value Proposition before synthesizing discovery intelligence.'
            );
          }

          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, discover: 'in_progress' },
          }));

          const discovery = await aiServices.discovery.analyzeIdea(project.idea, {
            onProgress: (p) => setExecutionProgress(p),
          });

          setProject((prev) => ({
            ...prev,
            discovery,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, discover: 'completed' },
          }));
          break;
        }

        case 'position': {
          if (!project.discovery) {
            throw new Error('Please complete the Discovery stage before positioning.');
          }

          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, position: 'in_progress' },
          }));

          const positioning = await aiServices.positioning.generateDirections(
            project.idea,
            project.discovery,
            { onProgress: (p) => setExecutionProgress(p) }
          );

          setProject((prev) => ({
            ...prev,
            positioning,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, position: 'completed' },
          }));
          break;
        }

        case 'challenge': {
          if (!project.positioning || !project.discovery) {
            throw new Error('Positioning directions required before running challenge evaluation.');
          }

          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, challenge: 'in_progress' },
          }));

          const challenged = await aiServices.challenge.stressTestDirections(
            project.positioning.directions,
            project.discovery,
            { onProgress: (p) => setExecutionProgress(p) }
          );

          setProject((prev) => ({
            ...prev,
            positioning: prev.positioning
              ? { ...prev.positioning, directions: challenged }
              : undefined,
            updatedAt: new Date().toISOString(),
            stageStatus: {
              ...prev.stageStatus,
              challenge: prev.selectedDirection ? 'completed' : 'needs_review',
            },
          }));
          break;
        }

        case 'shape': {
          if (!project.selectedDirection || !project.discovery) {
            throw new Error('Please select a strategic direction before shaping the brand identity.');
          }

          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, shape: 'in_progress' },
          }));

          const shape = await aiServices.shape.shapeBrandIdentity(
            project.selectedDirection,
            project.discovery,
            { onProgress: (p) => setExecutionProgress(p) },
            {
              idea: project.idea,
              positioning: project.positioning,
            }
          );

          // Find candidate name for initial selection
          const defaultCandidateId =
            shape.naming.selectedCandidateId ||
            shape.naming.territories[0]?.candidates[0]?.id;
          let candidateName = project.name;
          if (defaultCandidateId) {
            for (const t of shape.naming.territories) {
              const c = t.candidates?.find((x) => x.id === defaultCandidateId);
              if (c) {
                candidateName = c.name;
                break;
              }
            }
          }

          const updatedNaming = {
            ...shape.naming,
            selectedCandidateId: defaultCandidateId,
          };

          setProject((prev) => ({
            ...prev,
            name: candidateName,
            selectedName: candidateName,
            shapeData: {
              ...shape,
              naming: updatedNaming,
            },
            personality: shape.personality,
            naming: updatedNaming,
            voice: shape.voice,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, shape: 'completed' },
          }));
          break;
        }

        case 'visualize': {
          if (!project.selectedDirection || !project.shapeData) {
            throw new Error('Brand identity shape required before generating visual brief.');
          }

          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, visualize: 'in_progress' },
          }));

          const visual = await aiServices.visual.synthesizeVisualBrief(
            project.selectedDirection,
            project.shapeData,
            { onProgress: (p) => setExecutionProgress(p) }
          );

          setProject((prev) => ({
            ...prev,
            visualDirection: visual,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, visualize: 'completed' },
          }));
          break;
        }

        case 'consistency': {
          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, consistency: 'in_progress' },
          }));

          const report = await aiServices.consistency.auditBrandSystem(project, {
            onProgress: (p) => setExecutionProgress(p),
          });

          setProject((prev) => ({
            ...prev,
            consistency: report,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, consistency: 'completed' },
          }));
          break;
        }

        case 'launch': {
          setProject((prev) => ({
            ...prev,
            stageStatus: { ...prev.stageStatus, launch: 'in_progress' },
          }));

          const kit = await aiServices.launch.generateLaunchKit(project, {
            onProgress: (p) => setExecutionProgress(p),
          });

          setProject((prev) => ({
            ...prev,
            launchKit: kit,
            updatedAt: new Date().toISOString(),
            stageStatus: { ...prev.stageStatus, launch: 'completed' },
          }));
          break;
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during stage execution.';
      setError(message);
      // Reset in_progress status so the workflow does not get stuck
      setProject((prev) => {
        if (prev.stageStatus[activeStage] === 'in_progress') {
          const hasExistingArtifact =
            activeStage === 'discover'
              ? Boolean(prev.discovery)
              : activeStage === 'position'
              ? Boolean(prev.positioning)
              : activeStage === 'shape'
              ? Boolean(prev.shapeData)
              : false;
          return {
            ...prev,
            stageStatus: {
              ...prev.stageStatus,
              [activeStage]: hasExistingArtifact ? 'completed' : 'idle',
            },
          };
        }
        return prev;
      });
    } finally {
      setIsExecutingStage(false);
      setExecutionProgress('');
    }
  }, [activeStage, project]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <BrandProjectContext.Provider
      value={{
        project,
        activeStage,
        setActiveStage,
        isExecutingStage,
        executionProgress,
        error,
        clearError,
        updateIdea,
        selectPositioningDirection,
        selectNameCandidate,
        runCurrentStageAction,
        resetToEmptyProject,
        loadSampleProject,
        canAdvanceToStage,
        goToNextStage,
        goToPreviousStage,
      }}
    >
      {children}
    </BrandProjectContext.Provider>
  );
}

export function useBrandProject() {
  const context = useContext(BrandProjectContext);
  if (!context) {
    throw new Error('useBrandProject must be used within a BrandProjectProvider');
  }
  return context;
}
