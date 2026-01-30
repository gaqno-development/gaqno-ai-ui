import React, { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Label } from '@gaqno-development/frontcore/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaqno-development/frontcore/components/ui';
import { Mic, Upload } from 'lucide-react';
import { useTranscribeMutations } from '@/hooks/mutations/useAudioMutations';
import { useRealtimeStt } from '@/hooks/audio';
import { startRealtimePcmCapture } from '@/utils/audio/pcmCapture';
import { VoiceLevelBars } from './VoiceLevelBars';

export function SttTab() {
  const { transcribe } = useTranscribeMutations();
  const [file, setFile] = useState<File | null>(null);
  const [modelId, setModelId] = useState<'scribe_v1' | 'scribe_v2'>('scribe_v2');
  const [result, setResult] = useState<{ text: string; language_code?: string } | null>(null);

  const rt = useRealtimeStt();
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopPcmCaptureRef = useRef<(() => void) | null>(null);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult(null);
  }, []);

  const onTranscribe = async () => {
    if (!file) return;
    try {
      const r = await transcribe.mutateAsync({ file, params: { model_id: modelId } });
      setResult({ text: r.text, language_code: r.language_code });
    } catch (e) {
      console.error(e);
    }
  };

  const startRealtime = async () => {
    setRealtimeMode(true);
    setResult(null);
    try {
      await rt.connect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          streamRef.current = stream;
          setMediaStream(stream);
          stopPcmCaptureRef.current = startRealtimePcmCapture(stream, rt.sendChunk);
        }).catch((e) => {
          console.error(e);
          rt.disconnect();
          setRealtimeMode(false);
        });
      });
    } catch (e) {
      rt.disconnect();
      setRealtimeMode(false);
      console.error(e);
    }
  };

  const stopRealtime = () => {
    stopPcmCaptureRef.current?.();
    stopPcmCaptureRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setMediaStream(null);
    rt.commit();
    setTimeout(() => {
      rt.disconnect();
      setRealtimeMode(false);
      if (rt.committedTranscript) setResult({ text: rt.committedTranscript });
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Speech to Text (file)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Model</Label>
            <Select value={modelId} onValueChange={(v) => setModelId(v as 'scribe_v1' | 'scribe_v2')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scribe_v1">Scribe v1</SelectItem>
                <SelectItem value="scribe_v2">Scribe v2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Audio file</Label>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={onFileChange}
              className="block w-full text-sm border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
            />
          </div>
          <Button
            onClick={onTranscribe}
            disabled={!file || transcribe.isPending}
            loading={transcribe.isPending}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Transcribe
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Realtime (microphone)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!realtimeMode ? (
            <Button onClick={startRealtime} className="w-full">
              <Mic className="w-4 h-4 mr-2 inline" />
              Start
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <VoiceLevelBars stream={mediaStream} className="flex-1" />
                <Button onClick={stopRealtime} variant="destructive" size="sm">
                  Stop
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {mediaStream ? 'Speaking…' : 'Connecting…'}
              </p>
            </>
          )}
          {rt.partialTranscript && <p className="text-sm text-muted-foreground">Partial: {rt.partialTranscript}</p>}
          {rt.committedTranscript && <p className="text-sm">Committed: {rt.committedTranscript}</p>}
          {rt.error && <p className="text-sm text-destructive">{rt.error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader><CardTitle>Transcript</CardTitle></CardHeader>
          <CardContent>
            {result.language_code && <p className="text-sm text-muted-foreground mb-2">Language: {result.language_code}</p>}
            <p className="whitespace-pre-wrap">{result.text}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
