import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { XIcon } from "@gaqno-development/frontcore/components/icons";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@gaqno-development/frontcore/lib/utils";
import { useReferenceInputs } from "@/hooks/useReferenceInputs";
import type { ReferenceInputsProps } from "./types";

export const ReferenceInputs: React.FC<ReferenceInputsProps> = ({
  referenceImage,
  onImageSelect,
  className,
}) => {
  const { imageUrl, handleFileInput, handleRemove } = useReferenceInputs(
    referenceImage,
    onImageSelect
  );
  const isCompact = className?.includes("compact");

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader className={isCompact ? "py-2" : undefined}>
          <CardTitle className="text-sm font-medium">Imagem de referência</CardTitle>
        </CardHeader>
        <CardContent className={isCompact ? "pt-0" : undefined}>
          {referenceImage && imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Reference"
                className={cn(
                  "w-full rounded-lg object-cover",
                  isCompact ? "max-h-[120px]" : "max-h-[200px]"
                )}
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background border shadow-sm"
                aria-label="Remove image"
              >
                <XIcon className="h-4 w-4" size={16} />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors",
                isCompact ? "py-4" : "py-8"
              )}
            >
              <ImageIcon className={cn("text-muted-foreground mb-2", isCompact ? "h-5 w-5" : "h-6 w-6")} />
              <span className="text-sm text-muted-foreground">
                Upload Reference Image
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                JPG/PNG
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
