import { useAIModelsQueries } from '@/hooks/queries/useAIModelsQueries';
import { useTextMutations } from '@/hooks/mutations/useTextMutations';
import { useImageGenerationMutations, useImageEditMutations } from '@/hooks/mutations/useImageMutations';
import { useVideoModelsQueries, useVideoGenerationQueries } from '@/hooks/queries/useVideoQueries';
import { useVideoMutations } from '@/hooks/mutations/useVideoMutations';
import { useBookMutations } from '@/hooks/mutations/useBookMutations';
import { useBookAIMutations } from '@/hooks/mutations/useBookAIMutations';
import { useVoices } from '@/hooks/queries/useAudioQueries';
import {
  useAudioGenerationMutations,
  useTranscribeMutations,
  useMusicMutations,
  useVoiceChangerMutations,
  useSoundEffectMutations,
  useAudioIsolationMutations,
} from '@/hooks/mutations/useAudioMutations';

export const useQueryAI = () => {
  const models = useAIModelsQueries();
  const text = useTextMutations();
  const imageGeneration = useImageGenerationMutations();
  const imageEdit = useImageEditMutations();
  const videoModels = useVideoModelsQueries();
  const videoGenerationQueries = useVideoGenerationQueries();
  const videoMutations = useVideoMutations();
  const books = useBookMutations();
  const booksAi = useBookAIMutations();
  const voices = useVoices();
  const audioGeneration = useAudioGenerationMutations();
  const transcribe = useTranscribeMutations();
  const music = useMusicMutations();
  const voiceChanger = useVoiceChangerMutations();
  const soundEffect = useSoundEffectMutations();
  const audioIsolation = useAudioIsolationMutations();

  return {
    models,
    text: {
      generateText: text.generateText,
      streamText: text.streamText,
      generateObject: text.generateObject,
    },
    image: {
      generate: imageGeneration.generate,
      edit: imageEdit.edit,
    },
    video: {
      models: videoModels,
      getStatus: videoGenerationQueries.getStatus,
      generate: videoMutations.generate,
      upload: videoMutations.upload,
    },
    books: {
      queries: books.queries,
      mutations: books.mutations,
    },
    booksAi,
    audio: {
      voices,
      generate: audioGeneration.generate,
      transcribe: transcribe.transcribe,
      music: music.generateMusic,
      voiceChanger: voiceChanger.voiceChanger,
      soundEffect: soundEffect.generateSoundEffect,
      audioIsolation: audioIsolation.audioIsolation,
    },
  };
};
