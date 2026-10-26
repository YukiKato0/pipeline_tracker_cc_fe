"use client";

import type { FormEvent } from "react";
import { ClipboardCheck, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { ChecklistPreviewItem } from "@/features/contents/types/content-detail";

export interface ContentDetailChecklistsProps {
  checklist: ChecklistPreviewItem[];
  newTask: string;
  onNewTaskChange: (value: string) => void;
  isAddingTask: boolean;
  onAddTask: (e: FormEvent<HTMLFormElement>) => void;
  onToggleTask: (item: ChecklistPreviewItem) => void;
  onDeleteTask: (item: ChecklistPreviewItem) => void;
}

export function ContentDetailChecklists({
  checklist,
  newTask,
  onNewTaskChange,
  isAddingTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: ContentDetailChecklistsProps) {
  const completedTasks = checklist.filter((item) => item.is_completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

  return (
    <section aria-labelledby="checklist-title" className="rounded-lg border border-studio-card-border bg-card/90 p-5.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-[9px] font-bold tracking-[0.14em] text-studio-label-muted">CHECKLIST</p>
          <h2 className="m-0 text-[16px] font-semibold text-studio-title-secondary" id="checklist-title">Production tasks</h2>
        </div>
        <Badge className="h-6 rounded border-studio-pill-border bg-studio-pill-bg text-[9px] text-studio-pill-text" variant="outline">
          {completedTasks}/{checklist.length} DONE ({progressPercent}%)
        </Badge>
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <Progress value={progressPercent} className="h-1.5 flex-1" />
        <span className="text-[10px] font-medium text-muted-foreground">{progressPercent}%</span>
      </div>

      <div className="mt-4.5 flex flex-col gap-2">
        {checklist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <ClipboardCheck aria-hidden="true" className="mb-2 size-6 text-studio-icon-text opacity-40" />
            <p className="m-0 text-[11px]">Belum ada tugas untuk tahap ini. Tambahkan tugas pertama Anda di bawah.</p>
          </div>
        ) : (
          checklist.map((item) => (
            <div
              key={String(item.id)}
              className="group flex min-h-10 items-center justify-between rounded-md border border-studio-card-border-subtle bg-studio-card-header px-3.25 py-2 text-[12px] transition-colors hover:bg-muted"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={() => onToggleTask(item)}
                  aria-label={item.task_name}
                />
                <span className={`text-[12px] transition-colors ${item.is_completed ? "text-muted-foreground line-through" : "text-studio-title-secondary font-medium"}`}>
                  {item.task_name}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onDeleteTask(item)}
                aria-label={`Hapus tugas ${item.task_name}`}
                className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={onAddTask}>
        <Input
          placeholder="Tambah checklist tugas..."
          value={newTask}
          onChange={(e) => onNewTaskChange(e.target.value)}
          disabled={isAddingTask}
          className="h-9.5 rounded-[5px] border-input bg-card text-[11px] text-studio-body"
        />
        <Button
          type="submit"
          disabled={isAddingTask || !newTask.trim()}
          className="h-9.5 rounded-[5px] bg-primary px-3 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {isAddingTask ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              <Plus aria-hidden="true" className="mr-1 size-3.5" />
              Add
            </>
          )}
        </Button>
      </form>
    </section>
  );
}

