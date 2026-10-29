"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Kanban, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTENT_STATUSES,
  type ContentStatus,
} from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { updateContent } from "@/features/contents/services/contents-service";
import { KanbanColumn } from "@/features/contents/components/pipeline/kanban-column";
import { KanbanCard } from "@/features/contents/components/pipeline/kanban-card";
import { ContentCard } from "@/features/contents/components/pipeline/content-card";
import { ContentEmptyState } from "@/features/contents/components/pipeline/content-empty-state";

export interface ContentKanbanBoardProps {
  initialContents: ContentItem[];
  hasFilters: boolean;
}

export function ContentKanbanBoard({
  initialContents,
  hasFilters,
}: ContentKanbanBoardProps) {
  const [items, setItems] = useState<ContentItem[]>(initialContents);
  const [prevInitialContents, setPrevInitialContents] = useState(initialContents);

  // Sync state if server initialContents changes without causing effect cascading renders
  if (prevInitialContents !== initialContents) {
    setPrevInitialContents(initialContents);
    setItems(initialContents);
  }

  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "grid">("board");

  // Setup sensors with distance activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Combined collision detection strategy
  const customCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCorners(args);
  };

  function findTargetColumn(overId: string | number): ContentStatus | null {
    const strId = String(overId);
    if (strId.startsWith("col-")) {
      const statusCandidate = strId.replace("col-", "") as ContentStatus;
      if (CONTENT_STATUSES.includes(statusCandidate)) {
        return statusCandidate;
      }
    }

    const targetItem = items.find((i) => String(i.id) === strId);
    return targetItem ? targetItem.status : null;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const found = items.find((i) => String(i.id) === String(active.id));
    if (found) {
      setActiveContent(found);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveContent(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const sourceItem = items.find((i) => String(i.id) === activeId);
    if (!sourceItem) {
      return;
    }

    const targetStatus = findTargetColumn(over.id);
    if (!targetStatus) {
      return;
    }

    // If status changed, update optimistically and persist via updateContent API
    if (sourceItem.status !== targetStatus) {
      const previousStatus = sourceItem.status;

      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          String(i.id) === activeId ? { ...i, status: targetStatus } : i
        )
      );

      try {
        await updateContent(sourceItem.id, { status: targetStatus });
      } catch (err: unknown) {
        // Rollback on API failure
        setItems((prev) =>
          prev.map((i) =>
            String(i.id) === activeId ? { ...i, status: previousStatus } : i
          )
        );
        console.error(err)
      }
    }
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar with view switcher */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-studio-card-border-subtle bg-studio-card-header/40">
        <span className="text-[11px] text-muted-foreground">
          {viewMode === "board" ? "Tarik dan geser kartu antar kolom untuk mengubah statusnya." : "Menampilkan daftar konten dalam tata letak kisi."}
        </span>
        <div className="flex items-center gap-1 rounded-md border border-input bg-card p-0.5">
          <Button
            size="sm"
            variant={viewMode === "board" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-[10px] gap-1.5"
            onClick={() => setViewMode("board")}
            type="button"
          >
            <Kanban size={13} aria-hidden="true" />
            <span>Kanban Board</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-[10px] gap-1.5"
            onClick={() => setViewMode("grid")}
            type="button"
          >
            <LayoutGrid size={13} aria-hidden="true" />
            <span>Grid</span>
          </Button>
        </div>
      </div>

      {/* Board or Grid Content */}
      {items.length === 0 && !hasFilters ? (
        <ContentEmptyState hasFilters={hasFilters} />
      ) : viewMode === "board" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto p-6 scrollbar-thin">
            {CONTENT_STATUSES.map((status, index) => {
              const columnItems = items.filter((item) => item.status === status);
              return (
                <KanbanColumn
                  key={status}
                  status={status}
                  stageIndex={index}
                  items={columnItems}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeContent ? (
              <KanbanCard content={activeContent} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 max-[640px]:p-3.5">
              {items.map((content) => (
                <ContentCard key={String(content.id)} content={content} />
              ))}
            </div>
          ) : (
            <ContentEmptyState hasFilters={hasFilters} />
          )}
        </div>
      )}
    </div>
  );
}
