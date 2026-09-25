import { IBrandAIServiceContainer } from './types';
import { mockAIServices } from './mock/mock-services';
import { ApiDiscoveryService } from './api-discovery-service';
import { ApiPositioningService } from './api-positioning-service';
import { ApiShapeService } from './api-shape-service';
import { ApiVisualizeService } from './api-visualize-service';

// Active AI service container.
// DISCOVER, POSITION, SHAPE, and VISUALIZE stages use real Google Gemini AI integration.
// Subsequent stages (challenge, consistency, launch)
// remain on mock AI services until their respective integration phases.
export const aiServices: IBrandAIServiceContainer = {
  ...mockAIServices,
  discovery: new ApiDiscoveryService(),
  positioning: new ApiPositioningService(),
  shape: new ApiShapeService(),
  visual: new ApiVisualizeService(),
};

export * from './types';
export * from './mock/mock-services';
export * from './api-discovery-service';
export * from './api-positioning-service';
export * from './api-shape-service';
export * from './api-visualize-service';
