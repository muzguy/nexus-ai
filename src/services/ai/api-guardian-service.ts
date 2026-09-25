import { BrandProject, ConsistencyReport } from '@/types';
import { IConsistencyService, AIExecutionOptions } from './types';

export class ApiGuardianService implements IConsistencyService {
  async auditBrandSystem(
    project: BrandProject,
    options?: AIExecutionOptions,
    auditPayload?: {
      contentToAudit?: string;
      contentType?: string;
    }
  ): Promise<ConsistencyReport> {
    options?.onProgress?.('Extracting brand rules, tone attributes, and taboo constraints...');

    let response: Response;
    try {
      response = await fetch('/api/ai/guardian', {
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
          contentToAudit: auditPayload?.contentToAudit,
          contentType: auditPayload?.contentType,
        }),
        signal: options?.signal,
      });
    } catch (networkErr: unknown) {
      const err = networkErr as { name?: string };
      if (err?.name === 'AbortError') {
        throw new Error('Consistency Guardian audit was cancelled.');
      }
      throw new Error(
        'Network error: Unable to reach the Consistency Guardian service. Please check your connection and retry.'
      );
    }

    options?.onProgress?.('Evaluating content for tone mismatch, negative boundaries, and buzzwords...');

    let result: { success?: boolean; data?: ConsistencyReport; error?: string };
    try {
      result = await response.json();
    } catch {
      throw new Error('Received an unparseable response from the server during consistency audit. Please retry.');
    }

    if (!response.ok || !result?.success) {
      const message =
        result?.error ||
        `Consistency audit failed with status ${response.status}. Please check your configuration and retry.`;
      throw new Error(message);
    }

    options?.onProgress?.('Finalizing systemic integrity verdict and suggested revision...');

    return result.data as ConsistencyReport;
  }
}
