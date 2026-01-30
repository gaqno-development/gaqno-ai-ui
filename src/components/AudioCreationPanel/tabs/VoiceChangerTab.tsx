import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaqno-development/frontcore/components/ui';
import { UserCircle } from 'lucide-react';
import { useVoices } from '@/hooks/queries/useAudioQueries';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useVoiceChangerMutations } from '@/hooks/mutations/useAudioMutations';

export function VoiceChangerTab() {
  const { voices, isLoading } = useVoices();
  const { voiceChanger } = useVoiceChangerMutations();
  const [voiceId, setVoiceId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setAudioUrl(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !voiceId) return;
    try {
      const r = await voiceChanger.mutateAsync({
        voiceId,
        file,
      });
      setAudioUrl(r.audioUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Voice Changer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vc-voice">Voice</Label>
            <Select
              value={voiceId}
              onValueChange={setVoiceId}
              disabled={isLoading}
            >
              <SelectTrigger id="vc-voice">
                <SelectValue placeholder={isLoading ? 'Loading voices…' : 'Select voice'} />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.voice_id} value={v.voice_id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {voices.length === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground mt-1">No voices available.</p>
            )}
          </div>
          <div>
            <Label>Audio file</Label>
            <input
              type="file"
              accept="audio/*"
              onChange={onFileChange}
              className="block w-full text-sm border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={voiceChanger.isPending}
            disabled={!file || !voiceId}
          >
            Transform
          </Button>
        </CardContent>
      </Card>
      {audioUrl && <GeneratedAudioCard audioUrl={audioUrl} title="Result" />}
    </form>
  );
}
