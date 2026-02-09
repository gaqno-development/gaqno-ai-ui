"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Label,
} from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { useVideoTemplatesQueries } from "@/hooks/queries/useVideoQueries";
import { useVideoMutations } from "@/hooks/mutations/useVideoMutations";
import { useVideoGenerationQueries } from "@/hooks/queries/useVideoQueries";
import { VideoGenerationStatus } from "@/types/videos/video-types";

export function VideoTemplateSection() {
  const [templateId, setTemplateId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [generationId, setGenerationId] = useState("");

  const { getAll: templatesQuery } = useVideoTemplatesQueries();
  const { generateFromTemplate } = useVideoMutations();
  const { getStatus } = useVideoGenerationQueries();
  const statusQuery = getStatus(generationId);

  const templates = templatesQuery.data ?? [];
  const status = statusQuery.data as
    | { status?: string; video_url?: string; error?: string; progress?: number }
    | undefined;
  const isCompleted = status?.status === VideoGenerationStatus.COMPLETED;
  const isFailed = status?.status === VideoGenerationStatus.FAILED;
  const isProcessing =
    status?.status === VideoGenerationStatus.PROCESSING ||
    status?.status === VideoGenerationStatus.PENDING;

  const handleGenerate = useCallback(() => {
    if (!templateId.trim()) return;
    generateFromTemplate.mutate(
      {
        templateId: templateId.trim(),
        product:
          productName.trim() || productDescription.trim()
            ? {
                name: productName.trim() || undefined,
                description: productDescription.trim() || undefined,
              }
            : undefined,
      },
      {
        onSuccess: (data: { id?: string }) => {
          if (data?.id) setGenerationId(data.id);
        },
      }
    );
  }, [templateId, productName, productDescription, generateFromTemplate]);

  const canGenerate = !!templateId.trim() && !generateFromTemplate.isPending;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            AI video from template (experimental)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            GAQNO-1166
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose a template, optional product name/description, then generate.
          Preview before publishing.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Template</Label>
          <Select
            value={templateId}
            onValueChange={setTemplateId}
            disabled={templatesQuery.isLoading}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue
                placeholder={
                  templatesQuery.isLoading
                    ? "Loading templates…"
                    : "Select a template"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">Product name (optional)</Label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name"
            className="max-w-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Product description (optional)
          </Label>
          <Input
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Short description"
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleGenerate} disabled={!canGenerate}>
            {generateFromTemplate.isPending ? "Starting…" : "Generate video"}
          </Button>
          {(isCompleted || isFailed) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setGenerationId("")}
            >
              Generate another
            </Button>
          )}
        </div>
        {generateFromTemplate.isError && (
          <p className="text-sm text-destructive">
            {(generateFromTemplate.error as Error)?.message ??
              "Failed to start generation."}
          </p>
        )}
        {generationId && (
          <div className="space-y-2 rounded-md border p-3">
            <Label className="text-xs font-medium">Generation status</Label>
            {statusQuery.isLoading && !status && (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
            {isProcessing && (
              <p className="text-sm text-muted-foreground">
                Processing…{" "}
                {status?.progress != null ? `${status.progress}%` : ""}
              </p>
            )}
            {isFailed && (
              <p className="text-sm text-destructive">
                {status?.error ?? "Generation failed."}
              </p>
            )}
            {isCompleted && status?.video_url && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Preview before publishing:
                </p>
                <video
                  src={status.video_url}
                  controls
                  className="w-full max-w-lg rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
