import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@gaqno-development/frontcore/components/ui';
import { Textarea } from '@gaqno-development/frontcore/components/ui';
import { useVideoModels, useVideoGeneration } from '@/hooks/videos';
import { VideoGenerationStatus } from '@/types/videos/video-types';
import { GenerationLoadingCard } from "@/components/shared";
import { RefreshCw, Loader2, Film } from 'lucide-react';
import { useGenerations } from '@/contexts/GenerationsContext';

export function TextToVideoTab() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [showConfirmNewDialog, setShowConfirmNewDialog] = useState(false);
  const { addJob } = useGenerations();

  const { data: models = [], isLoading: modelsLoading } = useVideoModels();
  const { generate, getStatus } = useVideoGeneration();
  const statusQuery = getStatus(jobId ?? '');

  const status = statusQuery.data;
  const isCompleted = status?.status === VideoGenerationStatus.COMPLETED;
  const isFailed = status?.status === VideoGenerationStatus.FAILED;
  const isProcessing =
    status?.status === VideoGenerationStatus.PROCESSING ||
    status?.status === VideoGenerationStatus.PENDING;

  const resetToForm = useCallback(() => setJobId(null), []);

  const startGeneration = useCallback(
    async (promptValue: string, modelValue: string) => {
      try {
        const data = await generate.mutateAsync({
          prompt: promptValue.trim(),
          model: modelValue,
        });
        const id = (data as { id?: string })?.id;
        if (id) {
          setJobId(id);
          addJob(id, 'video');
        }
      } catch {
        // Error is surfaced via generate.error or onMutation
      }
    },
    [generate, addJob]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || !selectedModel) return;
      if (jobId && isProcessing) {
        setShowConfirmNewDialog(true);
        return;
      }
      await startGeneration(prompt, selectedModel);
    },
    [prompt, selectedModel, jobId, isProcessing, startGeneration]
  );

  const handleConfirmNewGeneration = useCallback(() => {
    setShowConfirmNewDialog(false);
    setJobId(null);
    startGeneration(prompt, selectedModel);
  }, [prompt, selectedModel, startGeneration]);

  const isSubmitDisabled = !prompt.trim() || !selectedModel || generate.isPending;

  const resultContent = (
    <>
      {generate.isPending && !jobId && (
        <GenerationLoadingCard
          title="Iniciando geração"
          message="Aguarde enquanto a geração do vídeo é enviada."
        />
      )}
      {!jobId && !generate.isPending && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 p-8 text-center min-h-[200px]">
          <Film className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">O vídeo aparecerá aqui após a geração.</p>
        </div>
      )}
      {jobId && (
        <Card className="h-full flex flex-col min-h-0">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Geração do vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 min-h-0 flex flex-col pb-4">
            {statusQuery.isLoading && !status && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Carregando status...</span>
              </div>
            )}
            {status && isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                  <span>
                    {status?.progress != null
                      ? `Gerando vídeo... ${status.progress}%`
                      : 'Vídeo em processamento. Pode levar vários minutos.'}
                  </span>
                </div>
                {status?.progress != null && (
                  <Progress value={status.progress} className="h-1.5" />
                )}
                <p className="text-xs text-muted-foreground">
                  Não feche esta página.
                </p>
              </div>
            )}
            {isFailed && (
              <p className="text-sm text-destructive">
                {status?.error ?? 'Falha ao gerar o vídeo.'}
              </p>
            )}
            {isCompleted && status?.video_url && (
              <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                <div className="relative w-full rounded-lg overflow-hidden bg-black min-h-0 flex-1 flex items-center">
                  <video
                    src={status.video_url}
                    controls
                    className="w-full max-h-[40vh] object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={status.video_url} download>
                      Baixar
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={resetToForm}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Gerar novamente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <div className="h-full min-h-0 flex flex-col p-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:items-stretch">
      <Card className="flex flex-col min-h-0 shrink-0 lg:min-h-0">
        <CardHeader className="py-3">
          <CardTitle className="text-base">Texto para Vídeo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o vídeo que deseja gerar..."
                className="min-h-[80px] resize-y text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Modelo</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full max-w-[200px]">
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
          </form>
        </CardContent>
      </Card>

      <div className="min-h-0 flex flex-col flex-1 overflow-auto lg:min-h-0">
        {resultContent}
      </div>

      <AlertDialog open={showConfirmNewDialog} onOpenChange={setShowConfirmNewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Há um vídeo sendo gerado</AlertDialogTitle>
            <AlertDialogDescription>
              Uma geração ainda está em processamento. Se você iniciar uma nova
              geração, a atual continuará em segundo plano, mas apenas a nova
              geração aparecerá aqui. Deseja mesmo iniciar uma nova geração?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNewGeneration}>
              Sim, gerar novo vídeo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
