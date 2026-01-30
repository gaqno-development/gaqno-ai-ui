export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  aspect_ratio?: string;
  model?: string;
  negative_tags?: string[];
}

export interface ImageGenerationResponse {
  imageUrl: string;
  metadata: {
    prompt: string;
    style?: string;
    aspect_ratio?: string;
    provider: 'stable_diffusion' | 'gemini';
  };
}
