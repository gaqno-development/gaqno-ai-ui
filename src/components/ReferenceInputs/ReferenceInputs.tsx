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

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reference Image</CardTitle>
        </CardHeader>
        <CardContent>
          {referenceImage && imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Reference"
                className="w-full rounded-lg max-h-[200px] object-cover"
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
            <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
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
