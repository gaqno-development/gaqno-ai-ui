import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import {
  SparklesIcon,
  CheckedIcon,
  XIcon,
  RefreshIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Loader2 } from "lucide-react";
import { useAISuggestionPopover } from "@/hooks/useAISuggestionPopover";
import type { AISuggestionPopoverProps } from "./types";

export function AISuggestionPopover({
  onGenerate,
  onAccept,
  trigger,
  disabled = false,
}: AISuggestionPopoverProps) {
  const {
    open,
    onOpenChange,
    isGenerating,
    suggestion,
    error,
    handleGenerate,
    handleAccept,
    handleGenerateAnother,
    handleClose,
  } = useAISuggestionPopover(onGenerate, onAccept);

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      disabled={disabled}
    >
      <SparklesIcon className="h-4 w-4" size={16} />
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary" size={16} />
            <h4 className="font-semibold text-sm">Sugestão com IA</h4>
          </div>

          {!suggestion && !isGenerating && !error && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Clique em &quot;Gerar&quot; para obter uma sugestão da IA.
              </p>
              <Button
                onClick={handleGenerate}
                size="sm"
                className="w-full"
                disabled={disabled}
              >
                Gerar Sugestão
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Gerando sugestão...
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                onClick={handleGenerate}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {suggestion && !isGenerating && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm whitespace-pre-wrap">{suggestion}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAccept} size="sm" className="flex-1">
                  <CheckedIcon className="h-4 w-4 mr-2" size={16} />
                  Usar
                </Button>
                <Button
                  onClick={handleGenerateAnother}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshIcon className="h-4 w-4 mr-2" size={16} />
                  Gerar Outra
                </Button>
                <Button onClick={handleClose} size="sm" variant="ghost">
                  <XIcon className="h-4 w-4" size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
