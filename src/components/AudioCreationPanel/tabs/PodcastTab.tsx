import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label, Input } from '@gaqno-development/frontcore/components/ui';
import { BookOpen } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { usePodcastTab } from './hooks/usePodcastTab';

export function PodcastTab() {
  const {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    audioUrl,
    generate,
    apiErrorMessage,
    script,
  } = usePodcastTab();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Podcast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="podcast-script">Roteiro</Label>
            <Textarea
              id="podcast-script"
              {...register('script')}
              placeholder="Cole o roteiro ou texto do episódio…"
              className="min-h-[180px]"
            />
            <p className="text-xs text-muted-foreground mt-1">Até ~2500 caracteres.</p>
            {errors.script && (
              <p className="text-sm text-destructive mt-1">{errors.script.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="stability"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="podcast-stability">Estabilidade (0–1)</Label>
                  <Input
                    id="podcast-stability"
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? 0.5 : Number(e.target.value))
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </div>
              )}
            />
            <Controller
              name="similarityBoost"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="podcast-similarity">Similaridade (0–1)</Label>
                  <Input
                    id="podcast-similarity"
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? 0.75 : Number(e.target.value))
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </div>
              )}
            />
          </div>
          <div>
            <Label htmlFor="podcast-voice">Voice ID (opcional)</Label>
            <Input
              id="podcast-voice"
              {...register('voiceId')}
              placeholder="ex.: JBFqnCBsd6RMkjVDRZzb"
            />
          </div>
          {apiErrorMessage && (
            <p className="text-sm text-destructive">{apiErrorMessage}</p>
          )}
          <Button type="submit" className="w-full" loading={generate.isPending} disabled={!script}>
            Gerar áudio
          </Button>
        </CardContent>
      </Card>
      {audioUrl && (
        <GeneratedAudioCard
          audioUrl={audioUrl}
          title="Áudio gerado"
          extra={
            <a download="podcast.mp3" href={audioUrl} className="text-sm underline">
              Baixar
            </a>
          }
        />
      )}
    </form>
  );
}
