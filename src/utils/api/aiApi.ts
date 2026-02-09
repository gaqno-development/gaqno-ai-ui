import { createAxiosClient } from "@gaqno-development/frontcore/utils/api";
import { getAiServiceBaseUrl } from "@/lib/env";

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

export interface ImageModelInfo {
  id: string;
  name: string;
}

export interface ImageProviderInfo {
  id: string;
  name: string;
  models: ImageModelInfo[];
}

export interface ImageModelsResponse {
  providers: ImageProviderInfo[];
}

export interface ModelsRegistryResponse {
  text: {
    providers: ImageProviderInfo[];
    defaultProvider: string;
    defaultModel: string;
  };
  image: {
    providers: ImageProviderInfo[];
    defaultProvider: string;
    defaultModel: string;
  };
}

export interface GenerateImageOptions {
  prompt: string;
  style?: string;
  aspect_ratio?: string;
  model?: string;
  provider?:
    | "openai"
    | "gemini"
    | "vertex"
    | "replicate"
    | "fireworks"
    | "auto";
  negative_tags?: string[];
  negative_prompt?: string;
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

export interface ProductProfileRequestProduct {
  id: string;
  name: string;
  price: number;
  tenantId: string;
  description?: string;
  sku?: string;
  stock?: number;
  category?: string;
  imageUrls?: string[];
}

export interface BuildProductProfileRequest {
  product: ProductProfileRequestProduct;
  inferMissing?: boolean;
}

export interface SemanticFieldValue {
  value: string | string[] | number | null;
  confidence: number;
  source: "provided" | "inferred";
}

export interface ProductProfileResponse {
  productId: string;
  tenantId: string;
  profile: Record<string, SemanticFieldValue>;
  overallConfidence: number;
}

export interface GenerateContentProductInput {
  id: string;
  name: string;
  price: number;
  tenantId: string;
  description?: string;
  category?: string;
  imageUrls?: string[];
}

export interface GenerateContentRequest {
  product: GenerateContentProductInput;
}

export interface GenerateContentResponse {
  copy: string;
  assumptions: string[];
}

export interface PublishDistributionBody {
  to: string;
  channelType: "whatsapp";
  content: { text: string; mediaUrl?: string };
}

export interface CreateCampaignBody {
  tenantId?: string;
  name: string;
  startAt: string;
  endAt: string;
}

export interface CampaignRecord {
  id: string;
  tenantId: string;
  name: string;
  startAt: string;
  endAt: string;
  createdAt: string;
}

export interface AttributionReport {
  campaignId: string;
  startAt: string;
  endAt: string;
  gmv: number;
  transactionCount: number;
  confidence: number;
  confidenceExplanation: string;
  source: string;
  sourceAvailable: boolean;
}

export interface BillingSummary {
  tenantId: string;
  period: { from: string; to: string };
  gmv: number;
  transactionCount: number;
  feeRatePercent: number;
  feeAmount: number;
  currency: string;
  summaryExplanation?: string;
  sourceAvailable: boolean;
}

export interface VideoTemplateSummary {
  id: string;
  name: string;
  description: string;
}

export interface GenerateVideoFromTemplateBody {
  templateId: string;
  product?: { name?: string; description?: string };
  model?: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: string;
  created_at?: string;
  video_url?: string;
  thumbnail_url?: string;
  progress?: number;
  error?: string;
}

const DEFAULT_SYSTEM = "You are a helpful assistant.";

const client = createAxiosClient({
  baseURL: getAiServiceBaseUrl(),
  timeout: 180000,
});

function textPayload(
  options: GenerateTextOptions,
  systemDefault = DEFAULT_SYSTEM
) {
  return {
    model: options.model,
    system_prompt: options.systemPrompt ?? systemDefault,
    user_prompt: options.userPrompt,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  };
}

export const aiApi = {
  async getImageModels(): Promise<ImageModelsResponse> {
    const { data } = await client.get<ImageModelsResponse>("/v1/images/models");
    return data;
  },

  async getModelsRegistry(): Promise<ModelsRegistryResponse> {
    const { data } = await client.get<ModelsRegistryResponse>(
      "/v1/models/registry"
    );
    return data;
  },

  async getModels(): Promise<AIModel[]> {
    const { data } = await client.get<AIModelsResponse>("/v1/models");
    return data.data ?? [];
  },

  async generateText(options: GenerateTextOptions): Promise<string> {
    const { data } = await client.post<{ content?: string }>(
      "/v1/responses",
      textPayload(options)
    );
    return typeof data.content === "string"
      ? data.content
      : JSON.stringify(data);
  },

  async streamText(
    options: GenerateTextOptions,
    signal?: AbortSignal
  ): Promise<ReadableStream<Uint8Array>> {
    const { data } = await client.post<ArrayBuffer>(
      "/v1/responses/stream",
      textPayload(options),
      {
        responseType: "arraybuffer",
        signal,
      }
    );
    const buf = new Uint8Array(data);
    return new ReadableStream({
      start(ctrl) {
        ctrl.enqueue(buf);
        ctrl.close();
      },
    });
  },

  async generateObject<T = Record<string, unknown>>(
    options: GenerateObjectOptions
  ): Promise<T> {
    const body = {
      ...textPayload(
        options,
        "You are a helpful assistant. Return valid JSON only."
      ),
      response_format: options.schema
        ? {
            type: "json_schema",
            json_schema: {
              name: "response",
              strict: true,
              schema: options.schema,
            },
          }
        : "json",
    };
    const { data } = await client.post<{ content?: unknown } | T>(
      "/v1/responses",
      body
    );
    const out =
      data && typeof data === "object" && "content" in data
        ? (data as { content: T }).content
        : data;
    return out as T;
  },

  async generateImage(
    options: GenerateImageOptions
  ): Promise<{ imageUrl: string; metadata: Record<string, unknown> }> {
    const { data } = await client.post<{
      imageUrl: string;
      metadata: Record<string, unknown>;
    }>("/v1/images/generate", {
      prompt: options.prompt,
      style: options.style,
      aspect_ratio: options.aspect_ratio,
      model: options.model,
      provider: options.provider,
      negative_tags: options.negative_tags,
      negative_prompt: options.negative_prompt,
    });
    return data;
  },

  async editImage(
    file: File,
    instruction: string
  ): Promise<{ imageUrl: string }> {
    const form = new FormData();
    form.append("image", file);
    form.append("instruction", instruction);
    const { data } = await client.post<{ imageUrl: string }>(
      "/v1/images/edit",
      form
    );
    return data;
  },

  async generateBlueprint(body: GenerateBlueprintBody): Promise<unknown> {
    const { data } = await client.post("/v1/ai/books/generate-blueprint", body);
    return data;
  },

  async analyzeCharacter(
    body: AnalyzeCharacterBody
  ): Promise<{ characterDetails?: unknown }> {
    const { data } = await client.post<{ characterDetails?: unknown }>(
      "/v1/ai/books/analyze-character",
      body
    );
    return data;
  },

  async generateCharacterAvatar(body: {
    characterName?: string;
    characterDescription?: string;
  }): Promise<{ imageUrl?: string; avatarPrompt?: string }> {
    const { data } = await client.post<{
      imageUrl?: string;
      avatarPrompt?: string;
    }>("/v1/ai/books/generate-character-avatar", body);
    return data;
  },

  async analyzeContext(
    body: AnalyzeContextBody
  ): Promise<{ analysis: string }> {
    const { data } = await client.post<{ analysis: string }>(
      "/v1/ai/books/analyze-context",
      body
    );
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
    const { data } = await client.post("/v1/ai/books/generate-chapter", body);
    return data;
  },

  async getVideoModels(): Promise<unknown[]> {
    const { data } = await client.get<{ data?: unknown[] }>(
      "/v1/videos/models"
    );
    return data?.data ?? [];
  },

  async getVideoTemplates(): Promise<VideoTemplateSummary[]> {
    const { data } = await client.get<VideoTemplateSummary[]>(
      "/v1/videos/templates"
    );
    return data ?? [];
  },

  async generateVideoFromTemplate(
    body: GenerateVideoFromTemplateBody
  ): Promise<VideoGenerationResponse> {
    const { data } = await client.post<VideoGenerationResponse>(
      "/v1/videos/generate-from-template",
      body
    );
    return data;
  },

  async generateVideo(body: GenerateVideoBody): Promise<unknown> {
    const { data } = await client.post("/v1/videos/generate", body);
    return data;
  },

  async getVideoStatus(videoId: string): Promise<unknown> {
    const { data } = await client.get(`/v1/videos/${videoId}/status`);
    return data;
  },

  async uploadVideoAsset(
    file: File,
    type: "video" | "image"
  ): Promise<unknown> {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    const { data } = await client.post("/v1/videos/upload-asset", form);
    return data;
  },

  async buildProductProfile(
    request: BuildProductProfileRequest
  ): Promise<ProductProfileResponse> {
    const { data } = await client.post<ProductProfileResponse>(
      "/product-profile/build",
      request
    );
    return data;
  },

  async generateProductContent(
    request: GenerateContentRequest
  ): Promise<GenerateContentResponse> {
    const { data } = await client.post<GenerateContentResponse>(
      "/product-content/generate",
      request
    );
    return data;
  },

  async publishDistribution(
    body: PublishDistributionBody
  ): Promise<{ id: string; status: string }> {
    const { data } = await client.post<{ id: string; status: string }>(
      "/distribution/publish",
      body
    );
    return data;
  },

  async getDistributionStatus(
    id: string
  ): Promise<{ id: string; status: string; deliveredAt?: string }> {
    const { data } = await client.get<{
      id: string;
      status: string;
      deliveredAt?: string;
    }>(`/distribution/${id}/status`);
    return data;
  },

  async createCampaign(body: CreateCampaignBody): Promise<CampaignRecord> {
    const { data } = await client.post<CampaignRecord>(
      "/attribution/campaigns",
      body
    );
    return data;
  },

  async listCampaigns(
    tenantId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<CampaignRecord[]> {
    const params: Record<string, string | number> = { tenantId };
    if (options?.limit != null) params.limit = options.limit;
    if (options?.offset != null) params.offset = options.offset;
    const { data } = await client.get<CampaignRecord[]>(
      "/attribution/campaigns",
      { params }
    );
    return data ?? [];
  },

  async getCampaign(id: string, tenantId: string): Promise<CampaignRecord> {
    const { data } = await client.get<CampaignRecord>(
      `/attribution/campaigns/${id}`,
      { params: { tenantId } }
    );
    return data;
  },

  async getAttributionReport(
    campaignId: string,
    tenantId: string
  ): Promise<AttributionReport> {
    const { data } = await client.get<AttributionReport>(
      `/attribution/campaigns/${campaignId}/report`,
      { params: { tenantId } }
    );
    return data;
  },

  async getBillingSummary(
    tenantId: string,
    from?: string,
    to?: string
  ): Promise<BillingSummary> {
    const params: Record<string, string> = { tenantId };
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await client.get<BillingSummary>("/billing/summary", {
      params,
    });
    return data;
  },
};
