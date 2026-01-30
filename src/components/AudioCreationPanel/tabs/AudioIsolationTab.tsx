import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Label } from '@gaqno-development/frontcore/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaqno-development/frontcore/components/ui';
import { ShieldCheck } from '@gaqno-development/frontcore/components/icons';
import { GeneratedAudioCard } from '../GeneratedAudioCard';
import { useAudioIsolationMutations } from '@/hooks/mutations/useAudioMutations';

export function AudioIsolationTab() {
  const { audioIsolation } = useAudioIsolationMutations();
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<'pcm_s16le_16' | 'other'>('other');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setAudioUrl(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      const r = await audioIsolation.mutateAsync({
        file,
        fileFormat: fileFormat === 'pcm_s16le_16' ? 'pcm_s16le_16' : undefined,
      });
      setAudioUrl(r.audioUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" size={20} />
            Audio Isolation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Removes background noise from audio.
          </p>
          <div>
            <Label>Input format (optional)</Label>
            <Select
              value={fileFormat}
              onValueChange={(v) => setFileFormat(v as 'pcm_s16le_16' | 'other')}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="other">other (default)</SelectItem>
                <SelectItem value="pcm_s16le_16">pcm_s16le_16 (16‑bit PCM, 16 kHz, mono)</SelectItem>
              </SelectContent>
            </Select>
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
            loading={audioIsolation.isPending}
            disabled={!file}
          >
            Isolate
          </Button>
        </CardContent>
      </Card>
      {audioUrl && <GeneratedAudioCard audioUrl={audioUrl} title="Isolated audio" />}
    </form>
  );
}
