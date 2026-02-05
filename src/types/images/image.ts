export type ImageProviderId =
  | "openai"
  | "gemini"
  | "vertex"
  | "replicate"
  | "fireworks";

export type ImageProviderOrAuto = ImageProviderId | "auto";

export interface ImageModel {
  id: string;
  name: string;
}

export interface ImageProvider {
  id: ImageProviderId | string;
  name: string;
  models: ImageModel[];
}

export interface ImageModelsResponse {
  providers: ImageProvider[];
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  aspect_ratio?: string;
  model?: string;
  provider?: ImageProviderOrAuto;
  negative_tags?: string[];
  negative_prompt?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  metadata: {
    prompt: string;
    style?: string;
    aspect_ratio?: string;
    provider: string;
  };
}
