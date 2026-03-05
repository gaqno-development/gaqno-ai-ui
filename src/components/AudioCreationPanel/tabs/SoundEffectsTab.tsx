import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label } from '@gaqno-development/frontcore/components/ui';
import { Zap, RefreshCw } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useSoundEffectMutations } from '@/hooks/mutations/useAudioMutations';
import { GenerationLoadingCard } from "@/components/shared";
import { useScrollToResult } from '@/hooks/useScrollToResult';

export function SoundEffectsTab() {
  const { generateSoundEffect } = useSoundEffectMutations();
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  useScrollToResult(resultSectionRef, Boolean(audioUrl));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const r = await generateSoundEffect.mutateAsync({ body: { text: text.trim() } });
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
            <Zap className="h-5 w-5" />
            Sound Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sf-text">Description</Label>
            <Textarea
              id="sf-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Thunder and rain, distant explosion, forest ambience"
              className="min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={generateSoundEffect.isPending}
            disabled={!text.trim()}
          >
            Generate Sound Effect
          </Button>
        </CardContent>
      </Card>
      </div>
      {generateSoundEffect.isPending && (
        <GenerationLoadingCard title="Gerando efeito sonoro" message="Aguarde enquanto o efeito é gerado." />
      )}
      {audioUrl && (
        <div ref={resultSectionRef}>
          <GeneratedAudioCard
            audioUrl={audioUrl}
            title="Efeito sonoro gerado"
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
