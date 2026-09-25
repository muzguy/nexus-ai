import { IBrandAIServiceContainer } from './types';
import { mockAIServices } from './mock/mock-services';
import { ApiDiscoveryService } from './api-discovery-service';
import { ApiPositioningService } from './api-positioning-service';

// Active AI service container.
// DISCOVER and POSITION stages use real Google Gemini AI integration.
// Subsequent stages (challenge, shape, visual, consistency, launch)
// remain on mock AI services until their respective integration phases.
export const aiServices: IBrandAIServiceContainer = {
  ...mockAIServices,
  discovery: new ApiDiscoveryService(),
  positioning: new ApiPositioningService(),
};

export * from './types';
export * from './mock/mock-services';
export * from './api-discovery-service';
export * from './api-positioning-service';
