"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import {
  CONTENT_FORMAT_LABELS,
  CONTENT_STATUSES,
  CONTENT_STATUS_LABELS,
  type ContentStatus,
} from "@/features/contents/types/content";
import {
  initialMetricFormValues,
  METRIC_FIELDS,
  sortMetricHistoryNewestFirst,
  validateMetricForm,
  validatePublishedUrl,
  type MetricField,
  type MetricFormErrors,
  type MetricFormValues,
} from "@/features/contents/schemas/content-detail";
import type {
  ChecklistPreviewItem,
  ContentDetailPreviewRecord,
  ContentMetricSnapshot,
  ContentMetricValues,
} from "@/features/contents/types/content-detail";
import {
  addChecklistItem,
  deleteChecklistItem,
  deleteContent,
  recordMetricSnapshot,
  toggleChecklistItem as apiToggleChecklistItem,
  updateContent,
} from "@/features/contents/services/contents-service";
import { getErrorMessage } from "@/lib/api/errors";
import {
  ContentPriorityBadge,
  ContentStatusBadge,
} from "@/features/contents/components/content-badges";
import { ContentPublishDialog } from "@/features/contents/components/content-publish-dialog";
import { ContentMetricDialog } from "@/features/contents/components/content-metric-dialog";
import { ContentDetailChecklists } from "@/features/contents/components/content-detail-checklists";
import { ContentDetailMetrics } from "@/features/contents/components/content-detail-metrics";

export interface ContentDetailPreviewProps {
  content: ContentDetailPreviewRecord;
  isSample?: boolean;
}

export function ContentDetailPreview({
  content,
  isSample = false,
}: ContentDetailPreviewProps) {
  const router = useRouter();

  const [status, setStatus] = useState<ContentStatus>(content.status);
  const [publishedUrl, setPublishedUrl] = useState(content.published_url ?? "");
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishUrlInput, setPublishUrlInput] = useState(content.published_url ?? "");
  const [publishError, setPublishError] = useState("");
  const [checklist, setChecklist] = useState<ChecklistPreviewItem[]>(content.checklists || []);
  const [newTask, setNewTask] = useState("");
  const [metrics, setMetrics] = useState<ContentMetricValues[]>(content.metrics || []);
  const [metricHistory, setMetricHistory] = useState<ContentMetricSnapshot[]>(() =>
    sortMetricHistoryNewestFirst(content.metrics || [])
  );
  const [metricValues, setMetricValues] = useState<MetricFormValues>(initialMetricFormValues);
  const [metricErrors, setMetricErrors] = useState<MetricFormErrors>({});
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [isRecordingMetric, setIsRecordingMetric] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ChecklistPreviewItem | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentStatusIndex = CONTENT_STATUSES.indexOf(status);

  // Toggle checklist item
  async function handleToggleChecklistItem(item: ChecklistPreviewItem) {
    const nextCompleted = !item.is_completed;
    const previousChecklist = [...checklist];

    setChecklist((current) =>
      current.map((t) => (t.id === item.id ? { ...t, is_completed: nextCompleted } : t))
    );

    if (isSample) {
      return;
    }

    try {
      await apiToggleChecklistItem(item.id);
    } catch {
      setChecklist(previousChecklist);
      setFeedback({
        type: "error",
        message: "Gagal memperbarui status checklist di server.",
      });
    }
  }

  // Add checklist item
  async function handleAddChecklistItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const taskName = newTask.trim();
    if (!taskName) return;

    setIsAddingTask(true);
    setFeedback(null);

    if (isSample) {
      const item: ChecklistPreviewItem = {
        id: `local-${Date.now()}`,
        task_name: taskName,
        is_completed: false,
      };
      setChecklist((prev) => [...prev, item]);
      setNewTask("");
      setIsAddingTask(false);
      setFeedback({ type: "success", message: "Checklist item ditambahkan (preview lokal)." });
      return;
    }

    try {
      const created = await addChecklistItem(content.id, taskName);
      setChecklist((prev) => [
        ...prev,
        {
          id: created.id,
          task_name: created.task_name,
          is_completed: Boolean(created.is_completed),
        },
      ]);
      setNewTask("");
      setFeedback({ type: "success", message: "Checklist item berhasil ditambahkan ke server." });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal menambahkan checklist item."),
      });
    } finally {
      setIsAddingTask(false);
    }
  }

  // Request delete checklist item (opens confirmation dialog)
  function requestDeleteChecklistItem(item: ChecklistPreviewItem) {
    setTaskToDelete(item);
  }

  // Confirm delete checklist item
  async function handleConfirmDeleteTask() {
    if (!taskToDelete) return;
    const item = taskToDelete;
    setIsDeletingTask(true);
    const previousChecklist = [...checklist];
    setChecklist((current) => current.filter((t) => t.id !== item.id));

    if (isSample) {
      setIsDeletingTask(false);
      setTaskToDelete(null);
      return;
    }

    try {
      await deleteChecklistItem(item.id);
      setFeedback({ type: "success", message: "Checklist item berhasil dihapus dari server." });
    } catch (error) {
      setChecklist(previousChecklist);
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Gagal menghapus checklist item dari server."),
      });
    } finally {
      setIsDeletingTask(false);
      setTaskToDelete(null);
    }
  }

  function handleMetricChange(field: MetricField, value: string) {
    setMetricValues((currentValues) => ({ ...currentValues, [field]: value }));
    setMetricErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  // Record snapshot of metrics
  async function handleRecordMetrics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateMetricForm(metricValues);
    setMetricErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsRecordingMetric(true);
    setFeedback(null);

    const values = Object.fromEntries(
      METRIC_FIELDS.map((field) => [field, Number(metricValues[field])])
    ) as ContentMetricValues;

    if (isSample) {
      const recordedAt = new Date().toISOString().slice(0, 10);
      const snapshot: ContentMetricSnapshot = {
        id: `local-${Date.now()}`,
        recorded_at: recordedAt,
        ...values,
      };

      setMetrics((history) => [...history, values]);
      setMetricHistory((history) => [snapshot, ...history]);
      setMetricValues(initialMetricFormValues);
      setIsRecordingMetric(false);
      setIsMetricDialogOpen(false);
      setFeedback({ type: "success", message: "Snapshot metrik dicatat di preview lokal." });
      return;
    }

    try {
      const savedSnapshot = await recordMetricSnapshot(content.id, values);
      const recordedAt = savedSnapshot?.recorded_at || new Date().toISOString().slice(0, 10);
      const snapshot: ContentMetricSnapshot = {
        id: savedSnapshot?.id || `snap-${Date.now()}`,
        recorded_at: recordedAt,
        ...values,
      };

      setMetrics((history) => [...history, values]);
      setMetricHistory((history) => [snapshot, ...history]);
      setMetricValues(initialMetricFormValues);
      setIsMetricDialogOpen(false);
      setFeedback({ type: "success", message: "Snapshot analitik berhasil dicatat di server!" });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal mencatat metrik ke server."),
      });
    } finally {
      setIsRecordingMetric(false);
    }
  }

  // Lifecycle progression
  async function moveToNextStage() {
    if (status === "ready") {
      setPublishUrlInput(publishedUrl);
      setPublishError("");
      setIsPublishDialogOpen(true);
      return;
    }

    const nextStatus = CONTENT_STATUSES[currentStatusIndex + 1];
    if (!nextStatus) return;

    setIsUpdatingStatus(true);
    setFeedback(null);

    if (isSample) {
      setStatus(nextStatus);
      setIsUpdatingStatus(false);
      setFeedback({
        type: "success",
        message: `Status berubah ke ${CONTENT_STATUS_LABELS[nextStatus]} (preview lokal).`,
      });
      return;
    }

    try {
      await updateContent(content.id, { status: nextStatus });
      setStatus(nextStatus);
      setFeedback({
        type: "success",
        message: `Status konten berhasil diperbarui ke ${CONTENT_STATUS_LABELS[nextStatus]}.`,
      });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal memperbarui status konten di backend."),
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  // Publish content
  async function handlePublishContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = publishUrlInput.trim();

    if (!url) {
      setPublishError("Kolom published_url wajib diisi untuk mempublikasikan konten.");
      return;
    }

    if (!validatePublishedUrl(url)) {
      setPublishError("Masukkan tautan URL publikasi yang valid dengan protokol http atau https.");
      return;
    }

    setIsPublishing(true);
    setPublishError("");

    if (isSample) {
      setPublishedUrl(url);
      setStatus("published");
      setIsPublishDialogOpen(false);
      setIsPublishing(false);
      setFeedback({
        type: "success",
        message: "Status dan URL publikasi berhasil diperbarui di preview lokal.",
      });
      return;
    }

    try {
      await updateContent(content.id, {
        status: "published",
        published_url: url,
        published_date: new Date().toISOString().slice(0, 10),
      });

      setPublishedUrl(url);
      setStatus("published");
      setIsPublishDialogOpen(false);
      setFeedback({
        type: "success",
        message: "Konten resmi dipublikasikan! Akses pencatatan metrik sekarang aktif.",
      });
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Server menolak transisi publikasi.");
      setPublishError(msg);
    } finally {
      setIsPublishing(false);
    }
  }

  // Delete content with cascade
  async function handleDeleteContent() {
    setIsDeleting(true);
    setFeedback(null);

    if (isSample) {
      router.push("/contents");
      return;
    }

    try {
      await deleteContent(content.id);
      router.push("/contents");
    } catch (err: unknown) {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal menghapus konten dari backend."),
      });
    }
  }

  return (
    <div className="mx-auto max-w-330">
      <header className="mb-5.75 flex items-end justify-between gap-5.5 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3.5">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT DETAIL</p>
          <h1 className="m-0 max-w-190 font-serif text-[clamp(31px,3.2vw,42px)] font-normal leading-[1.12] text-studio-heading max-[640px]:text-[34px]">
            {content.title}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{content.channel?.handle_name || "Channel"}</span>
            <span className="text-border" aria-hidden="true">/</span>
            <span>{CONTENT_FORMAT_LABELS[content.format_type] || content.format_type}</span>
            <span className="text-border" aria-hidden="true">·</span>
            <ContentPriorityBadge priority={content.priority} />
          </div>
        </div>
        <div className="flex flex-none items-center gap-2.25 max-[640px]:w-full max-[640px]:justify-between">
          <Badge
            className="h-8 border-studio-pill-border bg-studio-pill-bg text-[8px] font-bold tracking-[0.08em] text-studio-pill-text"
            variant="outline"
          >
            {isSample ? "PREVIEW DATA" : "LIVE BACKEND"}
          </Badge>
          <Button asChild className="h-8 border-input bg-card text-xs text-studio-body" variant="outline">
            <Link href={`/contents/${content.id}/edit`}>Edit details</Link>
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="outline"
            className="h-8 border-feedback-destructive-hover-border text-xs text-destructive hover:bg-feedback-destructive-hover-bg hover:text-feedback-destructive-hover-text cursor-pointer"
            type="button"
          >
            <Trash2 size={13} className="mr-1.5" aria-hidden="true" />
            Delete content
          </Button>
        </div>
      </header>

      {isSample && (
        <Alert className="mb-5 grid-cols-[18px_1fr] rounded-[7px] border-studio-icon-border bg-studio-icon-bg px-3.5 py-3 text-studio-icon-text **:data-[slot=alert-title]:text-[10px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:leading-normal **:data-[slot=alert-description]:text-muted-foreground">
          <Sparkles aria-hidden="true" />
          <AlertTitle>Local preview fixture (demo-42)</AlertTitle>
          <AlertDescription>
            Tampilan sampel ini berfungsi secara offline untuk pratinjau alur kerja.
          </AlertDescription>
        </Alert>
      )}

      {feedback && (
        <Alert
          className={`mb-5 rounded-[7px] px-3.5 py-3 text-[11px] ${feedback.type === "success"
            ? "border-feedback-success-border bg-feedback-success-bg text-feedback-success-text"
            : "border-feedback-destructive-border bg-feedback-destructive-bg text-feedback-destructive-text"
            }`}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 text-feedback-success-icon" aria-hidden="true" />
          ) : (
            <CircleAlert className="size-4 text-feedback-destructive-icon" aria-hidden="true" />
          )}
          <AlertTitle>{feedback.type === "success" ? "Berhasil" : "Pemberitahuan"}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(330px,0.85fr)] items-start gap-5 max-[920px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-4.25">
          {/* Production Checklist */}
          <ContentDetailChecklists
            checklist={checklist}
            newTask={newTask}
            onNewTaskChange={setNewTask}
            isAddingTask={isAddingTask}
            onAddTask={handleAddChecklistItem}
            onToggleTask={handleToggleChecklistItem}
            onDeleteTask={requestDeleteChecklistItem}
          />

          {/* Creative Brief */}
          <section aria-labelledby="brief-title" className="min-w-0 rounded-lg border border-studio-card-border bg-card/90 p-5 max-[640px]:px-3.5 max-[640px]:py-4">
            <div className="mb-3.75 flex items-center justify-between gap-3">
              <div>
                <p className="mb-1.25 text-[8px] font-bold tracking-[0.14em] text-studio-label-muted">CREATIVE BRIEF</p>
                <h2 className="m-0 text-sm font-semibold text-studio-title-secondary" id="brief-title">Description & script</h2>
              </div>
              <Button asChild className="h-7.5 px-2.25 text-[10px] text-primary" variant="ghost">
                <Link href={`/contents/${content.id}/edit`}>Edit</Link>
              </Button>
            </div>
            <p className="m-0 text-[11px] leading-[1.7] text-studio-body">
              {content.description || <span className="italic text-muted-foreground">Belum ada deskripsi konten.</span>}
            </p>
            <p className="mt-3 text-[10px] text-muted-foreground">
              Scheduled: {content.scheduled_date ? content.scheduled_date.slice(0, 10) : "Not set"}
            </p>
            {content.script_draft ? (
              <pre className="mt-3.75 wrap-break-word whitespace-pre-wrap rounded-md border-l-2 border-primary/40 bg-muted/50 px-3.5 py-3 font-sans text-[10px] leading-[1.8] text-studio-body">
                {content.script_draft}
              </pre>
            ) : null}
          </section>

          {publishedUrl && (
            <section aria-labelledby="published-link-title" className="min-w-0 rounded-lg border border-feedback-success-border bg-feedback-success-bg p-5 max-[640px]:px-3.5 max-[640px]:py-4">
              <div>
                <p className="mb-1.25 text-[8px] font-bold tracking-[0.14em] text-feedback-success-text">PUBLISHED LINK</p>
                <h2 className="m-0 text-sm font-semibold text-studio-title-secondary" id="published-link-title">Public URL</h2>
              </div>
              <a className="mt-3 flex items-center gap-2 text-[11px] font-medium text-primary no-underline hover:underline" href={publishedUrl} rel="noreferrer" target="_blank">
                <span className="min-w-0 break-all">{publishedUrl}</span>
                <ExternalLink aria-hidden="true" size={15} />
              </a>
            </section>
          )}

          {/* Performance Metrics Section */}
          <ContentDetailMetrics
            metrics={metrics}
            metricHistory={metricHistory}
            onOpenMetricDialog={() => setIsMetricDialogOpen(true)}
            recordMetricSlot={
              <ContentMetricDialog
                isOpen={isMetricDialogOpen}
                onOpenChange={setIsMetricDialogOpen}
                metricValues={metricValues}
                metricErrors={metricErrors}
                onMetricChange={handleMetricChange}
                isRecordingMetric={isRecordingMetric}
                onSubmit={handleRecordMetrics}
              />
            }
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-4.25">
          {/* Status & Lifecycle Transition */}
          <section aria-labelledby="status-title" className="min-w-0 rounded-lg border border-studio-card-border bg-card/90 p-5 max-[640px]:px-3.5 max-[640px]:py-4">
            <div className="mb-3.75 flex items-center justify-between gap-3">
              <div>
                <p className="mb-1.25 text-[8px] font-bold tracking-[0.14em] text-studio-label-muted">LIFECYCLE</p>
                <h2 className="m-0 text-sm font-semibold text-studio-title-secondary" id="status-title">Production status</h2>
              </div>
            </div>
            <div className="mb-3.5">
              <ContentStatusBadge status={status} />
            </div>
            <ol className="mb-4.5 ml-1.25 flex list-none flex-col border-l border-border p-0">
              {CONTENT_STATUSES.map((stage, index) => (
                <li
                  className={`relative flex min-h-7.75 items-center gap-2.5 pl-3 text-[10px] ${index === currentStatusIndex ? "font-semibold text-primary" : "text-muted-foreground"
                    }`}
                  aria-current={index === currentStatusIndex ? "step" : undefined}
                  key={stage}
                >
                  <span
                    className={`absolute -left-1.25 size-2.25 rounded-full border-2 border-background ${index <= currentStatusIndex ? "bg-primary shadow-[0_0_0_1px_currentColor]" : "bg-border"
                      }`}
                  />
                  <span>{CONTENT_STATUS_LABELS[stage]}</span>
                </li>
              ))}
            </ol>

            <Button
              className="h-9.5 w-full bg-primary text-[10px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              disabled={status === "published" || isUpdatingStatus}
              onClick={moveToNextStage}
              type="button"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Updating stage...
                </>
              ) : status === "ready" ? (
                "Add URL & publish"
              ) : status === "published" ? (
                "Content is published"
              ) : (
                <>
                  Move to next stage
                  <ArrowRight aria-hidden="true" className="ml-1.5 size-3.5" />
                </>
              )}
            </Button>
          </section>
        </aside>
      </div>

      {/* Publish Dialog Modal */}
      <ContentPublishDialog
        isOpen={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        urlInput={publishUrlInput}
        onUrlInputChange={setPublishUrlInput}
        error={publishError}
        isPublishing={isPublishing}
        onSubmit={handlePublishContent}
      />

      {/* Delete Content Confirmation Modal */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Hapus Konten Ini?"
        description={
          <>
            Tindakan ini akan menghapus konten <strong>&quot;{content.title}&quot;</strong> beserta seluruh subtugas checklist dan riwayat log metrik secara permanen (Cascade Delete).
          </>
        }
        icon={<Trash2 className="size-5 text-destructive" />}
        variant="destructive"
        confirmText="Ya, Hapus Konten"
        cancelText="Batal"
        isLoading={isDeleting}
        onConfirm={handleDeleteContent}
      />

      {/* Delete Checklist Item Confirmation Modal */}
      <ConfirmDialog
        open={taskToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setTaskToDelete(null);
        }}
        title="Hapus Tugas Checklist?"
        description={
          taskToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus tugas <strong>&quot;{taskToDelete.task_name}&quot;</strong>?
            </>
          ) : undefined
        }
        icon={<Trash2 className="size-5 text-destructive" />}
        variant="destructive"
        confirmText="Hapus Tugas"
        cancelText="Batal"
        isLoading={isDeletingTask}
        onConfirm={handleConfirmDeleteTask}
      />
    </div>
  );
}
