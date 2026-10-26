import { Suspense } from "react";
import { channelPreviewRecords } from "@/features/channels/mock/channel-preview";
import {
  isContentFormat,
  isContentStatus,
  type ContentFormat,
  type ContentStatus,
} from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { getChannels } from "@/features/channels/services/channels-service";
import { getContents } from "@/features/contents/services/contents-service";
import { getErrorMessage } from "@/lib/api/errors";

// Import komponen modular
import { ContentPipelineHeader } from "@/features/contents/components/pipeline/content-pipeline-header";
import { BackendErrorAlert } from "@/features/contents/components/pipeline/backend-error-alert";
import { WorkflowStages, WorkflowStagesList } from "@/features/contents/components/pipeline/workflow-stages";
import { ContentFilterForm } from "@/features/contents/components/pipeline/content-filter-form";
import { ContentCard } from "@/features/contents/components/pipeline/content-card";
import { ContentEmptyState } from "@/features/contents/components/pipeline/content-empty-state";
import { ContentPipelineFooter } from "@/features/contents/components/pipeline/content-pipeline-footer";

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

  let channels = [];
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

  let displayedContents = contents;
  if (selectedFormat) {
    displayedContents = displayedContents.filter((c) => c.format_type === selectedFormat);
  }
  if (selectedPlatform) {
    displayedContents = displayedContents.filter(
      (c) => c.channel?.platform === selectedPlatform
    );
  }

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
      <ContentPipelineHeader />

      {backendError && <BackendErrorAlert message={backendError} />}

      <section aria-label="Content lifecycle" className="overflow-hidden rounded-[9px] border border-studio-card-border bg-card/85 shadow-sm">
        <WorkflowStages totalItems={contents.length} statusCounts={statusCounts} />
        <WorkflowStagesList statusCounts={statusCounts} />

        <ContentFilterForm
          channels={channels}
          selectedStatus={selectedStatus}
          selectedFormat={selectedFormat}
          selectedChannelId={selectedChannelId}
          selectedPlatform={selectedPlatform}
          hasFilters={hasFilters}
          activeChannel={activeChannel}
        />

        {displayedContents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 max-[640px]:p-3.5">
            {displayedContents.map((content) => (
              <ContentCard key={String(content.id)} content={content} />
            ))}
          </div>
        ) : (
          <ContentEmptyState hasFilters={hasFilters} />
        )}
      </section>

      <ContentPipelineFooter />
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