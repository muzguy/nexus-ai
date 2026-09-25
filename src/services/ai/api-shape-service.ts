import {
  InitialIdea,
  DiscoveryData,
  PositioningData,
  PositioningDirection,
  ShapeData,
} from '@/types';
import { IShapeService, AIExecutionOptions } from './types';

export class ApiShapeService implements IShapeService {
  async shapeBrandIdentity(
    selectedDirection: PositioningDirection,
    discovery: DiscoveryData,
    options?: AIExecutionOptions,
    context?: {
      idea?: InitialIdea;
      positioning?: PositioningData;
    }
  ): Promise<ShapeData> {
    options?.onProgress?.('Formulating brand personality archetypes and behavioral boundaries...');

    let response: Response;
    try {
      response = await fetch('/api/ai/shape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: context?.idea,
          discovery,
          positioning: context?.positioning,
          selectedDirection,
        }),
        signal: options?.signal,
      });
    } catch (networkErr: any) {
      if (networkErr?.name === 'AbortError') {
        throw new Error('Brand identity shaping was cancelled.');
      }
      throw new Error(
        'Network error: Unable to reach the server. Please check your connection and retry.'
      );
    }

    options?.onProgress?.('Synthesizing naming territories, linguistic roots, and voice rules...');

    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Brand identity shaping failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    return result.data as ShapeData;
  }
}
