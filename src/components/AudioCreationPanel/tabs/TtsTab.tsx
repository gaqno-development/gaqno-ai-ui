import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label } from '@gaqno-development/frontcore/components/ui';
import { Volume2 } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAudioGenerationMutations } from '@/hooks/mutations/useAudioMutations';

const schema = z.object({ text: z.string().min(1, 'Text is required') });
type FormData = z.infer<typeof schema>;

export function TtsTab() {
  const { generate } = useAudioGenerationMutations();
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: '' },
  });
  const text = watch('text');

  const onSubmit = async (data: FormData) => {
    try {
      const result = await generate.mutateAsync({ text: data.text });
      setAudioUrl(result.audioUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text to Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tts-text">Text</Label>
            <Textarea
              id="tts-text"
              {...register('text')}
              placeholder="Enter the text you want to convert to speech..."
              className="min-h-[120px]"
            />
            {errors.text && (
              <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" loading={generate.isPending} disabled={!text}>
            Generate Audio
          </Button>
        </CardContent>
      </Card>
      {audioUrl && <GeneratedAudioCard audioUrl={audioUrl} title="Generated Audio" />}
    </form>
  );
}
