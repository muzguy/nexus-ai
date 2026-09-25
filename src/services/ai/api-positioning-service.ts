import { InitialIdea, DiscoveryData, PositioningData } from '@/types';
import { IPositioningService, AIExecutionOptions } from './types';

export class ApiPositioningService implements IPositioningService {
  async generateDirections(
    idea: InitialIdea,
    discovery: DiscoveryData,
    options?: AIExecutionOptions
  ): Promise<PositioningData> {
    options?.onProgress?.('NEXUS is synthesizing 3 divergent market vectors...');

    let response: Response;
    try {
      response = await fetch('/api/ai/position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          discovery,
        }),
        signal: options?.signal,
      });
    } catch (networkErr: any) {
      if (networkErr?.name === 'AbortError') {
        throw networkErr;
      }
      throw new Error(
        'Network error: Unable to reach the server. Please check your connection and retry.'
      );
    }

    options?.onProgress?.('Validating strategic positioning vectors and trade-offs...');

    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Positioning synthesis failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    return result.data as PositioningData;
  }
}
