import { CalendarDays, Eye, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import type { ContentMetricSnapshot } from "@/features/contents/types/content-detail";
import { formatNumber } from "@/lib/utils";

export interface ContentMetricCardProps {
  snapshot: ContentMetricSnapshot;
}

export function ContentMetricCard({ snapshot }: ContentMetricCardProps) {
  const metrics = [
    { label: "Views", value: snapshot.views_count, Icon: Eye },
    { label: "Likes", value: snapshot.likes_count, Icon: ThumbsUp },
    { label: "Comments", value: snapshot.comments_count, Icon: MessageSquare },
    { label: "Shares", value: snapshot.shares_count, Icon: Share2 },
  ];

  return (
    <article className="rounded-md border border-studio-card-border-subtle bg-studio-card-header p-3.5">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
        <CalendarDays size={13} aria-hidden="true" />
        <time dateTime={snapshot.recorded_at}>{snapshot.recorded_at.slice(0, 10)}</time>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
        {metrics.map(({ label, value, Icon }) => (
          <div className="min-w-0" key={label}>
            <dt className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Icon size={12} aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-1 text-[13px] font-semibold tabular-nums text-studio-title-secondary">
              {formatNumber(value)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}