import { getAiServiceBaseUrl } from '@/lib/env';
import type {
  MusicStreamRequest,
  RealtimeSttTokenResponse,
  SoundEffectRequest,
  TtsStreamInputTokenResponse,
  TranscribeRequest,
  TranscribeResponse,
  VoiceChangerRequest,
} from '@/types/audio/audio';

async function handleError(response: Response): Promise<never> {
  const error = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
  throw new Error(error.message || `HTTP Error ${response.status}`);
}

export const audioApi = {
  async generateAudio(body: {
    text: string;
    voiceId?: string;
    stability?: number;
    similarityBoost?: number;
  }): Promise<Blob> {
    const response = await fetch(`${getAiServiceBaseUrl()}/audio/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(body.voiceId && { voice_id: body.voiceId }),
        payload: {
          text: body.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: body.stability ?? 0.5,
            similarity_boost: body.similarityBoost ?? 0.75,
          },
        },
        headers: ['audio/mpeg'],
      }),
    });

    if (!response.ok) await handleError(response);
    return await response.blob();
  },

  async transcribe(
    file: File,
    params: TranscribeRequest,
  ): Promise<TranscribeResponse> {
    const form = new FormData();
    form.append('file', file);
    form.append('model_id', params.model_id);
    if (params.language_code != null) form.append('language_code', params.language_code);
    if (params.tag_audio_events != null)
      form.append('tag_audio_events', String(params.tag_audio_events));
    if (params.diarize != null) form.append('diarize', String(params.diarize));

    const response = await fetch(`${getAiServiceBaseUrl()}/audio/speech-to-text`, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) await handleError(response);
    return await response.json();
  },

  async getRealtimeSttToken(): Promise<RealtimeSttTokenResponse> {
    const response = await fetch(
      `${getAiServiceBaseUrl()}/audio/speech-to-text/realtime-token`,
      { method: 'POST' },
    );
    if (!response.ok) await handleError(response);
    return await response.json();
  },

  async getTtsStreamInputToken(): Promise<TtsStreamInputTokenResponse> {
    const response = await fetch(
      `${getAiServiceBaseUrl()}/audio/tts-stream-input-token`,
      { method: 'POST' },
    );
    if (!response.ok) await handleError(response);
    return await response.json();
  },

  async generateMusic(
    body: MusicStreamRequest,
    outputFormat?: string,
  ): Promise<Blob> {
    let url = `${getAiServiceBaseUrl()}/audio/music/stream`;
    if (outputFormat) {
      url += `?output_format=${encodeURIComponent(outputFormat)}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) await handleError(response);
    return await response.blob();
  },

  async voiceChanger(
    voiceId: string,
    audio: File,
    query?: VoiceChangerRequest,
  ): Promise<Blob> {
    const form = new FormData();
    form.append('audio', audio);
    const params = new URLSearchParams();
    if (query?.output_format) params.set('output_format', query.output_format);
    if (query?.model_id) params.set('model_id', query.model_id);
    if (query?.remove_background_noise != null)
      params.set('remove_background_noise', String(query.remove_background_noise));
    const qs = params.toString();
    const url = `${getAiServiceBaseUrl()}/audio/voice-changer/${encodeURIComponent(voiceId)}${qs ? `?${qs}` : ''}`;
    const response = await fetch(url, { method: 'POST', body: form });
    if (!response.ok) await handleError(response);
    return await response.blob();
  },

  async generateSoundEffect(
    body: SoundEffectRequest,
    outputFormat?: string,
  ): Promise<Blob> {
    let url = `${getAiServiceBaseUrl()}/audio/sound-effects`;
    if (outputFormat) {
      url += `?output_format=${encodeURIComponent(outputFormat)}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) await handleError(response);
    return await response.blob();
  },

  async audioIsolation(
    audio: File,
    fileFormat?: 'pcm_s16le_16' | 'other',
  ): Promise<Blob> {
    const form = new FormData();
    form.append('audio', audio);
    let url = `${getAiServiceBaseUrl()}/audio/audio-isolation/stream`;
    if (fileFormat) {
      url += `?file_format=${encodeURIComponent(fileFormat)}`;
    }
    const response = await fetch(url, { method: 'POST', body: form });
    if (!response.ok) await handleError(response);
    return await response.blob();
  },
};
