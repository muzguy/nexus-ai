import { IBrandAIServiceContainer } from './types';
import { mockAIServices } from './mock/mock-services';

// Current active AI service container.
// When integrating real LLMs (Gemini, Claude, OpenAI), create a real implementation
// of IBrandAIServiceContainer and swap or inject it here via environment flags.
export const aiServices: IBrandAIServiceContainer = mockAIServices;

export * from './types';
export * from './mock/mock-services';
