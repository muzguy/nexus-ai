import { WorkflowStage, StageStatus } from './stages';
import { InitialIdea, DiscoveryData } from './discovery';
import { PositioningData, PositioningDirection } from './positioning';
import { BrandPersonality, NamingSystem, BrandVoice, ShapeData } from './shape';
import { VisualDirection } from './visual';
import { ConsistencyReport } from './consistency';
import { LaunchKit } from './launch';

export interface BrandProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStage: WorkflowStage;
  stageStatus: Record<WorkflowStage, StageStatus>;

  // Stage 1: Discover
  idea: InitialIdea;
  discovery?: DiscoveryData;

  // Stage 2: Position
  positioning?: PositioningData;

  // Stage 3 & 4: Challenge & Human Selection
  selectedDirection?: PositioningDirection;

  // Stage 5: Shape (Split for granular access + unified shapeData)
  personality?: BrandPersonality;
  naming?: NamingSystem;
  voice?: BrandVoice;
  shapeData?: ShapeData;

  // Stage 6: Visualize
  visualDirection?: VisualDirection;

  // Stage 7: Consistency Guardian
  consistency?: ConsistencyReport;

  // Stage 8: Launch Kit
  launchKit?: LaunchKit;
}

export type ProjectAction =
  | { type: 'SET_STAGE'; stage: WorkflowStage }
  | { type: 'UPDATE_IDEA'; idea: Partial<InitialIdea> }
  | { type: 'SET_DISCOVERY'; data: DiscoveryData }
  | { type: 'SET_POSITIONING'; data: PositioningData }
  | { type: 'SELECT_DIRECTION'; direction: PositioningDirection }
  | { type: 'SET_SHAPE_DATA'; data: ShapeData }
  | { type: 'SET_SELECTED_NAME'; candidateId: string }
  | { type: 'SET_VISUAL_DIRECTION'; data: VisualDirection }
  | { type: 'SET_CONSISTENCY_REPORT'; report: ConsistencyReport }
  | { type: 'SET_LAUNCH_KIT'; kit: LaunchKit }
  | { type: 'SET_STAGE_STATUS'; stage: WorkflowStage; status: StageStatus }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_PROJECT'; project: BrandProject };
