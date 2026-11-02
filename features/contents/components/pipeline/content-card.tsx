import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/features/channels/components/platform-icon";
import { ContentPriorityBadge, ContentStatusBadge } from "@/features/contents/components/content-badges";
import { CONTENT_FORMAT_LABELS } from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";

interface ContentCardProps {
  content: ContentItem;
  currentUserRole?: string | null;
}

export function ContentCard({ content, currentUserRole }: ContentCardProps) {
  const platform = content.channel?.platform || "youtube";
  const canViewDetails =
    currentUserRole !== "editor" || content.status === "editing";

  return (
    <div className="flex flex-col justify-between rounded-lg border border-studio-card-border bg-card p-4.5 transition-shadow hover:shadow-md">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-studio-icon-bg px-2 py-0.75 text-[10px] font-medium text-studio-icon-text">
            <PlatformIcon platform={platform} size={12} />
            <span className="truncate max-w-35">{content.channel?.handle_name || "Channel"}</span>
          </span>
          <ContentStatusBadge status={content.status} />
        </div>

        <h3 className="mb-1.5 font-serif text-[17px] font-medium leading-snug text-studio-title-secondary">
          <Link
            href={`/contents/${content.id}`}
            className="no-underline hover:text-primary hover:underline"
          >
            {content.title}
          </Link>
        </h3>

        {content.description && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {content.description}
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-studio-card-border-subtle pt-3">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[9px] text-muted-foreground">
            {CONTENT_FORMAT_LABELS[content.format_type] || content.format_type}
          </Badge>
          <ContentPriorityBadge priority={content.priority} />
          {content.scheduled_date && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar size={11} aria-hidden="true" />
              <span>{content.scheduled_date.slice(0, 10)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          {canViewDetails && (
            <Button asChild size="sm" variant="outline" className="h-7 border-input text-[10px] text-primary">
              <Link href={`/contents/${content.id}`}>
                <Eye size={12} className="mr-1" aria-hidden="true" />
                Details
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}