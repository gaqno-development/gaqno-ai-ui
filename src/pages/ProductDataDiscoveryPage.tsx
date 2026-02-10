import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Badge } from "@gaqno-development/frontcore/components/ui";
import { useErpProductsQueries } from "@/hooks/queries/useErpProductsQueries";
import { ProductProfileSection } from "@/components/ProductProfileSection";
import { ProductContentSection } from "@/components/ProductContentSection";
import { VideoTemplateSection } from "@/components/VideoTemplateSection";
import { DistributionSection } from "@/components/DistributionSection";
import { AttributionSection } from "@/components/AttributionSection";
import { BillingSection } from "@/components/BillingSection";

const INVENTORY = {
  pdv: {
    service: "gaqno-pdv-service",
    sourceOfTruth: true,
    fields: [
      { name: "id", type: "UUID", required: true },
      { name: "tenantId", type: "UUID", required: true },
      { name: "name", type: "string", required: true },
      { name: "description", type: "text", required: false },
      { name: "price", type: "numeric(10,2)", required: true },
      { name: "stock", type: "integer", required: true },
      { name: "sku", type: "string", required: false },
      { name: "createdAt", type: "timestamp", required: true },
      { name: "updatedAt", type: "timestamp", required: true },
    ],
    gapsForAi: ["category", "images", "marketingCopy", "tags"],
  },
  erp: {
    service: "gaqno-ai-service (GET /erp/products)",
    sourceOfTruth: false,
    fields: [
      { name: "id", type: "UUID", required: true },
      { name: "tenantId", type: "UUID", required: true },
      { name: "name", type: "string", required: true },
      { name: "price", type: "number", required: true },
      { name: "category", type: "string", required: false },
      { name: "imageUrls", type: "string[]", required: false },
    ],
    gapsForAi: ["description", "sku", "stock", "marketingCopy", "tags"],
  },
  crm: {
    service: "gaqno-crm-ui (no backend)",
    sourceOfTruth: false,
    fields: [],
    gapsForAi: ["customerSegments", "buyerPersona", "productLink"],
  },
} as const;

export function ProductDataDiscoveryPage() {
  const { getProducts } = useErpProductsQueries({ limit: 20 });
  const products = getProducts.data ?? [];
  const isLoading = getProducts.isLoading;
  const isError = getProducts.isError;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Product data inventory</h2>
        <p className="text-sm text-muted-foreground">
          AI Content Engine – discovery (Epic GAQNO-1159). Source: PDV, ERP,
          CRM.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {(
          Object.entries(INVENTORY) as [
            keyof typeof INVENTORY,
            (typeof INVENTORY)[keyof typeof INVENTORY],
          ][]
        ).map(([system, data]) => (
          <Card key={system}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base uppercase">{system}</CardTitle>
                {data.sourceOfTruth && (
                  <Badge variant="secondary" className="text-xs">
                    Source of truth
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{data.service}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Fields: </span>
                {data.fields.length > 0
                  ? data.fields.map((f) => f.name).join(", ")
                  : "none"}
              </div>
              <div>
                <span className="font-medium">Gaps for AI: </span>
                <span className="text-muted-foreground">
                  {data.gapsForAi.join(", ")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProductProfileSection />
      <ProductContentSection />
      <VideoTemplateSection />
      <DistributionSection />
      <AttributionSection />
      <BillingSection />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">ERP products (live)</CardTitle>
            <Badge variant="outline" className="text-xs">
              GET /erp/products
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Sample from gaqno-ai-service. Contract-aligned (GAQNO-1162).
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {isLoading && (
            <p className="text-muted-foreground">Loading products…</p>
          )}
          {isError && (
            <p className="text-destructive">Failed to load ERP products.</p>
          )}
          {!isLoading && !isError && (
            <>
              <p>
                <span className="font-medium">Count: </span>
                {products.length}
              </p>
              {products.length > 0 && (
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  {products.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      {p.name} — {p.price} {p.category ? `(${p.category})` : ""}
                    </li>
                  ))}
                  {products.length > 5 && (
                    <li>… and {products.length - 5} more</li>
                  )}
                </ul>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Product Data Contract (MVP)
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              v1.0.0
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Standardized schema for AI input. Validation rules in workspace.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Required: </span>
            <span className="text-muted-foreground">
              id, name, price, tenantId (UUIDs for id/tenantId)
            </span>
          </div>
          <div>
            <span className="font-medium">Optional: </span>
            <span className="text-muted-foreground">
              description, sku, stock
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Schema: docs/ai-content/product-data-contract-v1.md. Validate:
            scripts/product-data-contract-validate.mjs
          </p>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Full inventory: docs/ai-content/product-data-inventory.md (workspace).
      </p>
    </div>
  );
}
