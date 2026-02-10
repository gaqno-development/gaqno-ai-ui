"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Label,
} from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { useBillingSummaryQuery } from "@/hooks/queries/useBillingQueries";

const DEFAULT_TENANT_ID = "00000000-0000-4000-a000-000000000000";

export function BillingSection() {
  const [tenantId, setTenantId] = useState(DEFAULT_TENANT_ID);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const summaryQuery = useBillingSummaryQuery(
    tenantId,
    from || undefined,
    to || undefined
  );
  const summary = summaryQuery.data;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">GMV-based billing</CardTitle>
          <Badge variant="outline" className="text-xs">
            GAQNO-1169
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Billing visibility: GMV aggregation and fee calculation from PDV.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Tenant ID</Label>
          <Input
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder={DEFAULT_TENANT_ID}
            className="max-w-md font-mono text-xs"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium">From (optional, ISO)</Label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">To (optional, ISO)</Label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        {summaryQuery.isLoading && !summary && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
        {summaryQuery.isError && (
          <p className="text-sm text-destructive">
            {(summaryQuery.error as Error)?.message ??
              "Failed to load summary."}
          </p>
        )}
        {summary && (
          <div className="space-y-2 rounded-md border p-3 text-sm">
            {summary.sourceAvailable === false && (
              <p className="text-amber-600 dark:text-amber-500 text-xs font-medium">
                Source temporarily unavailable. GMV and fee may show zero.
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Period: </span>
                <strong>
                  {new Date(summary.period.from).toLocaleDateString()} –{" "}
                  {new Date(summary.period.to).toLocaleDateString()}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">GMV: </span>
                <strong>
                  {summary.currency}{" "}
                  {summary.gmv.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">Transactions: </span>
                <strong>{summary.transactionCount}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Fee ({summary.feeRatePercent}%):{" "}
                </span>
                <strong>
                  {summary.currency}{" "}
                  {summary.feeAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </div>
            {summary.summaryExplanation && (
              <p className="text-muted-foreground text-xs mt-2">
                {summary.summaryExplanation}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
