import { NextResponse } from 'next/server';
import { AIProviderRequest, AIProviderResponse } from './types';
import { GeminiProvider, isTransientGeminiError } from './providers/gemini';
import { GroqProvider } from './providers/groq';

export interface RouterOptions<T> {
  maxGeminiRetries?: number;
  initialRetryDelayMs?: number;
  validate?: (parsed: unknown) => { isValid: boolean; data?: T; error?: string };
}

export interface ExecutionResult<T> {
  data: T;
  rawText: string;
  provider: 'gemini' | 'groq';
}

export function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  return cleaned;
}

export class AIProviderRouter {
  private geminiProvider: GeminiProvider;
  private groqProvider: GroqProvider;

  constructor(gemini?: GeminiProvider, groq?: GroqProvider) {
    this.geminiProvider = gemini || new GeminiProvider();
    this.groqProvider = groq || new GroqProvider();
  }

  async execute<T>(
    request: AIProviderRequest,
    options?: RouterOptions<T>
  ): Promise<ExecutionResult<T>> {
    const signal = request.signal;

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const maxGeminiAttempts = options?.maxGeminiRetries ?? 3;
    const initialDelay = options?.initialRetryDelayMs ?? 1500;

    let geminiError: any = null;
    let geminiResponse: AIProviderResponse | null = null;

    // 1. PRIMARY PROVIDER: Gemini with transient retry
    if (this.geminiProvider.isConfigured()) {
      let attempt = 0;
      while (attempt < maxGeminiAttempts) {
        attempt++;

        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        try {
          geminiResponse = await this.geminiProvider.generateContent(request);

          // If a validator is supplied, verify output immediately
          if (options?.validate && geminiResponse?.text) {
            const cleaned = cleanJsonText(geminiResponse.text);
            const parsed = JSON.parse(cleaned);
            const validation = options.validate(parsed);

            if (!validation.isValid || !validation.data) {
              throw new Error(
                validation.error || 'Gemini response failed structural schema validation.'
              );
            }

            return {
              data: validation.data,
              rawText: geminiResponse.text,
              provider: 'gemini',
            };
          } else if (geminiResponse?.text) {
            return {
              data: null as unknown as T,
              rawText: geminiResponse.text,
              provider: 'gemini',
            };
          }
        } catch (err: any) {
          geminiError = err;

          if (signal?.aborted || err?.name === 'AbortError') {
            throw new DOMException('Aborted', 'AbortError');
          }

          const isTransient = isTransientGeminiError(err);

          if (isTransient && attempt < maxGeminiAttempts) {
            const delayMs = attempt * initialDelay;
            console.warn(
              `[NEXUS Router] Gemini attempt ${attempt}/${maxGeminiAttempts} failed (transient). Retrying in ${delayMs}ms...`
            );

            // Wait with abort signal awareness
            await new Promise((resolve, reject) => {
              if (signal?.aborted) {
                return reject(new DOMException('Aborted', 'AbortError'));
              }
              const timer = setTimeout(resolve, delayMs);
              signal?.addEventListener(
                'abort',
                () => {
                  clearTimeout(timer);
                  reject(new DOMException('Aborted', 'AbortError'));
                },
                { once: true }
              );
            });
            continue;
          }

          // Non-transient error or retries exhausted: break to failover
          console.warn(
            `[NEXUS Router] Gemini primary failed on attempt ${attempt}: ${err?.message || err}. Evaluating failover to Groq...`
          );
          break;
        }
      }
    } else {
      console.warn('[NEXUS Router] Gemini is not configured. Falling back to Groq directly...');
    }

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 2. BACKUP PROVIDER: Groq Failover
    if (this.groqProvider.isConfigured()) {
      console.log(
        `[NEXUS Router] Failing over to backup provider: Groq (Model: ${this.groqProvider.model})...`
      );

      try {
        const groqResponse = await this.groqProvider.generateContent(request);

        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        if (options?.validate && groqResponse?.text) {
          const cleaned = cleanJsonText(groqResponse.text);
          let parsed: unknown;
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            throw new Error('Groq returned unparseable JSON output.');
          }

          const validation = options.validate(parsed);
          if (!validation.isValid || !validation.data) {
            throw new Error(
              validation.error || 'Groq response failed structural schema validation.'
            );
          }

          console.log('[NEXUS Router] Groq backup successfully synthesized and validated output.');
          return {
            data: validation.data,
            rawText: groqResponse.text,
            provider: 'groq',
          };
        } else if (groqResponse?.text) {
          return {
            data: null as unknown as T,
            rawText: groqResponse.text,
            provider: 'groq',
          };
        }
      } catch (groqErr: any) {
        if (signal?.aborted || groqErr?.name === 'AbortError') {
          throw new DOMException('Aborted', 'AbortError');
        }

        console.error(
          `[NEXUS Router] Backup provider (Groq) also failed: ${groqErr?.message || groqErr}`
        );
        // Throw either the Groq error or preserve the original Gemini error context
        throw groqErr;
      }
    }

    // Both failed or Groq not configured
    throw geminiError || new Error('All configured AI providers failed to generate content.');
  }
}

export const aiProviderRouter = new AIProviderRouter();

export async function executeWithFailover<T>(
  request: AIProviderRequest,
  options?: RouterOptions<T>
): Promise<ExecutionResult<T>> {
  return aiProviderRouter.execute<T>(request, options);
}

export function handleRouterError(err: any): NextResponse {
  if (
    err?.name === 'AbortError' ||
    err?.message?.includes('aborted') ||
    err?.message?.includes('Aborted')
  ) {
    return new NextResponse(null, { status: 499 });
  }

  const rawMsg = typeof err?.message === 'string' ? err.message : '';
  const status = err?.status;

  if (
    status === 401 ||
    rawMsg.includes('API_KEY_INVALID') ||
    rawMsg.includes('API key not valid') ||
    rawMsg.includes('Invalid API Key') ||
    (status === 400 && rawMsg.includes('API key'))
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          'AI authentication failed. Please verify that your API key in .env.local is valid.',
      },
      { status: 401 }
    );
  }

  if (
    status === 403 ||
    rawMsg.includes('PERMISSION_DENIED') ||
    rawMsg.toLowerCase().includes('permission')
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Access denied by AI service. Please check your API key permissions and enabled services.',
      },
      { status: 403 }
    );
  }

  if (
    status === 429 ||
    rawMsg.includes('RESOURCE_EXHAUSTED') ||
    rawMsg.toLowerCase().includes('quota') ||
    rawMsg.toLowerCase().includes('rate limit')
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'NEXUS AI rate limit or quota exceeded. Please wait a moment and click Retry.',
      },
      { status: 429 }
    );
  }

  if (
    status === 503 ||
    rawMsg.includes('high demand') ||
    rawMsg.includes('UNAVAILABLE') ||
    rawMsg.includes('service_unavailable')
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          'NEXUS AI is currently experiencing temporary high demand. Please click Retry in a moment.',
      },
      { status: 503 }
    );
  }

  if (
    status === 504 ||
    rawMsg.includes('timeout') ||
    rawMsg.includes('DEADLINE_EXCEEDED') ||
    err?.code === 'ETIMEDOUT'
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'The request to NEXUS AI timed out. Please check your network and click Retry.',
      },
      { status: 504 }
    );
  }

  if (
    status === 404 ||
    rawMsg.includes('no longer available') ||
    rawMsg.includes('NOT_FOUND') ||
    rawMsg.includes('model_not_found')
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          'The configured AI model is unavailable. Please verify your model configuration in .env.local.',
      },
      { status: 404 }
    );
  }

  if (
    err?.name === 'ValidationError' ||
    rawMsg.includes('validation') ||
    rawMsg.includes('schema')
  ) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'The AI output failed structural schema validation. Please retry.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred while communicating with NEXUS AI. Please retry.',
    },
    { status: 500 }
  );
}
