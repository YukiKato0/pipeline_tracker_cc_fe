"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTENT_FORMAT_LABELS,
  CONTENT_FORMATS,
  CONTENT_PRIORITIES,
  CONTENT_PRIORITY_LABELS,
  type ContentFormat,
  type ContentPriority,
} from "@/features/contents/types/content";
import { channelPreviewRecords } from "@/features/channels/mock/channel-preview";
import {
  CHANNEL_PLATFORM_LABELS,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import { getChannels } from "@/features/channels/services/channels-service";
import {
  createContent,
  getContentById,
  updateContent,
} from "@/features/contents/services/contents-service";
import { getErrorMessage } from "@/lib/api/errors";
import {
  initialContentFormValues,
  validateContentForm,
  type ContentFormErrors,
  type ContentFormValues,
} from "@/features/contents/schemas/content-form";

export type ContentFormMode = "create" | "edit";

export interface ContentFormProps {
  mode: ContentFormMode;
  contentId?: string | number;
}

export function ContentForm({
  mode,
  contentId,
}: ContentFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ContentFormValues>(initialContentFormValues);
  const [errors, setErrors] = useState<ContentFormErrors>({});
  const [channels, setChannels] = useState<ChannelRecord[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    getChannels()
      .then((records) => {
        if (!ignore) {
          setChannels(records.length > 0 ? records : channelPreviewRecords);
        }
      })
      .catch(() => {
        if (!ignore) {
          setChannels(channelPreviewRecords);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !contentId) {
      return;
    }

    let ignore = false;
    getContentById(contentId)
      .then((record) => {
        if (!ignore && record) {
          setValues({
            title: record.title || "",
            channel_id: String(record.channel_id || (record.channel ? record.channel.id : "")),
            format_type: record.format_type as ContentFormat,
            description: record.description || "",
            script_draft: record.script_draft || "",
            priority: (record.priority as ContentPriority) || "medium",
            scheduled_date: record.scheduled_date ? record.scheduled_date.slice(0, 10) : "",
          });
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = getErrorMessage(err, "Gagal memuat detail konten untuk diedit.");
          setServerError(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingContent(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mode, contentId]);

  function updateField<K extends keyof ContentFormValues>(field: K, val: ContentFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setSuccessNotice(null);

    const validation = validateContentForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const payload = {
          title: values.title.trim(),
          channel_id: values.channel_id,
          format_type: values.format_type as ContentFormat,
          description: values.description?.trim() || undefined,
          script_draft: values.script_draft?.trim() || undefined,
          priority: values.priority,
          scheduled_date: values.scheduled_date ? new Date(values.scheduled_date).toISOString() : null,
        };
        const created = await createContent(payload);
        setSuccessNotice("Konten berhasil dibuat! Mengalihkan ke halaman detail...");
        setTimeout(() => {
          router.push(`/contents/${created.id}`);
        }, 600);
      } else if (contentId) {
        const payload = {
          title: values.title.trim(),
          channel_id: values.channel_id,
          format_type: values.format_type as ContentFormat,
          description: values.description?.trim() || "",
          script_draft: values.script_draft?.trim() || "",
          priority: values.priority,
          scheduled_date: values.scheduled_date ? new Date(values.scheduled_date).toISOString() : null,
        };
        await updateContent(contentId, payload);
        setSuccessNotice("Perubahan berhasil disimpan! Mengalihkan ke detail...");
        setTimeout(() => {
          router.push(`/contents/${contentId}`);
        }, 600);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Gagal menyimpan konten ke backend.");
      setServerError(msg);
      setIsSubmitting(false);
    }
  }

  if (isLoadingContent) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-xs">Memuat data konten...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {serverError && (
        <Alert className="m-0 rounded-[7px] border-feedback-destructive-border bg-feedback-destructive-bg text-feedback-destructive-text **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:text-feedback-destructive-text" role="alert">
          <CircleAlert aria-hidden="true" className="size-4 text-feedback-destructive-icon" />
          <AlertTitle>Operasi Gagal</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {successNotice && (
        <Alert className="m-0 rounded-[7px] border-feedback-success-border bg-feedback-success-bg text-feedback-success-text **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:text-feedback-success-subtle" role="status">
          <CheckCircle2 aria-hidden="true" className="size-4 text-feedback-success-icon" />
          <AlertTitle>Sukses</AlertTitle>
          <AlertDescription>{successNotice}</AlertDescription>
        </Alert>
      )}

      <form className="flex flex-col gap-5 rounded-lg border border-studio-card-border bg-card/90 p-6.25 max-[640px]:gap-4 max-[640px]:p-4.25" noValidate onSubmit={handleSubmit}>
        <div className="flex min-w-0 flex-col gap-1.75">
          <Label htmlFor="content-title">
            Title <span className="text-feedback-destructive-subtle">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "content-title-error" : undefined}
            autoComplete="off"
            id="content-title"
            maxLength={255}
            disabled={isSubmitting}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Give this idea a working title"
            value={values.title}
            className="h-10.5 rounded-[5px] border-input bg-card px-3 text-[12px] text-studio-title-secondary placeholder:text-muted-foreground"
          />
          {errors.title && <p className="m-0 text-[10px] leading-[1.4] text-feedback-destructive-subtle" id="content-title-error">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-1.75">
            <Label htmlFor="content-channel-id">
              Channel <span className="text-feedback-destructive-subtle">*</span>
            </Label>
            <Select
              value={values.channel_id}
              onValueChange={(value) => updateField("channel_id", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                aria-invalid={Boolean(errors.channel_id)}
                aria-describedby={errors.channel_id ? "content-channel-error" : undefined}
                id="content-channel-id"
                className="h-10.5 w-full rounded-[5px] border-input bg-card text-[12px] text-studio-title-secondary"
              >
                <SelectValue placeholder="Pilih channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={String(channel.id)} value={String(channel.id)}>
                    {CHANNEL_PLATFORM_LABELS[channel.platform] || channel.platform} · {channel.handle_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.channel_id && (
              <p className="m-0 text-[10px] leading-[1.4] text-feedback-destructive-subtle" id="content-channel-error">{errors.channel_id}</p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1.75">
            <Label htmlFor="content-format-type">
              Format type <span className="text-feedback-destructive-subtle">*</span>
            </Label>
            <Select
              value={values.format_type}
              onValueChange={(value) => updateField("format_type", value as ContentFormat)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                aria-invalid={Boolean(errors.format_type)}
                aria-describedby={errors.format_type ? "content-format-error" : undefined}
                id="content-format-type"
                className="h-10.5 w-full rounded-[5px] border-input bg-card text-[12px] text-studio-title-secondary"
              >
                <SelectValue placeholder="Pilih format" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_FORMATS.map((format) => (
                  <SelectItem key={format} value={format}>
                    {CONTENT_FORMAT_LABELS[format]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.format_type && (
              <p className="m-0 text-[10px] leading-[1.4] text-feedback-destructive-subtle" id="content-format-error">{errors.format_type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-1.75">
            <Label htmlFor="content-priority">Priority</Label>
            <Select
              value={values.priority}
              onValueChange={(value) => updateField("priority", value as ContentPriority)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10.5 w-full rounded-[5px] border-input bg-card text-[12px] text-studio-title-secondary" id="content-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {CONTENT_PRIORITY_LABELS[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-w-0 flex-col gap-1.75">
            <Label htmlFor="content-scheduled-date">
              Scheduled date <span className="ml-1.25 text-[9px] font-normal text-muted-foreground">Optional</span>
            </Label>
            <Input
              id="content-scheduled-date"
              name="scheduled_date"
              disabled={isSubmitting}
              onChange={(event) => updateField("scheduled_date", event.target.value)}
              type="date"
              value={values.scheduled_date}
              className="h-10.5 rounded-[5px] border-input bg-card px-3 text-[12px] text-studio-title-secondary"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1.75">
          <Label htmlFor="content-description">
            Description <span className="ml-1.25 text-[9px] font-normal text-muted-foreground">Optional</span>
          </Label>
          <Textarea
            id="content-description"
            disabled={isSubmitting}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="What is this content about?"
            rows={3}
            value={values.description}
            className="min-h-22 resize-y rounded-[5px] border-input bg-card px-3 py-2.75 text-[12px] leading-relaxed text-studio-title-secondary placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.75">
          <Label htmlFor="content-script-draft">
            Script draft <span className="ml-1.25 text-[9px] font-normal text-muted-foreground">Optional</span>
          </Label>
          <Textarea
            id="content-script-draft"
            name="script_draft"
            disabled={isSubmitting}
            onChange={(event) => updateField("script_draft", event.target.value)}
            placeholder="Add a draft or outline"
            rows={6}
            value={values.script_draft}
            className="min-h-22 resize-y rounded-[5px] border-input bg-card px-3 py-2.75 text-[12px] leading-relaxed text-studio-title-secondary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-0.75 flex justify-end gap-2.25 border-t border-studio-card-border-subtle pt-4.5 max-[640px]:flex-col-reverse">
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={contentId ? `/contents/${contentId}` : "/contents"}>Cancel</Link>
          </Button>
          <Button
            className="min-h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60 max-[640px]:w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden="true" />
                {mode === "create" ? "Saving content..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Save content"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
