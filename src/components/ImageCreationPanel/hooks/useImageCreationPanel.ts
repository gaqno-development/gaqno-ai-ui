import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useImageGeneration } from '@/hooks/images';

const imageFormSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  style: z.string().optional(),
  aspect_ratio: z.string().optional(),
  model: z.string().optional(),
});

export type ImageFormData = z.infer<typeof imageFormSchema>;

export const useImageCreationPanel = () => {
  const { generate } = useImageGeneration();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: '',
      style: '',
      aspect_ratio: '16:9',
      model: 'dall-e-3',
    },
  });

  const prompt = watch('prompt');

  const onSubmit = useCallback(
    async (data: ImageFormData) => {
      try {
        const result = await generate.mutateAsync({
          prompt: data.prompt,
          style: data.style || undefined,
          aspect_ratio: data.aspect_ratio || undefined,
          model: data.model || undefined,
        });
        setGeneratedImageUrl(result.imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    },
    [generate],
  );

  return {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    generatedImageUrl,
    isSubmitLoading: generate.isPending,
    isSubmitDisabled: !prompt,
  };
};
