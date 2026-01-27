import { getAiServiceBaseUrl } from '@/lib/env';

export const imagesApi = {
  async generateImage(body: {
    prompt: string;
    style?: string;
    aspect_ratio?: string;
    negative_tags?: string[];
  }): Promise<any> {
    const response = await fetch(`${getAiServiceBaseUrl()}/v1/images/generate`, {
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

  async editImage(file: File, instruction: string): Promise<{ imageUrl: string }> {
    const form = new FormData();
    form.append('image', file);
    form.append('instruction', instruction);
    const response = await fetch(`${getAiServiceBaseUrl()}/v1/images/edit`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }
    return await response.json();
  },
};
