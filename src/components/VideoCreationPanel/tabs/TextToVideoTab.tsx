import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaqno-development/frontcore/components/ui';
import { PromptTextarea } from '../../PromptTextarea';
import { useVideoModels, useVideoGeneration } from '@/hooks/videos';
import { VideoGenerationStatus } from '@/types/videos/video-types';

export function TextToVideoTab() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  const { data: models = [], isLoading: modelsLoading } = useVideoModels();
  const { generate, getStatus } = useVideoGeneration();
  const statusQuery = getStatus(jobId ?? '');

  const status = statusQuery.data;
  const isCompleted = status?.status === VideoGenerationStatus.COMPLETED;
  const isFailed = status?.status === VideoGenerationStatus.FAILED;
  const isProcessing = status?.status === VideoGenerationStatus.PROCESSING || status?.status === VideoGenerationStatus.PENDING;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || !selectedModel) return;
      try {
        const data = await generate.mutateAsync({ prompt: prompt.trim(), model: selectedModel });
        setJobId(data.id);
      } catch {
        // Error is surfaced via generate.error or onMutation
      }
    },
    [prompt, selectedModel, generate]
  );

  const isSubmitDisabled = !prompt.trim() || !selectedModel || generate.isPending;

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Texto para Vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PromptTextarea
              value={prompt}
              onChange={setPrompt}
              placeholder="Descreva o vídeo que deseja gerar..."
            />
            <div>
              <label className="text-sm font-medium mb-2 block">Modelo</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={modelsLoading ? 'Carregando...' : 'Selecione o modelo'} />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {generate.isError && (
              <p className="text-sm text-destructive">
                {generate.error instanceof Error ? generate.error.message : 'Erro ao gerar vídeo.'}
              </p>
            )}
            <Button type="submit" className="w-full" loading={generate.isPending} disabled={isSubmitDisabled}>
              Gerar vídeo
            </Button>
          </CardContent>
        </Card>
      </form>

      {jobId && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {statusQuery.isLoading && !status && <p className="text-muted-foreground">Carregando...</p>}
            {isProcessing && (
              <p className="text-muted-foreground">
                Processando... {status?.progress != null ? `${status.progress}%` : ''}
              </p>
            )}
            {isFailed && (
              <p className="text-destructive">{status?.error ?? 'Falha ao gerar o vídeo.'}</p>
            )}
            {isCompleted && status?.video_url && (
              <div className="space-y-2">
                <video src={status.video_url} controls className="w-full max-w-lg rounded-lg" />
                <a href={status.video_url} download className="text-sm underline">
                  Baixar
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
