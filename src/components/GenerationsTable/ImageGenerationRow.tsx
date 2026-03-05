import React from "react";
import { useLocalTaskStatus } from "@/hooks/useLocalTaskStatus";
import {
  TableCell,
  TableRow,
  Progress,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { Image, Loader2, X, CheckCircle, XCircle } from "lucide-react";
import type { TaskStatusResponse } from "@/utils/api/aiApi";
import type { GenerationJob } from "@/contexts/GenerationsContext";

interface ImageGenerationRowProps {
  job: GenerationJob;
  onRemove: (id: string) => void;
}

export function ImageGenerationRow({ job, onRemove }: ImageGenerationRowProps) {
  const { data, isLoading } = useLocalTaskStatus(job.id);
  const status = (data as TaskStatusResponse | undefined)?.status;
  const result = (data as TaskStatusResponse | undefined)?.result;
  const price = (data as TaskStatusResponse | undefined)?.price;
  const error = (data as TaskStatusResponse | undefined)?.error;

  const isTerminal = status === "completed" || status === "failed" || status === "error";
  const progress =
    status === "processing" || status === "pending" ? 50 : isTerminal ? 100 : 0;

  const typeLabel = "Imagem";
  const pointsLabel = price != null ? String(price) : "—";

  return (
    <TableRow>
      <TableCell className="w-10">
        <Image className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{typeLabel}</TableCell>
      <TableCell>
        {isLoading && !data && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Carregando...
          </span>
        )}
        {data && !isTerminal && (
          <span className="flex items-center gap-1.5 text-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Processando
          </span>
        )}
        {status === "completed" && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-3.5 w-3.5" />
            Concluído
          </span>
        )}
        {(status === "failed" || status === "error") && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            Falha
          </span>
        )}
      </TableCell>
      <TableCell className="w-24">
        <Progress value={progress} className="h-1.5" />
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
