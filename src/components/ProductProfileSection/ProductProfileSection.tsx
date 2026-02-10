"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { useProductProfileBuildMutation } from "@/hooks/mutations/useProductProfileMutations";
import type { ProductProfileRequestProduct } from "@/utils/api/aiApi";

const SAMPLE_PRODUCT: ProductProfileRequestProduct = {
  id: "22222222-2222-4222-a222-222222222221",
  name: "Sample Product A",
  price: 29.9,
  tenantId: "11111111-1111-4111-a111-111111111111",
};

function formatValue(value: string | string[] | number | null): string {
  if (value === null) return "—";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "number") return String(value);
  return value;
}

export function ProductProfileSection() {
  const [inferMissing, setInferMissing] = useState(true);
  const { build } = useProductProfileBuildMutation();

  const handleBuild = () => {
    build.mutate({
      product: SAMPLE_PRODUCT,
      inferMissing,
    });
  };

  const result = build.data;
  const isLoading = build.isPending;
  const error = build.isError ? (build.error as Error)?.message : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Product semantic profile</CardTitle>
          <Badge variant="outline" className="text-xs">
            GAQNO-1164
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Build a profile from contract-aligned product data. Optional AI
          inference for missing category and marketingCopy.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="infer-missing"
            type="checkbox"
            checked={inferMissing}
            onChange={(e) => setInferMissing(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <Label
            htmlFor="infer-missing"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Infer missing attributes (category, marketingCopy)
          </Label>
          <Button size="sm" onClick={handleBuild} disabled={isLoading}>
            {isLoading ? "Building…" : "Build profile"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Using sample product: {SAMPLE_PRODUCT.name} (price{" "}
          {SAMPLE_PRODUCT.price}).
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-3 rounded-md border p-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Overall confidence:</span>
              <Badge variant="secondary">{result.overallConfidence}</Badge>
            </div>
            <div className="grid gap-2">
              {Object.entries(result.profile).map(([key, field]) => (
                <div key={key} className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">
                    {formatValue(field.value)}
                  </span>
                  <Badge
                    variant={
                      field.source === "inferred" ? "outline" : "secondary"
                    }
                    className="text-xs"
                  >
                    {field.source} ({field.confidence})
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
