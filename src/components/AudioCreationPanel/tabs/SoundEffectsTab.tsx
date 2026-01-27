import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Textarea, Label } from '@gaqno-development/frontcore/components/ui';
import { Zap } from 'lucide-react';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useSoundEffectMutations } from '@/hooks/mutations/useAudioMutations';

export function SoundEffectsTab() {
  const { generateSoundEffect } = useSoundEffectMutations();
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
      {audioUrl && <GeneratedAudioCard audioUrl={audioUrl} title="Generated Sound" />}
    </form>
  );
}
