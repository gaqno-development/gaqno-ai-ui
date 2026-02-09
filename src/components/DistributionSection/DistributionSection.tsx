"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Label,
} from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { usePublishDistributionMutation } from "@/hooks/mutations/useDistributionMutations";
import { useDistributionStatusQuery } from "@/hooks/queries/useDistributionQueries";

export function DistributionSection() {
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [distributionId, setDistributionId] = useState("");

  const publish = usePublishDistributionMutation();
  const statusQuery = useDistributionStatusQuery(distributionId);
  const status = statusQuery.data;

  const handlePublish = useCallback(() => {
    if (!to.trim() || !text.trim()) return;
    publish.mutate(
      {
        to: to.trim(),
        channelType: "whatsapp",
        content: { text: text.trim() },
      },
      {
        onSuccess: (data) => {
          if (data?.id) setDistributionId(data.id);
        },
      }
    );
  }, [to, text, publish]);

  const canPublish =
    to.trim().length > 0 && text.trim().length > 0 && !publish.isPending;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Omnichannel distribution (WhatsApp)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            GAQNO-1167
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Manual publish to WhatsApp. Delivery confirmation when available.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Recipient (phone)</Label>
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="5511999999999"
            className="max-w-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">Content (text)</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste product copy or message to send"
            className="min-h-[80px] text-sm"
          />
        </div>
        <Button size="sm" onClick={handlePublish} disabled={!canPublish}>
          {publish.isPending ? "Publishing…" : "Publish to WhatsApp"}
        </Button>
        {publish.isError && (
          <p className="text-sm text-destructive">
            {(publish.error as Error)?.message ?? "Publish failed."}
          </p>
        )}
        {distributionId && (
          <div className="space-y-2 rounded-md border p-3">
            <Label className="text-xs font-medium">Delivery status</Label>
            {statusQuery.isLoading && !status && (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
            {status && (
              <p className="text-sm">
                Status: <strong>{status.status}</strong>
                {status.deliveredAt && (
                  <span className="text-muted-foreground">
                    {" "}
                    · Delivered {new Date(status.deliveredAt).toLocaleString()}
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
