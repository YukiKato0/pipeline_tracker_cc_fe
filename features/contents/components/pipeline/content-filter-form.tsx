"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHANNEL_PLATFORM_LABELS, type ChannelRecord } from "@/features/channels/types/channel";
import {
  CONTENT_FORMAT_LABELS,
  CONTENT_FORMATS,
  CONTENT_STATUS_LABELS,
  CONTENT_STATUSES,
  type ContentFormat,
  type ContentStatus,
} from "@/features/contents/types/content";

interface ContentFilterFormProps {
  channels: ChannelRecord[];
  selectedStatus: ContentStatus | "";
  selectedFormat: ContentFormat | "";
  selectedChannelId: string;
  selectedPlatform: string;
  hasFilters: boolean;
  activeChannel?: ChannelRecord;
}

export function ContentFilterForm({
  channels,
  selectedStatus,
  selectedFormat,
  selectedChannelId,
  selectedPlatform,
  hasFilters,
  activeChannel,
}: ContentFilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State lokal untuk form filter
  const [status, setStatus] = useState<string>(selectedStatus);
  const [format, setFormat] = useState<string>(selectedFormat);
  const [channelId, setChannelId] = useState<string>(selectedChannelId);
  const [platform, setPlatform] = useState<string>(selectedPlatform);

  // Handle submit filter (memperbarui URL search params)
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (status) params.set("status", status);
    else params.delete("status");

    if (format) params.set("format", format);
    else params.delete("format");

    if (channelId) params.set("channel_id", channelId);
    else params.delete("channel_id");

    if (platform) params.set("platform", platform);
    else params.delete("platform");

    router.push(`/contents?${params.toString()}`);
  };

  // Handle clear filter (membersihkan semua state dan parameter URL)
  const handleClearFilters = () => {
    setStatus("");
    setFormat("");
    setChannelId("");
    setPlatform("");
    router.push("/contents");
  };

  return (
    <div className="border-b border-studio-card-border-subtle px-6 pb-5 pt-4.5 max-[640px]:px-3.5 max-[640px]:py-4">
      <div className="mb-3.25 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-studio-body">
          <ListFilter aria-hidden="true" size={16} />
          <span>Filter content</span>
        </div>
      </div>

      <form onSubmit={handleApplyFilters} className="flex flex-wrap items-end gap-2.75 max-[640px]:grid max-[640px]:grid-cols-2">
        {/* Status Filter */}
        <div className="flex max-w-55 min-w-0 flex-[1_1_150px] flex-col gap-1.5 max-[640px]:max-w-none">
          <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-status">
            Status
          </label>
          <Select
            value={status || "all"}
            onValueChange={(val) => setStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger id="filter-status" className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {CONTENT_STATUSES.map((itemStatus) => (
                <SelectItem key={itemStatus} value={itemStatus}>
                  {CONTENT_STATUS_LABELS[itemStatus]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format Filter */}
        <div className="flex max-w-55 min-w-0 flex-[1_1_180px] flex-col gap-1.5 max-[640px]:max-w-none">
          <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-format">
            Format
          </label>
          <Select
            value={format || "all"}
            onValueChange={(val) => setFormat(val === "all" ? "" : val)}
          >
            <SelectTrigger id="filter-format" className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body">
              <SelectValue placeholder="All formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formats</SelectItem>
              {CONTENT_FORMATS.map((itemFormat) => (
                <SelectItem key={itemFormat} value={itemFormat}>
                  {CONTENT_FORMAT_LABELS[itemFormat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Channel Filter */}
        <div className="flex max-w-55 min-w-0 flex-[1_1_220px] flex-col gap-1.5 max-[640px]:col-span-full max-[640px]:max-w-none">
          <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-channel-id">
            Channel
          </label>
          <Select
            value={channelId || "all"}
            onValueChange={(val) => setChannelId(val === "all" ? "" : val)}
          >
            <SelectTrigger id="filter-channel-id" className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body">
              <SelectValue placeholder="All channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              {channels.map((channel) => (
                <SelectItem key={String(channel.id)} value={String(channel.id)}>
                  {CHANNEL_PLATFORM_LABELS[channel.platform] || channel.platform} · {channel.handle_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform Filter */}
        <div className="flex max-w-55 min-w-0 flex-[1_1_180px] flex-col gap-1.5 max-[640px]:max-w-none">
          <label className="text-[10px] font-semibold text-muted-foreground" htmlFor="filter-platform">
            Platform
          </label>
          <Select
            value={platform || "all"}
            onValueChange={(val) => setPlatform(val === "all" ? "" : val)}
          >
            <SelectTrigger id="filter-platform" className="h-9.25 w-full min-w-0 rounded-[5px] border border-input bg-card px-2.5 text-[11px] text-studio-body">
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {Object.entries(CHANNEL_PLATFORM_LABELS).map(([platformName, label]) => (
                <SelectItem key={platformName} value={platformName}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button className="h-9.25 rounded-[5px] border-input text-[10px] text-studio-body" type="submit" variant="outline">
            Apply filters
          </Button>
          {hasFilters && (
            <Button
              type="button"
              onClick={handleClearFilters}
              className="h-9.25 rounded-[5px] text-[10px] max-[640px]:justify-center"
              variant="ghost"
            >
              <X className="mr-1 size-3" />
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Active Filters Badges */}
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
  );
}