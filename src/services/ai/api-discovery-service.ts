import { InitialIdea, DiscoveryData } from '@/types';
import { IDiscoveryService, AIExecutionOptions } from './types';

export class ApiDiscoveryService implements IDiscoveryService {
  async analyzeIdea(idea: InitialIdea, options?: AIExecutionOptions): Promise<DiscoveryData> {
    options?.onProgress?.('NEXUS is synthesizing structured strategic intelligence...');

    let response: Response;
    try {
      response = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: idea.title,
          audienceClues: idea.targetMarketNotes,
          rawConcept: idea.rawConcept,
          founderContext: idea.founderContext,
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

    options?.onProgress?.('Validating structured brand intelligence schema...');

    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Discovery synthesis failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    return result.data as DiscoveryData;
  }
}
