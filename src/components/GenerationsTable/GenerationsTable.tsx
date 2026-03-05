import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { useGenerations } from "@/contexts/GenerationsContext";
import { ImageGenerationRow } from "./ImageGenerationRow";
import { VideoGenerationRow } from "./VideoGenerationRow";
import type { GenerationJob } from "@/contexts/GenerationsContext";

function GenerationRow({ job, onRemove }: { job: GenerationJob; onRemove: (id: string) => void }) {
  if (job.type === "image") return <ImageGenerationRow job={job} onRemove={onRemove} />;
  if (job.type === "video") return <VideoGenerationRow job={job} onRemove={onRemove} />;
  return null;
}

export function GenerationsTable() {
  const { jobs, removeJob } = useGenerations();

  if (jobs.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <CardTitle className="text-base">Gerações em andamento</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" aria-label="Tipo ícone" />
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Progresso</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead className="w-10" aria-label="Ações" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <GenerationRow key={job.id} job={job} onRemove={removeJob} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
