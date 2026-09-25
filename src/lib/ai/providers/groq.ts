import Groq from 'groq-sdk';
import { AIProvider, AIProviderRequest, AIProviderResponse } from '../types';

export function convertGenAiSchemaToJsonSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const typeMap: Record<string, string> = {
    OBJECT: 'object',
    STRING: 'string',
    ARRAY: 'array',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    NUMBER: 'number',
  };

  const result: Record<string, any> = {};

  if (schema.type) {
    const rawType = schema.type;
    result.type = typeMap[rawType] || (typeof rawType === 'string' ? rawType.toLowerCase() : rawType);
  }

  if (schema.description) {
    result.description = schema.description;
  }

  if (schema.enum) {
    result.enum = schema.enum;
  }

  if (Array.isArray(schema.required)) {
    result.required = schema.required;
  }

  if (schema.properties && typeof schema.properties === 'object') {
    result.properties = {};
    for (const [key, val] of Object.entries(schema.properties)) {
      result.properties[key] = convertGenAiSchemaToJsonSchema(val);
    }
  }

  if (schema.items) {
    result.items = convertGenAiSchemaToJsonSchema(schema.items);
  }

  return result;
}

export class GroqProvider implements AIProvider {
  readonly name = 'groq' as const;

  get model(): string {
    return process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b';
  }

  isConfigured(): boolean {
    return Boolean(process.env.GROQ_API_KEY?.trim());
  }

  async generateContent(req: AIProviderRequest): Promise<AIProviderResponse> {
    if (req.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured on the server.');
    }

    const groq = new Groq({ apiKey });

    const jsonSchema = req.schema ? convertGenAiSchemaToJsonSchema(req.schema) : undefined;
    let fullSystemInstruction = req.systemInstruction;
    if (jsonSchema) {
      fullSystemInstruction += `\n\nCRITICAL OUTPUT REQUIREMENT:\nYou MUST respond ONLY with a valid, well-formed JSON object strictly conforming to the following JSON Schema. Do NOT include markdown code fences or any text outside the JSON object.\n\nJSON Schema:\n${JSON.stringify(jsonSchema, null, 2)}`;
    }

    const completion = await groq.chat.completions.create(
      {
        model: this.model,
        messages: [
          { role: 'system', content: fullSystemInstruction },
          { role: 'user', content: req.userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: req.temperature ?? 0.2,
      },
      { signal: req.signal }
    );

    if (req.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new Error('Groq returned an empty response.');
    }

    return {
      text,
      provider: 'groq',
    };
  }
}
