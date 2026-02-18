import { createAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { getAiServiceBaseUrl } from '@/lib/env';
import type {
  GetVoicesResponse,
  MusicStreamRequest,
  RealtimeSttTokenResponse,
  SoundEffectRequest,
  TtsStreamInputTokenResponse,
  TranscribeRequest,
  TranscribeResponse,
  VoiceChangerRequest,
} from '@/types/audio/audio';

const client = createAxiosClient({
  baseURL: getAiServiceBaseUrl(),
  timeout: 180000,
});

const formDataHeaders = { 'Content-Type': undefined as unknown as string };

export const audioApi = {
  async getVoices(): Promise<GetVoicesResponse> {
    const { data } = await client.get<GetVoicesResponse>('/v1/audio/voices');
    return data;
  },

  async generateAudio(body: {
    text: string;
    voiceId?: string;
    stability?: number;
    similarityBoost?: number;
  }): Promise<Blob> {
    const { data } = await client.post<Blob>(
      '/v1/audio/text-to-speech',
      {
        provider: 'elevenlabs',
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
      },
      { responseType: 'blob' },
    );
    return data;
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

    const { data } = await client.post<TranscribeResponse>('/v1/audio/speech-to-text', form, {
      headers: formDataHeaders,
    });
    return data;
  },

  async getRealtimeSttToken(): Promise<RealtimeSttTokenResponse> {
    const { data } = await client.post<RealtimeSttTokenResponse>(
      '/v1/audio/speech-to-text/realtime-token',
    );
    return data;
  },

  async getTtsStreamInputToken(): Promise<TtsStreamInputTokenResponse> {
    const { data } = await client.post<TtsStreamInputTokenResponse>(
      '/v1/audio/tts-stream-input-token',
    );
    return data;
  },

  async generateMusic(
    body: MusicStreamRequest,
    outputFormat?: string,
  ): Promise<Blob> {
    const params = outputFormat ? { output_format: outputFormat } : undefined;
    const { data } = await client.post<Blob>('/v1/audio/music/stream', body, {
      params,
      responseType: 'blob',
    });
    return data;
  },

  async voiceChanger(
    voiceId: string,
    audio: File,
    query?: VoiceChangerRequest,
  ): Promise<Blob> {
    const form = new FormData();
    form.append('audio', audio);
    const params: Record<string, string> = {};
    if (query?.output_format) params.output_format = query.output_format;
    if (query?.model_id) params.model_id = query.model_id;
    if (query?.remove_background_noise != null)
      params.remove_background_noise = String(query.remove_background_noise);

    const { data } = await client.post<Blob>(
      `/v1/audio/voice-changer/${encodeURIComponent(voiceId)}`,
      form,
      {
        params: Object.keys(params).length ? params : undefined,
        headers: formDataHeaders,
        responseType: 'blob',
      },
    );
    return data;
  },

  async generateSoundEffect(
    body: SoundEffectRequest,
    outputFormat?: string,
  ): Promise<Blob> {
    const params = outputFormat ? { output_format: outputFormat } : undefined;
    const { data } = await client.post<Blob>('/v1/audio/sound-effects', body, {
      params,
      responseType: 'blob',
    });
    return data;
  },

  async audioIsolation(
    audio: File,
    fileFormat?: 'pcm_s16le_16' | 'other',
  ): Promise<Blob> {
    const form = new FormData();
    form.append('audio', audio);
    const params = fileFormat ? { file_format: fileFormat } : undefined;
    const { data } = await client.post<Blob>('/v1/audio/audio-isolation/stream', form, {
      params,
      headers: formDataHeaders,
      responseType: 'blob',
    });
    return data;
  },
};
