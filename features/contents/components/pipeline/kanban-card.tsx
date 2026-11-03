"use client";

import Link from "next/link";
import { Calendar, Eye, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/features/channels/components/platform-icon";
import { ContentPriorityBadge } from "@/features/contents/components/content-badges";
import { CONTENT_FORMAT_LABELS } from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { cn } from "@/lib/utils";

export interface KanbanCardProps {
  content: ContentItem;
  isOverlay?: boolean;
  currentUserRole?: string | null;
}

export function KanbanCard({
  content,
  isOverlay = false,
  currentUserRole,
}: KanbanCardProps) {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(content.id),
    data: {
      type: "card",
      content,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const platform = content.channel?.platform || "youtube";
  const canViewDetails = currentUserRole !== "editor" || content.status === "editing";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col justify-between rounded-lg border border-studio-card-border bg-card p-3.5 transition-all",
        isDragging && "opacity-40 border-dashed border-primary/50 bg-muted/30 shadow-none",
        isOverlay && "cursor-grabbing shadow-xl ring-2 ring-primary/30 border-primary rotate-1 scale-[1.02]",
        !isDragging && !isOverlay && "hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div>
        <div className="mb-2.5 flex items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-studio-icon-bg px-2 py-0.5 text-[10px] font-medium text-studio-icon-text">
            <PlatformIcon platform={platform} size={11} />
            <span className="truncate max-w-28">{content.channel?.handle_name || "Channel"}</span>
          </span>

          <div className="flex items-center gap-1">
            <ContentPriorityBadge priority={content.priority} />
            <button
              {...listeners}                       // keep drag listeners
              aria-label={`Geser tugas ${content.title}`}
              role="button"
              aria-roledescription="sortable"
              aria-disabled={false}
              tabIndex={0}
              className={cn(
                "inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab active:cursor-grabbing",
                isOverlay && "cursor-grabbing"
              )}
              type="button"
            >
              <GripVertical size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        <h4 className="mb-1 text-[13px] font-medium leading-snug text-studio-title-secondary">
          {canViewDetails ? (
            <Link
              href={`/contents/${content.id}`}
              className="no-underline hover:text-primary hover:underline line-clamp-2"
            >
              {content.title}
            </Link>
          ) : content.title}
        </h4>

        {content.description && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {content.description}
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-studio-card-border-subtle pt-2.5">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[9px] text-muted-foreground">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4.5">
            {CONTENT_FORMAT_LABELS[content.format_type] || content.format_type}
          </Badge>
          {content.scheduled_date && (
            <span className="inline-flex items-center gap-1 text-[10px]">
              <Calendar size={10} aria-hidden="true" />
              <span>{content.scheduled_date.slice(0, 10)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-0.5">
          {canViewDetails && (
            <Button asChild size="sm" variant="outline" className="h-6.5 px-2 border-input text-[10px] text-primary">
              <Link href={`/contents/${content.id}`}>
                <Eye size={11} className="mr-1" aria-hidden="true" />
                Details
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
