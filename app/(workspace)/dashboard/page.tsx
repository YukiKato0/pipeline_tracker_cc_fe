"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CalendarDays, Radio, RefreshCw } from "lucide-react";
import { getChannels } from "@/features/channels/services/channels-service";
import {
  CHANNEL_PLATFORM_LABELS,
  CHANNEL_PLATFORMS,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import { getContents } from "@/features/contents/services/contents-service";
import {
  CONTENT_STATUSES,
  CONTENT_STATUS_LABELS,
  type ContentStatus,
} from "@/features/contents/types/content";
import type { ContentItem } from "@/features/contents/types/content-detail";
import { getErrorMessage } from "@/lib/api/errors";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

type DashboardData = {
  contents: ContentItem[];
  channels: ChannelRecord[];
};

function formatScheduleDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function handleRetry() {
    setIsLoading(true);
    setError(null);
    setDashboardData(null);
    setReloadKey((key) => key + 1);
  }

  useEffect(() => {
    if (getSession()?.role !== "admin") {
      router.replace(getSession() ? "/contents" : "/login");
      return;
    }

    let isCurrent = true;

    Promise.all([getContents(), getChannels()])
      .then(([contents, channels]) => {
        if (isCurrent) setDashboardData({ contents, channels });
      })
      .catch((cause: unknown) => {
        if (isCurrent) {
          setError(getErrorMessage(cause, "Could not load dashboard data."));
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [router, reloadKey]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-342.5" aria-busy="true" role="status">
        <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">ADMINISTRATION</p>
        <h1 className="m-0 font-serif text-4xl font-normal text-studio-heading">Dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">Loading workspace overview...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="mx-auto w-full max-w-342.5">
        <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">ADMINISTRATION</p>
        <h1 className="m-0 font-serif text-4xl font-normal text-studio-heading">Dashboard</h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <p className="m-0 text-destructive">{error ?? "Could not load dashboard data."}</p>
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw aria-hidden="true" size={14} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const { contents, channels } = dashboardData;
  const publishedCount = contents.filter((content) => content.status === "published").length;
  const activeCount = contents.length - publishedCount;
  const statusCounts = CONTENT_STATUSES.reduce<Record<ContentStatus, number>>(
    (counts, status) => {
      counts[status] = contents.filter((content) => content.status === status).length;
      return counts;
    },
    { idea: 0, scripting: 0, recording: 0, editing: 0, ready: 0, published: 0 }
  );
  const upcomingContents = contents
    .filter((content) => content.status !== "published" && content.scheduled_date)
    .sort((first, second) => {
      return Date.parse(first.scheduled_date ?? "") - Date.parse(second.scheduled_date ?? "");
    })
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-342.5">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">ADMINISTRATION</p>
          <h1 className="m-0 font-serif text-4xl font-normal text-studio-heading">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">A live overview of your content operation.</p>
        </div>
        <Link
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          href="/contents"
        >
          Open pipeline <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </header>

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <p className="m-0 text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw aria-hidden="true" size={14} /> Retry
          </Button>
        </div>
      )}

      <section aria-label="Workspace totals" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total content", value: contents.length, detail: "Across all workflow stages" },
          { label: "In production", value: activeCount, detail: "Not yet published" },
          { label: "Published", value: publishedCount, detail: "Completed content" },
          { label: "Channels", value: channels.length, detail: "Connected platforms" },
        ].map((stat) => (
          <article key={stat.label} className="rounded-md border border-studio-card-border bg-card px-4 py-4 shadow-sm">
            <p className="m-0 text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-3 mb-1 font-serif text-3xl text-studio-heading">{stat.value}</p>
            <p className="m-0 text-xs text-studio-subtle-text">{stat.detail}</p>
          </article>
        ))}
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-md border border-studio-card-border bg-card p-5 shadow-sm" aria-labelledby="workflow-heading">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 id="workflow-heading" className="m-0 text-base font-semibold text-studio-heading">Workflow</h2>
              <p className="mt-1 mb-0 text-xs text-muted-foreground">Content distribution by status</p>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">{contents.length} total</span>
          </div>
          <div className="space-y-4">
            {CONTENT_STATUSES.map((status) => {
              const count = statusCounts[status];
              const percentage = contents.length ? (count / contents.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{CONTENT_STATUS_LABELS[status]}</span>
                    <span className="tabular-nums text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-studio-card-border bg-card p-5 shadow-sm" aria-labelledby="channels-heading">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 id="channels-heading" className="m-0 text-base font-semibold text-studio-heading">Channel mix</h2>
              <p className="mt-1 mb-0 text-xs text-muted-foreground">Connected accounts by platform</p>
            </div>
            <Radio aria-hidden="true" className="text-muted-foreground" size={17} />
          </div>
          {channels.length === 0 ? (
            <p className="m-0 py-5 text-sm text-muted-foreground">No channels connected yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {CHANNEL_PLATFORMS.map((platform) => {
                const count = channels.filter((channel) => channel.platform === platform).length;
                return (
                  <div key={platform} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-sm font-medium text-foreground">{CHANNEL_PLATFORM_LABELS[platform]}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="mt-5 rounded-md border border-studio-card-border bg-card p-5 shadow-sm" aria-labelledby="schedule-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 id="schedule-heading" className="m-0 text-base font-semibold text-studio-heading">Upcoming schedule</h2>
            <p className="mt-1 mb-0 text-xs text-muted-foreground">Next content with a scheduled date</p>
          </div>
          <CalendarDays aria-hidden="true" className="text-muted-foreground" size={17} />
        </div>
        {upcomingContents.length === 0 ? (
          <p className="m-0 py-4 text-sm text-muted-foreground">Nothing scheduled yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {upcomingContents.map((content) => (
              <div key={content.id} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="m-0 truncate text-sm font-medium text-foreground">{content.title}</p>
                  <p className="mt-1 mb-0 text-xs text-muted-foreground">
                    {content.channel?.handle_name ?? "Channel not available"} · {CONTENT_STATUS_LABELS[content.status]}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-medium tabular-nums text-studio-subtle-text" dateTime={content.scheduled_date ?? undefined}>
                  {content.scheduled_date ? formatScheduleDate(content.scheduled_date) : "Date not set"}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}