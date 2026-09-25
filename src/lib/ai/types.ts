export type AIProviderName = 'gemini' | 'groq';

export interface AIProviderRequest {
  systemInstruction: string;
  userPrompt: string;
  schema?: any;
  temperature?: number;
  signal?: AbortSignal;
}

export interface AIProviderResponse {
  text: string;
  provider: AIProviderName;
}

export interface AIProvider {
  readonly name: AIProviderName;
  isConfigured(): boolean;
  generateContent(req: AIProviderRequest): Promise<AIProviderResponse>;
}
