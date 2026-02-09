"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { useProductContentGenerateMutation } from "@/hooks/mutations/useProductContentMutations";
import type { GenerateContentProductInput } from "@/utils/api/aiApi";

const SAMPLE_PRODUCT: GenerateContentProductInput = {
  id: "22222222-2222-4222-a222-222222222221",
  name: "Sample Product A",
  price: 29.9,
  tenantId: "11111111-1111-4111-a111-111111111111",
};

export function ProductContentSection() {
  const [reviewCopy, setReviewCopy] = useState("");
  const { generate } = useProductContentGenerateMutation();

  const handleGenerate = () => {
    generate.mutate({ product: SAMPLE_PRODUCT });
  };

  const result = generate.data;
  const isLoading = generate.isPending;
  const error = generate.isError ? (generate.error as Error)?.message : null;

  useEffect(() => {
    if (result?.copy != null) setReviewCopy(result.copy);
  }, [result?.copy]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI text content generation</CardTitle>
          <Badge variant="outline" className="text-xs">
            GAQNO-1165
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Generate marketing copy from product data. Assumptions are listed for
          manual review.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button size="sm" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "Generating…" : "Generate copy"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Using sample product: {SAMPLE_PRODUCT.name} (price {SAMPLE_PRODUCT.price}).
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && result.assumptions.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs font-medium">Assumptions</Label>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {result.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
        {result && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Copy (editable for review)</Label>
            <Textarea
              value={reviewCopy}
              onChange={(e) => setReviewCopy(e.target.value)}
              placeholder="Generated copy will appear here"
              className="min-h-[80px] text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
