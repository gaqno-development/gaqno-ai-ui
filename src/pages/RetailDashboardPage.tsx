"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import {
  useErpProducts,
  useCampaigns,
  useBillingSummary,
} from "@gaqno-development/frontcore/hooks/ai";
import {
  ShoppingBag,
  FileText,
  Film,
  Send,
  BarChart,
  CreditCard,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import type { ErpProduct } from "@gaqno-development/frontcore/utils/api";

const DEFAULT_TENANT = "00000000-0000-4000-a000-000000000000";

const WORKFLOW_STEPS = [
  { segment: "profile", label: "Perfil do Produto", icon: ShoppingBag },
  { segment: "content", label: "Texto Marketing", icon: FileText },
  { segment: "video", label: "Video Promocional", icon: Film },
  { segment: "distribution", label: "Publicar", icon: Send },
  { segment: "attribution", label: "Atribuicao GMV", icon: BarChart },
  { segment: "billing", label: "Faturamento", icon: CreditCard },
] as const;

export default function RetailDashboardPage() {
  const navigate = useNavigate();
  const [tenantId, setTenantId] = useState(DEFAULT_TENANT);
  const [selectedProduct, setSelectedProduct] = useState<ErpProduct | null>(
    null
  );

  const productsQuery = useErpProducts({ tenantId, limit: 50 });
  const campaignsQuery = useCampaigns(tenantId);
  const billingQuery = useBillingSummary(tenantId);

  const products = productsQuery.data ?? [];
  const campaigns = campaignsQuery.data ?? [];
  const billing = billingQuery.data;

  const gmvAttributed = billing?.gmv ?? 0;
  const campaignCount = campaigns.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Retail AI Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview, product selection, and quick actions for AI content and
          video.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              GMV attributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {billing?.currency ?? "BRL"}{" "}
              {(gmvAttributed as number).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{campaignCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products (ERP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selected product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium truncate">
              {selectedProduct?.name ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Select product</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose a product to generate profile, content, or video. Data comes
            from ERP.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label className="text-xs font-medium">Product</Label>
            <Select
              value={selectedProduct?.id ?? ""}
              onValueChange={(id) => {
                const p = products.find((x) => x.id === id) ?? null;
                setSelectedProduct(p);
              }}
              disabled={productsQuery.isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    productsQuery.isLoading ? "Loading…" : "Select a product"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/ai/retail/profile")}
              disabled={!selectedProduct}
            >
              Build profile
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/ai/retail/content")}
              disabled={!selectedProduct}
            >
              Generate content
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/ai/retail/video")}
            >
              Create video
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/ai/retail/distribution")}
            >
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Workflow
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Profile → Content → Video → Distribution → Attribution → Billing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW_STEPS.map((step, i) => (
              <Button
                key={step.segment}
                variant="outline"
                className="h-auto justify-between py-3 px-4"
                onClick={() => navigate(`/ai/retail/${step.segment}`)}
              >
                <span className="flex items-center gap-2">
                  <step.icon className="h-4 w-4 shrink-0" />
                  {step.label}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
