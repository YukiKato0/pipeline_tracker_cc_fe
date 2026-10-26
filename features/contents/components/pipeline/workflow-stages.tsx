import { CONTENT_STATUS_LABELS, CONTENT_STATUSES, type ContentStatus } from "@/features/contents/types/content";

interface WorkflowStagesProps {
  totalItems: number;
  statusCounts: Record<ContentStatus, number>;
}

export function WorkflowStages({ totalItems, statusCounts }: WorkflowStagesProps) {
  return (
    <div className="flex min-h-23 items-center justify-between border-b border-studio-card-border-subtle px-6.25 py-5 max-[640px]:min-h-19.75 max-[640px]:px-4">
      <div>
        <span className="mb-1.75 block text-[9px] font-bold tracking-[0.14em] text-studio-label-muted">THE WORKFLOW</span>
        <h2 className="m-0 text-base font-semibold text-studio-title-secondary">Production stages</h2>
      </div>
      <span className="rounded bg-muted px-2.25 py-1.75 text-[9px] font-bold tracking-[0.14em] text-muted-foreground">
        {totalItems} ACTIVE ITEMS
      </span>
    </div>
  );
}

export function WorkflowStagesList({ statusCounts }: { statusCounts: Record<ContentStatus, number> }) {
  return (
    <ol className="m-0 grid min-w-195 grid-cols-6 overflow-x-auto px-6 py-0 scrollbar-thin max-[640px]:min-w-171 max-[640px]:px-3">
      {CONTENT_STATUSES.map((status, index) => (
        <li className={`flex min-h-14 items-center gap-2.25 border-b border-studio-card-border-subtle px-2.25 ${index > 0 ? "border-l border-l-border/60" : ""}`} key={status}>
          <span className={`text-[9px] tabular-nums ${index === 0 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col">
            <span className="whitespace-nowrap text-[11px] font-semibold text-studio-body">{CONTENT_STATUS_LABELS[status]}</span>
            <span className="text-[9px] text-muted-foreground">{statusCounts[status]} item</span>
          </div>
          <span className={`ml-auto h-1 w-4.5 rounded-sm ${index === 0 ? "bg-primary/50" : "bg-border"}`} aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}