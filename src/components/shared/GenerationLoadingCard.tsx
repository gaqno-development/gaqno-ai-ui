import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@gaqno-development/frontcore/components/ui";
import { Spinner } from "@gaqno-development/frontcore/components/ui";
import { cn } from "@gaqno-development/frontcore/lib/utils";

export interface GenerationLoadingCardProps {
  title?: string;
  message?: string;
  progress?: number | null;
  className?: string;
}

const DEFAULT_TITLE = "Gerando...";
const DEFAULT_MESSAGE = "Aguarde enquanto o conteúdo é gerado.";

export function GenerationLoadingCard({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  progress = null,
  className,
}: GenerationLoadingCardProps) {
  const showProgress =
    progress != null &&
    Number.isFinite(progress) &&
    progress >= 0 &&
    progress <= 100;

  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/10 bg-gradient-to-b from-muted/40 to-muted/20 shadow-sm",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium tracking-tight text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pb-8 pt-0">
        <div className="relative flex items-center justify-center">
          <span
            className="absolute size-14 animate-ping rounded-full bg-primary/20"
            aria-hidden
          />
          <div className="relative flex size-16 items-center justify-center rounded-full bg-background/80 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <Spinner className="size-8 text-primary" />
          </div>
        </div>
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          {message}
        </p>
        {showProgress && (
          <div className="w-full max-w-xs space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
