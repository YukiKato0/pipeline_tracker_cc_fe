"use client";

import { Eye, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  ContentMetricSnapshot,
  ContentMetricValues,
} from "@/features/contents/types/content-detail";
import { formatNumber } from "@/lib/utils";
import { ContentMetricCard } from "@/features/contents/components/content-metric-card";

export interface ContentDetailMetricsProps {
  metrics: ContentMetricValues[];
  metricHistory: ContentMetricSnapshot[];
  onOpenMetricDialog: () => void;
  recordMetricSlot?: React.ReactNode;
}

export function ContentDetailMetrics({
  metricHistory,
  recordMetricSlot,
}: ContentDetailMetricsProps) {
  const latestSnapshot = metricHistory[0] || null;

  return (
    <section aria-labelledby="metrics-title" className="rounded-lg border border-studio-card-border bg-card/90 p-5.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-[9px] font-bold tracking-[0.14em] text-studio-label-muted">PERFORMANCE</p>
          <h2 className="m-0 text-[16px] font-semibold text-studio-title-secondary" id="metrics-title">Analytics snapshots</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="h-8 border-studio-pill-border bg-studio-pill-bg text-xs text-studio-pill-text" variant="outline">
            {metricHistory.length} SNAPSHOTS
          </Badge>
          {recordMetricSlot}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 max-[640px]:grid-cols-2">
        <div className="flex flex-col rounded-md border border-studio-card-border-subtle bg-studio-card-header p-3">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Eye size={12} aria-hidden="true" />
            Views
          </span>
          <span className="mt-1 text-base font-semibold text-studio-title-secondary tabular-nums">
            {latestSnapshot ? formatNumber(latestSnapshot.views_count) : "0"}
          </span>
        </div>

        <div className="flex flex-col rounded-md border border-studio-card-border-subtle bg-studio-card-header p-3">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <ThumbsUp size={12} aria-hidden="true" />
            Likes
          </span>
          <span className="mt-1 text-base font-semibold text-studio-title-secondary tabular-nums">
            {latestSnapshot ? formatNumber(latestSnapshot.likes_count) : "0"}
          </span>
        </div>

        <div className="flex flex-col rounded-md border border-studio-card-border-subtle bg-studio-card-header p-3">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <MessageSquare size={12} aria-hidden="true" />
            Comments
          </span>
          <span className="mt-1 text-base font-semibold text-studio-title-secondary tabular-nums">
            {latestSnapshot ? formatNumber(latestSnapshot.comments_count) : "0"}
          </span>
        </div>

        <div className="flex flex-col rounded-md border border-studio-card-border-subtle bg-studio-card-header p-3">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Share2 size={12} aria-hidden="true" />
            Shares
          </span>
          <span className="mt-1 text-base font-semibold text-studio-title-secondary tabular-nums">
            {latestSnapshot ? formatNumber(latestSnapshot.shares_count) : "0"}
          </span>
        </div>
      </div>

      <div className="mt-4.5 space-y-2.5 min-[641px]:hidden">
        {metricHistory.length === 0 ? (
          <p className="py-6 text-center text-[11px] text-muted-foreground">
            No metric snapshots have been recorded yet.
          </p>
        ) : (
          metricHistory.map((item) => (
            <ContentMetricCard key={String(item.id)} snapshot={item} />
          ))
        )}
      </div>

      <div className="mt-4.5 hidden overflow-x-auto min-[641px]:block">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-studio-card-border-subtle bg-studio-card-header text-left text-[9px] font-semibold uppercase tracking-wider text-studio-label-muted">
              <th className="px-3 py-2">Recorded at</th>
              <th className="px-3 py-2 text-right">Views</th>
              <th className="px-3 py-2 text-right">Likes</th>
              <th className="px-3 py-2 text-right">Comments</th>
              <th className="px-3 py-2 text-right">Shares</th>
            </tr>
          </thead>
          <tbody>
            {metricHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No metric snapshots have been recorded yet.
                </td>
              </tr>
            ) : (
              metricHistory.map((item) => (
                <tr key={String(item.id)} className="border-b border-studio-card-border-subtle transition-colors hover:bg-studio-card-header">
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                    {item.recorded_at.slice(0, 10)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-studio-title-secondary">{formatNumber(item.views_count)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-studio-title-secondary">{formatNumber(item.likes_count)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-studio-title-secondary">{formatNumber(item.comments_count)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-studio-title-secondary">{formatNumber(item.shares_count)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

