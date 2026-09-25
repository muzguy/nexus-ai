import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIProviderRequest, AIProviderResponse } from '../types';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini' as const;

  get model(): string {
    return process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
  }

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  }

  async generateContent(req: AIProviderRequest): Promise<AIProviderResponse> {
    if (req.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: this.model,
      contents: req.userPrompt,
      config: {
        systemInstruction: req.systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: req.schema,
        temperature: req.temperature ?? 0.2,
        abortSignal: req.signal,
      },
    });

    if (req.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const text = response.text;
    if (!text) {
      throw new Error('Google Gemini returned an empty response.');
    }

    return {
      text,
      provider: 'gemini',
    };
  }
}

export function isTransientGeminiError(err: any): boolean {
  if (!err) return false;
  const status = err?.status;
  const rawMsg = typeof err?.message === 'string' ? err.message : '';

  return (
    status === 503 ||
    status === 429 ||
    rawMsg.includes('high demand') ||
    rawMsg.includes('UNAVAILABLE') ||
    rawMsg.includes('RESOURCE_EXHAUSTED') ||
    rawMsg.includes('temporarily exhausted') ||
    rawMsg.includes('DEADLINE_EXCEEDED') ||
    rawMsg.includes('rate limit') ||
    rawMsg.includes('quota') ||
    err?.code === 'ETIMEDOUT'
  );
}
