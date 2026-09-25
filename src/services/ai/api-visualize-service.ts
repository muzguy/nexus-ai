import {
  InitialIdea,
  DiscoveryData,
  PositioningData,
  PositioningDirection,
  ShapeData,
  VisualDirection,
} from '@/types';
import { IVisualService, AIExecutionOptions } from './types';

export class ApiVisualizeService implements IVisualService {
  async synthesizeVisualBrief(
    selectedDirection: PositioningDirection,
    shape: ShapeData,
    options?: AIExecutionOptions,
    context?: {
      idea?: InitialIdea;
      discovery?: DiscoveryData;
      positioning?: PositioningData;
      selectedName?: string;
    }
  ): Promise<VisualDirection> {
    options?.onProgress?.('Synthesizing aesthetic thesis and color mood architecture...');

    let response: Response;
    try {
      response = await fetch('/api/ai/visualize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: context?.idea,
          discovery: context?.discovery,
          positioning: context?.positioning,
          selectedDirection,
          shape,
          selectedName: context?.selectedName,
        }),
        signal: options?.signal,
      });
    } catch (networkErr: any) {
      if (networkErr?.name === 'AbortError') {
        throw new Error('Visual brief synthesis was cancelled.');
      }
      throw new Error(
        'Network error: Unable to reach the server. Please check your connection and retry.'
      );
    }

    options?.onProgress?.('Establishing typography hierarchy and geometric signatures...');

    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Visual brief synthesis failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    return result.data as VisualDirection;
  }
}
