"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { ContentStatusBadge } from "@/features/contents/components/content-badges";
import { KanbanCard } from "@/features/contents/components/pipeline/kanban-card";
import { cn } from "@/lib/utils";

export interface KanbanColumnProps {
  status: ContentStatus;
  stageIndex: number;
  items: ContentItem[];
  isOver?: boolean;
}

export function KanbanColumn({
  status,
  stageIndex,
  items,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${status}`,
    data: {
      type: "column",
      status,
    },
  });

  const cardIds = items.map((item) => String(item.id));

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-67.5 max-w-77.5 flex-1 shrink-0 flex-col rounded-lg border bg-card/60 transition-colors",
        isOver
          ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
          : "border-studio-card-border"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-studio-card-border-subtle p-3.5 bg-studio-card-header/80 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
            {String(stageIndex + 1).padStart(2, "0")}
          </span>
          <ContentStatusBadge status={status} />
        </div>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
          {items.length}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex flex-1 flex-col gap-2.5 p-2.5 min-h-60 max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <KanbanCard key={String(item.id)} content={item} />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div
            className={cn(
              "flex flex-1 min-h-36 flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-center transition-colors",
              isOver
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border/60 bg-card/30 text-muted-foreground"
            )}
          >
            <p className="m-0 text-[11px] font-medium">
              {isOver ? "Release to move" : "No tasks yet"}
            </p>
            <span className="mt-1 text-[9px] text-muted-foreground/80">
              Move task to status {CONTENT_STATUS_LABELS[status]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

