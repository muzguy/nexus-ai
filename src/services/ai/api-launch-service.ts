import { BrandProject, LaunchKit } from '@/types';
import { ILaunchService, AIExecutionOptions } from './types';

export class ApiLaunchService implements ILaunchService {
  async generateLaunchKit(
    project: BrandProject,
    options?: AIExecutionOptions
  ): Promise<LaunchKit> {
    options?.onProgress?.('Extracting cumulative brand intelligence and positioning anchors...');

    let response: Response;
    try {
      response = await fetch('/api/ai/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: project.idea,
          discovery: project.discovery,
          positioning: project.positioning,
          selectedDirection: project.selectedDirection,
          shape: project.shapeData,
          personality: project.personality || project.shapeData?.personality,
          voice: project.voice || project.shapeData?.voice,
          selectedName: project.selectedName || project.name,
          visual: project.visualDirection,
          consistency: project.consistency,
        }),
        signal: options?.signal,
      });
    } catch (networkErr: unknown) {
      const err = networkErr as { name?: string };
      if (err?.name === 'AbortError') {
        throw new Error('Launch Kit generation was cancelled.');
      }
      throw new Error(
        'Network error: Unable to reach the Launch Kit service. Please check your connection and retry.'
      );
    }

    options?.onProgress?.('Formulating landing page hierarchy, value pillars, and headline architecture...');

    let result: { success?: boolean; data?: LaunchKit; error?: string };
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server during Launch Kit generation. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Launch Kit generation failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    options?.onProgress?.('Drafting multichannel social campaigns, launch sequence, and first-week plan...');

    return result.data as LaunchKit;
  }
}
