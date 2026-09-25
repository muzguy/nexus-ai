import { IBrandAIServiceContainer } from './types';
import { mockAIServices } from './mock/mock-services';
import { ApiDiscoveryService } from './api-discovery-service';
import { ApiPositioningService } from './api-positioning-service';
import { ApiShapeService } from './api-shape-service';

// Active AI service container.
// DISCOVER, POSITION, and SHAPE stages use real Google Gemini AI integration.
// Subsequent stages (challenge, visual, consistency, launch)
// remain on mock AI services until their respective integration phases.
export const aiServices: IBrandAIServiceContainer = {
  ...mockAIServices,
  discovery: new ApiDiscoveryService(),
  positioning: new ApiPositioningService(),
  shape: new ApiShapeService(),
};

export * from './types';
export * from './mock/mock-services';
export * from './api-discovery-service';
export * from './api-positioning-service';
export * from './api-shape-service';
