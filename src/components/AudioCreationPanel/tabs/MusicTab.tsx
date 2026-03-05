import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label } from '@gaqno-development/frontcore/components/ui';
import { Music, RefreshCw } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useMusicMutations } from '@/hooks/mutations/useAudioMutations';
import { GenerationLoadingCard } from "@/components/shared";
import { useScrollToResult } from '@/hooks/useScrollToResult';

export function MusicTab() {
  const { generateMusic } = useMusicMutations();
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  useScrollToResult(resultSectionRef, Boolean(audioUrl));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      const r = await generateMusic.mutateAsync({ body: { prompt: prompt.trim() } });
      setAudioUrl(r.audioUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const resetToForm = () => {
    setAudioUrl(null);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6">
      <div ref={formSectionRef}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Music
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="music-prompt">Prompt</Label>
            <Textarea
              id="music-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Upbeat electronic dance music with a catchy melody"
              className="min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={generateMusic.isPending}
            disabled={!prompt.trim()}
          >
            Generate Music
          </Button>
        </CardContent>
      </Card>
      </div>
      {generateMusic.isPending && (
        <GenerationLoadingCard title="Gerando música" message="Aguarde enquanto a música é gerada." />
      )}
      {audioUrl && (
        <div ref={resultSectionRef}>
          <GeneratedAudioCard
            audioUrl={audioUrl}
            title="Música gerada"
            extra={
              <Button type="button" variant="secondary" size="sm" onClick={resetToForm} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Gerar novamente
              </Button>
            }
          />
        </div>
      )}
    </form>
  );
}
