import React from "react";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { BulbSvg } from "@gaqno-development/frontcore/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { usePromptTextarea } from "@/hooks/usePromptTextarea";
import type { PromptTextareaProps } from "./types";

export const PromptTextarea: React.FC<PromptTextareaProps> = ({
  value,
  onChange,
  placeholder = "Describe the changes you want to make to the video...",
  className,
}) => {
  const { isOpen, onOpenChange, handleExampleClick, PROMPT_EXAMPLES } =
    usePromptTextarea(onChange);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Prompt</label>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <BulbSvg className="h-4 w-4 mr-2" size={16} />
              Prompt Examples
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Prompt Examples</DialogTitle>
              <DialogDescription>
                Click on an example to use it as your prompt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {PROMPT_EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-y"
      />
    </div>
  );
};
