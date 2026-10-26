import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CONTENT_PRIORITY_LABELS,
  CONTENT_STATUS_LABELS,
  type ContentPriority,
  type ContentStatus,
} from "@/features/contents/types/content";

export function getStatusBadgeClass(status: ContentStatus): string {
  switch (status) {
    case "idea":
      return "border-status-idea-border bg-status-idea-bg text-status-idea-text";
    case "scripting":
      return "border-status-scripting-border bg-status-scripting-bg text-status-scripting-text";
    case "recording":
      return "border-status-recording-border bg-status-recording-bg text-status-recording-text";
    case "editing":
      return "border-status-editing-border bg-status-editing-border bg-status-editing-bg text-status-editing-text";
    case "ready":
      return "border-status-ready-border bg-status-ready-bg text-status-ready-text";
    case "published":
      return "border-status-published-border bg-status-published-bg text-status-published-text";
    default:
      return "border-studio-pill-border bg-studio-pill-bg text-studio-pill-text";
  }
}

export function getPriorityBadgeClass(priority: ContentPriority | string): string {
  switch (priority) {
    case "high":
      return "border-priority-high-border bg-priority-high-bg text-priority-high-text";
    case "low":
      return "border-priority-low-border bg-priority-low-bg text-priority-low-text";
    default:
      return "border-priority-medium-border bg-priority-medium-bg text-priority-medium-text";
  }
}

export interface ContentStatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

export function ContentStatusBadge({ status, className }: ContentStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider",
        getStatusBadgeClass(status),
        className
      )}
      variant="outline"
    >
      {CONTENT_STATUS_LABELS[status] || status}
    </Badge>
  );
}

export interface ContentPriorityBadgeProps {
  priority: ContentPriority;
  className?: string;
}

export function ContentPriorityBadge({ priority, className }: ContentPriorityBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
        getPriorityBadgeClass(priority),
        className
      )}
      variant="outline"
    >
      {CONTENT_PRIORITY_LABELS[priority] || priority}
    </Badge>
  );
}

