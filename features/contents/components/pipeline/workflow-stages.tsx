interface WorkflowStagesProps {
  totalItems: number;
}

export function WorkflowStages({ totalItems }: WorkflowStagesProps) {
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
