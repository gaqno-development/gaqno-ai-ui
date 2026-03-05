import React from "react";
import { useVideoGenerationQueries } from "@/hooks/queries/useVideoQueries";
import {
  TableCell,
  TableRow,
  Progress,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { Video, Loader2, X, CheckCircle, XCircle } from "lucide-react";
import { VideoGenerationStatus } from "@/types/videos/video-types";
import type { GenerationJob } from "@/contexts/GenerationsContext";

interface VideoStatusData {
  status?: string;
  progress?: number;
  video_url?: string;
  error?: string;
}

interface VideoGenerationRowProps {
  job: GenerationJob;
  onRemove: (id: string) => void;
}

export function VideoGenerationRow({ job, onRemove }: VideoGenerationRowProps) {
  const { getStatus } = useVideoGenerationQueries();
  const statusQuery = getStatus(job.id);
  const status = (statusQuery.data as VideoStatusData | undefined)?.status;
  const progress = (statusQuery.data as VideoStatusData | undefined)?.progress ?? 0;
  const error = (statusQuery.data as VideoStatusData | undefined)?.error;

  const isCompleted = status === VideoGenerationStatus.COMPLETED;
  const isFailed = status === VideoGenerationStatus.FAILED;
  const isProcessing =
    status === VideoGenerationStatus.PROCESSING ||
    status === VideoGenerationStatus.PENDING;
  const isTerminal = isCompleted || isFailed;

  const progressValue = isTerminal ? 100 : progress;
  const typeLabel = "Vídeo";
  const pointsLabel = "—";

  return (
    <TableRow>
      <TableCell className="w-10">
        <Video className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{typeLabel}</TableCell>
      <TableCell>
        {statusQuery.isLoading && !statusQuery.data && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Carregando...
          </span>
        )}
        {statusQuery.data && isProcessing && (
          <span className="flex items-center gap-1.5 text-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            {progress != null ? `${progress}%` : "Processando"}
          </span>
        )}
        {isCompleted && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-3.5 w-3.5" />
            Concluído
          </span>
        )}
        {isFailed && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            {error ?? "Falha"}
          </span>
        )}
      </TableCell>
      <TableCell className="w-24">
        <Progress value={progressValue} className="h-1.5" />
      </TableCell>
      <TableCell className="tabular-nums text-muted-foreground">{pointsLabel}</TableCell>
      <TableCell className="w-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onRemove(job.id)}
          aria-label="Remover da lista"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
