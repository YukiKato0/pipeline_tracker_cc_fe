import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Calendar,
  CircleAlert,
  Clapperboard,
  Edit2,
  Eye,
  ListFilter,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { channelPreviewRecords } from "@/features/channels/mock/channel-preview";
import {
  CHANNEL_PLATFORM_LABELS,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import {
  CONTENT_FORMAT_LABELS,
  CONTENT_FORMATS,
  CONTENT_STATUSES,
  CONTENT_STATUS_LABELS,
  isContentFormat,
  isContentStatus,
  type ContentFormat,
  type ContentStatus,
} from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { getChannels } from "@/features/channels/services/channels-service";
import { getContents } from "@/features/contents/services/contents-service";
import { getErrorMessage } from "@/lib/api/errors";
import {
  ContentPriorityBadge,
  ContentStatusBadge,
} from "@/features/contents/components/content-badges";
import { PlatformIcon } from "@/features/channels/components/platform-icon";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleValue(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

async function ContentPipelineContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawStatus = getSingleValue(params.status);
  const selectedStatus: ContentStatus | "" = isContentStatus(rawStatus) ? rawStatus : "";
  const rawFormat = getSingleValue(params.format);
  const selectedFormat: ContentFormat | "" = isContentFormat(rawFormat) ? rawFormat : "";
  const selectedChannelId = getSingleValue(params.channel_id).trim();
  const rawPlatform = getSingleValue(params.platform).trim();

  let channels: ChannelRecord[] = [];
  try {
    channels = await getChannels();
  } catch {
    channels = channelPreviewRecords;
  }
  if (!channels || channels.length === 0) {
    channels = channelPreviewRecords;
  }

  const selectedPlatform = channels.some((c) => c.platform === rawPlatform) ? rawPlatform : "";
  const activeChannel = channels.find((c) => String(c.id) === selectedChannelId);
  const hasFilters = Boolean(selectedStatus || selectedChannelId || selectedFormat || selectedPlatform);

  let contents: ContentItem[] = [];
  let backendError: string | null = null;

  try {
    contents = await getContents({
      status: selectedStatus || undefined,
      channel_id: selectedChannelId || undefined,
    });
  } catch (err: unknown) {
    backendError = getErrorMessage(err, "Koneksi ke backend belum tersedia.");
    contents = [];
  }

  // Filter client-side by format or platform if specified
  let displayedContents = contents;
  if (selectedFormat) {
    displayedContents = displayedContents.filter((c) => c.format_type === selectedFormat);
  }
  if (selectedPlatform) {
    displayedContents = displayedContents.filter(
      (c) => c.channel?.platform === selectedPlatform
    );
  }

  // Count items per status
  const statusCounts: Record<ContentStatus, number> = {
    idea: 0,
    scripting: 0,
    recording: 0,
    editing: 0,
    ready: 0,
    published: 0,
  };
  contents.forEach((item) => {
    if (isContentStatus(item.status)) {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    }
  });

  return (
    <div className="mx-auto max-w-342.5">
      <div className="mb-7 flex items-center justify-between max-[640px]:items-start max-[640px]:gap-3.5">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT OPERATIONS</p>
          <h1 className="m-0 font-serif text-[clamp(34px,4vw,46px)] font-normal leading-[1.08] text-studio-heading max-[640px]:text-4xl">Content pipeline</h1>
          <p className="mt-2.75 max-w-67.5 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
            Every story, from the first spark to the final publish.
          </p>
        </div>
        <Button asChild className="mt-1 min-h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover max-[640px]:mt-5.75 max-[640px]:shrink-0">
          <Link href="/contents/new">
            <Plus aria-hidden="true" data-icon="inline-start" />
            New content
          </Link>
        </Button>
      </div>

      {backendError && (
        <Alert className="mb-5 grid-cols-[18px_1fr] items-start rounded-[7px] border-feedback-destructive-border bg-feedback-destructive-bg px-3.75 py-3.25 text-feedback-destructive-text [&>svg]:mt-px [&>svg]:text-feedback-destructive-icon **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:leading-normal **:data-[slot=alert-description]:text-feedback-destructive-text">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Koneksi Server Tertunda</AlertTitle>
          <AlertDescription>
            {backendError}. Pastikan server backend aktif di endpoint yang terkonfigurasi. Anda juga dapat membuka sampel pratinjau di bawah.
          </AlertDescription>
        </Alert>
      )}

      <section aria-label="Content lifecycle" className="overflow-hidden rounded-[9px] border border-studio-card-border bg-card/85 shadow-sm">
        <div className="flex min-h-23 items-center justify-between border-b border-studio-card-border-subtle px-6.25 py-5 max-[640px]:min-h-19.75 max-[640px]:px-4">
          <div>
            <span className="mb-1.75 block text-[9px] font-bold tracking-[0.14em] text-studio-label-muted">THE WORKFLOW</span>
            <h2 className="m-0 text-base font-semibold text-studio-title-secondary">Production stages</h2>
          </div>
          <span className="rounded bg-muted px-2.25 py-1.75 text-[9px] font-bold tracking-[0.14em] text-muted-foreground">
            {contents.length} ACTIVE ITEMS
          </span>
        </div>

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

        <div className="border-b border-studio-card-border-subtle px-6 pb-5 pt-4.5 max-[640px]:px-3.5 max-[640px]:py-4">
          <div className="mb-3.25 flex items-center gap-2 text-[11px] font-semibold text-studio-body">
            <ListFilter aria-hidden="true" size={16} />
            <span>Filter content</span>
          </div>
          <form action="/contents" className="flex flex-wrap items-end gap-2.75 max-[640px]:grid max-[640px]:grid-cols-2" method="get">
            <div className="flex max-w-55 min-w-0 flex-[1_1_150px] flex-col gap-1.5 max-[640px]:max-w-none">
              <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-status">Status</label>
              <select className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body" defaultValue={selectedStatus} id="filter-status" name="status">
                <option value="">All statuses</option>
                {CONTENT_STATUSES.map((status) => (
                  <option key={status} value={status}>{CONTENT_STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
            <div className="flex max-w-55 min-w-0 flex-[1_1_180px] flex-col gap-1.5 max-[640px]:max-w-none">
              <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-format">Format</label>
              <select className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body" defaultValue={selectedFormat} id="filter-format" name="format">
                <option value="">All formats</option>
                {CONTENT_FORMATS.map((format) => (
                  <option key={format} value={format}>{CONTENT_FORMAT_LABELS[format]}</option>
                ))}
              </select>
            </div>
            <div className="flex max-w-55 min-w-0 flex-[1_1_220px] flex-col gap-1.5 max-[640px]:col-span-full max-[640px]:max-w-none">
              <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-channel-id">Channel</label>
              <select className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body" defaultValue={selectedChannelId} id="filter-channel-id" name="channel_id">
                <option value="">All channels</option>
                {channels.map((channel) => (
                  <option key={String(channel.id)} value={String(channel.id)}>
                    {CHANNEL_PLATFORM_LABELS[channel.platform] || channel.platform} · {channel.handle_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex max-w-55 min-w-0 flex-[1_1_180px] flex-col gap-1.5 max-[640px]:max-w-none">
              <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-platform">Platform</label>
              <select className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body" defaultValue={selectedPlatform} id="filter-platform" name="platform">
                <option value="">All platforms</option>
                {Object.entries(CHANNEL_PLATFORM_LABELS).map(([platformName, label]) => (
                  <option key={platformName} value={platformName}>{label}</option>
                ))}
              </select>
            </div>
            <Button className="h-9.25 rounded-[5px] border-input text-[10px] text-studio-body" type="submit" variant="outline">
              Apply filters
            </Button>
            {hasFilters && (
              <Button asChild className="h-9.25 rounded-[5px] text-[10px] max-[640px]:justify-center" variant="ghost">
                <Link href="/contents">Clear</Link>
              </Button>
            )}
          </form>

          {hasFilters && (
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-semibold text-studio-title-secondary">Active:</span>
              {selectedStatus && (
                <span className="rounded border border-studio-tag-border bg-studio-tag-bg px-2 py-0.5">
                  Status: {CONTENT_STATUS_LABELS[selectedStatus]}
                </span>
              )}
              {selectedFormat && (
                <span className="rounded border border-studio-tag-border bg-studio-tag-bg px-2 py-0.5">
                  Format: {CONTENT_FORMAT_LABELS[selectedFormat]}
                </span>
              )}
              {selectedChannelId && (
                <span className="rounded border border-studio-tag-border bg-studio-tag-bg px-2 py-0.5">
                  Channel: {activeChannel ? `${CHANNEL_PLATFORM_LABELS[activeChannel.platform] || activeChannel.platform} · ${activeChannel.handle_name}` : selectedChannelId}
                </span>
              )}
              {selectedPlatform && (
                <span className="rounded border border-studio-tag-border bg-studio-tag-bg px-2 py-0.5">
                  Platform: {CHANNEL_PLATFORM_LABELS[selectedPlatform as keyof typeof CHANNEL_PLATFORM_LABELS] || selectedPlatform}
                </span>
              )}
            </div>
          )}
        </div>

        {displayedContents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 max-[640px]:p-3.5">
            {displayedContents.map((content) => {
              const platform = content.channel?.platform || "youtube";

              return (
                <div
                  key={String(content.id)}
                  className="flex flex-col justify-between rounded-lg border border-studio-card-border bg-card p-4.5 transition-shadow hover:shadow-md"
                >
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

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-[10px] text-muted-foreground">
                        <Link href={`/contents/${content.id}/edit`}>
                          <Edit2 size={12} className="mr-1" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-7 border-input text-[10px] text-primary">
                        <Link href={`/contents/${content.id}`}>
                          <Eye size={12} className="mr-1" aria-hidden="true" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-71.25 flex-col items-center justify-center px-5 pb-9.5 pt-7.5 text-center">
            <div className="relative mb-4.25 flex size-14.5 items-center justify-center rounded-full border border-studio-icon-border bg-studio-icon-bg text-studio-icon-text" aria-hidden="true">
              <Clapperboard size={24} strokeWidth={1.6} />
              <span className="absolute -right-0.5 -top-px size-2.75 rounded-full border-2 border-card bg-brand-gold" />
            </div>
            <p className="mb-2 text-[9px] font-bold tracking-[0.14em] text-brand-section-label">
              {hasFilters ? "FILTERS APPLIED" : "A CLEAR FRAME"}
            </p>
            <h3 className="m-0 font-serif text-[22px] font-normal text-studio-heading">
              {hasFilters ? "Tidak ada konten yang cocok dengan filter" : "Belum ada konten dibuat"}
            </h3>
            <p className="mt-2.25 max-w-105 text-[12px] leading-relaxed text-muted-foreground">
              {hasFilters
                ? "Cobalah menyetel ulang filter status, format, atau channel untuk melihat seluruh item konten."
                : "Mulai perjalanan konten Anda dengan menambahkan ide baru ke dalam pipeline."}
            </p>
            {hasFilters ? (
              <Button asChild className="mt-4.5 h-8.5 rounded-[5px] bg-primary px-3.5 text-[11px] text-primary-foreground hover:bg-primary-hover" variant="default">
                <Link href="/contents">Reset all filters</Link>
              </Button>
            ) : (
              <Button asChild className="mt-4.5 h-8.5 rounded-[5px] bg-primary px-3.5 text-[11px] text-primary-foreground hover:bg-primary-hover" variant="default">
                <Link href="/contents/new">
                  <Plus className="mr-1 size-3.5" aria-hidden="true" />
                  Buat konten pertama
                </Link>
              </Button>
            )}

            <div className="mt-5.5 flex items-center justify-center gap-3 border-t border-studio-card-border-subtle pt-4">
              <span className="text-[8px] font-bold tracking-widest text-studio-caption-text">INTERACTIVE PREVIEW</span>
              <Button asChild className="h-8 rounded-[5px] border-input bg-card text-[9px] text-primary" variant="outline">
                <Link href="/contents/demo-42">
                  Open sample detail
                  <ArrowRight aria-hidden="true" data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-5.25 flex justify-between text-[8px] tracking-[0.12em] text-studio-caption-text max-[640px]:gap-4.5 max-[640px]:text-[7px]">
        <span>FRAME STUDIO</span>
        <span>PLAN WITH INTENTION. PUBLISH WITH PURPOSE.</span>
      </footer>
    </div>
  );
}

function ContentPipelineFallback() {
  return (
    <div aria-busy="true" className="mx-auto max-w-342.5" role="status">
      <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT OPERATIONS</p>
      <h1 className="m-0 font-serif text-4xl font-normal text-studio-heading">Loading content pipeline</h1>
    </div>
  );
}

export default function ContentPipelinePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<ContentPipelineFallback />}>
      <ContentPipelineContent searchParams={searchParams} />
    </Suspense>
  );
}
