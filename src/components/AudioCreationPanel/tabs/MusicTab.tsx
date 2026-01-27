import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label } from '@gaqno-development/frontcore/components/ui';
import { Music } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useMusicMutations } from '@/hooks/mutations/useAudioMutations';

export function MusicTab() {
  const { generateMusic } = useMusicMutations();
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
      {audioUrl && <GeneratedAudioCard audioUrl={audioUrl} title="Generated Music" />}
    </form>
  );
}
