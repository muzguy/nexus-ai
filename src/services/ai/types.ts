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

export interface AIExecutionOptions {
  signal?: AbortSignal;
  onProgress?: (step: string) => void;
  temperature?: number;
}

export interface IDiscoveryService {
  analyzeIdea(idea: InitialIdea, options?: AIExecutionOptions): Promise<DiscoveryData>;
}

export interface IPositioningService {
  generateDirections(
    idea: InitialIdea,
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<PositioningData>;
}

export interface IChallengeService {
  stressTestDirections(
    directions: PositioningDirection[],
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<PositioningDirection[]>;
}

export interface IShapeService {
  shapeBrandIdentity(
    selectedDirection: PositioningDirection,
    discovery: DiscoveryData,
    options?: AIExecutionOptions,
    context?: {
      idea?: InitialIdea;
      positioning?: PositioningData;
    }
  ): Promise<ShapeData>;
}

export interface IVisualService {
  synthesizeVisualBrief(
    selectedDirection: PositioningDirection,
    shape: ShapeData,
    options?: AIExecutionOptions
  ): Promise<VisualDirection>;
}

export interface IConsistencyService {
  auditBrandSystem(
    project: BrandProject,
    options?: AIExecutionOptions
  ): Promise<ConsistencyReport>;
}

export interface ILaunchService {
  generateLaunchKit(
    project: BrandProject,
    options?: AIExecutionOptions
  ): Promise<LaunchKit>;
}

export interface IBrandAIServiceContainer {
  discovery: IDiscoveryService;
  positioning: IPositioningService;
  challenge: IChallengeService;
  shape: IShapeService;
  visual: IVisualService;
  consistency: IConsistencyService;
  launch: ILaunchService;
}
