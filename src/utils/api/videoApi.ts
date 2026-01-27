import { getAiServiceBaseUrl } from '@/lib/env';

export const videoApi = {
  async getModels(): Promise<any[]> {
    const response = await fetch(`${getAiServiceBaseUrl()}/v1/videos/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  },

  async generateVideo(body: {
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
  }): Promise<any> {
    const response = await fetch(`${getAiServiceBaseUrl()}/v1/videos/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  },

  async getVideoStatus(videoId: string): Promise<any> {
    const response = await fetch(`${getAiServiceBaseUrl()}/v1/videos/${videoId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  },

  async uploadAsset(file: File, type: 'video' | 'image'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${getAiServiceBaseUrl()}/v1/videos/upload-asset`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  },
};
