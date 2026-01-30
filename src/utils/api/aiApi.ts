import { createAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { getAiServiceBaseUrl } from '@/lib/env';

export interface AIModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
  provider?: string;
}

export interface AIModelsResponse {
  object: string;
  data: AIModel[];
}

export interface GenerateTextOptions {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateObjectOptions extends GenerateTextOptions {
  schema?: Record<string, unknown>;
}

export interface GenerateImageOptions {
  prompt: string;
  style?: string;
  aspect_ratio?: string;
  model?: string;
  negative_tags?: string[];
}

export interface GenerateBlueprintBody {
  title?: string;
  genre?: string;
  description?: string;
  bookContext?: Record<string, unknown>;
}

export interface AnalyzeCharacterBody {
  characterDescription?: string;
  characterName?: string;
  bookContext?: Record<string, unknown>;
}

export interface AnalyzeContextBody {
  bookContext?: Record<string, unknown>;
  currentChapterNumber?: number;
  currentChapterTitle?: string;
  currentChapterSummary?: string;
  previousChapters?: unknown[];
  previousChapter?: Record<string, unknown>;
  characters?: unknown[];
}

export interface GenerateChapterBody {
  bookContext?: Record<string, unknown>;
  chapterNumber?: number;
  chapterTitle?: string;
  previousChapters?: unknown[];
  previousChapter?: Record<string, unknown>;
  characters?: unknown[];
  complexity?: number;
  tone?: string;
  useAnalysis?: boolean;
  contextualAnalysis?: string;
  minWordsPerChapter?: number;
}

export interface GenerateVideoBody {
  prompt: string;
  model: string;
  mode?: string;
  reference_video?: string;
  reference_image?: string;
  reference_elements?: string[];
  settings?: {
    add_audio?: boolean;
    add_voice?: boolean;
    duration?: number;
    aspect_ratio?: string;
  };
}

const DEFAULT_SYSTEM = 'You are a helpful assistant.';

const client = createAxiosClient({
  baseURL: getAiServiceBaseUrl(),
  timeout: 180000,
});

function textPayload(options: GenerateTextOptions, systemDefault = DEFAULT_SYSTEM) {
  return {
    model: options.model,
    system_prompt: options.systemPrompt ?? systemDefault,
    user_prompt: options.userPrompt,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  };
}

export const aiApi = {
  async getModels(): Promise<AIModel[]> {
    const { data } = await client.get<AIModelsResponse>('/v1/models');
    return data.data ?? [];
  },

  async generateText(options: GenerateTextOptions): Promise<string> {
    const { data } = await client.post<{ content?: string }>('/v1/responses', textPayload(options));
    return typeof data.content === 'string' ? data.content : JSON.stringify(data);
  },

  async streamText(
    options: GenerateTextOptions,
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    const { data } = await client.post<ArrayBuffer>('/v1/responses/stream', textPayload(options), {
      responseType: 'arraybuffer',
      signal,
    });
    const buf = new Uint8Array(data);
    return new ReadableStream({
      start(ctrl) {
        ctrl.enqueue(buf);
        ctrl.close();
      },
    });
  },

  async generateObject<T = Record<string, unknown>>(
    options: GenerateObjectOptions,
  ): Promise<T> {
    const body = {
      ...textPayload(options, 'You are a helpful assistant. Return valid JSON only.'),
      response_format: options.schema
        ? { type: 'json_schema', json_schema: { name: 'response', strict: true, schema: options.schema } }
        : 'json',
    };
    const { data } = await client.post<{ content?: unknown } | T>('/v1/responses', body);
    const out = data && typeof data === 'object' && 'content' in data ? (data as { content: T }).content : data;
    return out as T;
  },

  async generateImage(
    options: GenerateImageOptions,
  ): Promise<{ imageUrl: string; metadata: Record<string, unknown> }> {
    const { data } = await client.post<{ imageUrl: string; metadata: Record<string, unknown> }>(
      '/v1/images/generate',
      {
        prompt: options.prompt,
        style: options.style,
        aspect_ratio: options.aspect_ratio,
        model: options.model,
        negative_tags: options.negative_tags,
      },
    );
    return data;
  },

  async editImage(file: File, instruction: string): Promise<{ imageUrl: string }> {
    const form = new FormData();
    form.append('image', file);
    form.append('instruction', instruction);
    const { data } = await client.post<{ imageUrl: string }>('/v1/images/edit', form);
    return data;
  },

  async generateBlueprint(body: GenerateBlueprintBody): Promise<unknown> {
    const { data } = await client.post('/v1/ai/books/generate-blueprint', body);
    return data;
  },

  async analyzeCharacter(body: AnalyzeCharacterBody): Promise<{ characterDetails?: unknown }> {
    const { data } = await client.post<{ characterDetails?: unknown }>('/v1/ai/books/analyze-character', body);
    return data;
  },

  async generateCharacterAvatar(body: {
    characterName?: string;
    characterDescription?: string;
  }): Promise<{ imageUrl?: string; avatarPrompt?: string }> {
    const { data } = await client.post<{ imageUrl?: string; avatarPrompt?: string }>(
      '/v1/ai/books/generate-character-avatar',
      body,
    );
    return data;
  },

  async analyzeContext(body: AnalyzeContextBody): Promise<{ analysis: string }> {
    const { data } = await client.post<{ analysis: string }>('/v1/ai/books/analyze-context', body);
    return data;
  },

  async generateChapter(body: GenerateChapterBody): Promise<{
    content?: string;
    title?: string;
    summary?: string;
    wordCount?: number;
    expanded?: boolean;
    expansionAttempts?: number;
  }> {
    const { data } = await client.post('/v1/ai/books/generate-chapter', body);
    return data;
  },

  async getVideoModels(): Promise<unknown[]> {
    const { data } = await client.get<{ data?: unknown[] }>('/v1/videos/models');
    return data?.data ?? [];
  },

  async generateVideo(body: GenerateVideoBody): Promise<unknown> {
    const { data } = await client.post('/v1/videos/generate', body);
    return data;
  },

  async getVideoStatus(videoId: string): Promise<unknown> {
    const { data } = await client.get(`/v1/videos/${videoId}/status`);
    return data;
  },

  async uploadVideoAsset(file: File, type: 'video' | 'image'): Promise<unknown> {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    const { data } = await client.post('/v1/videos/upload-asset', form);
    return data;
  },
};
