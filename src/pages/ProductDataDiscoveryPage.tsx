import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Badge } from "@gaqno-development/frontcore/components/ui";

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
    service: "gaqno-erp-ui (no backend)",
    sourceOfTruth: false,
    fields: [],
    gapsForAi: ["name", "price", "category", "images", "api"],
  },
  crm: {
    service: "gaqno-crm-ui (no backend)",
    sourceOfTruth: false,
    fields: [],
    gapsForAi: ["customerSegments", "buyerPersona", "productLink"],
  },
} as const;

export function ProductDataDiscoveryPage() {
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
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Product Data Contract (MVP)</CardTitle>
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
