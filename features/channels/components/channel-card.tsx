import { CHANNEL_PLATFORM_LABELS, type ChannelRecord } from "@/features/channels/types/channel";
import { PlatformIcon } from "@/features/channels/components/platform-icon";
import { ChannelActions } from "@/features/channels/components/channel-actions";

export interface ChannelCardProps {
  channel: ChannelRecord;
  onUpdated?: (channel: ChannelRecord) => void;
  onDeleted?: (channel: ChannelRecord) => void;
}

export function ChannelCard({ channel, onUpdated, onDeleted }: ChannelCardProps) {
  return (
    <article className="rounded-md border border-studio-card-border-subtle bg-card px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted text-studio-icon-text" aria-hidden="true">
          <PlatformIcon platform={channel.platform} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-studio-heading">{channel.handle_name}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {CHANNEL_PLATFORM_LABELS[channel.platform] || channel.platform}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-feedback-success-pill-border bg-feedback-success-pill-bg px-2 py-1 text-[9px] font-semibold text-feedback-success-pill-text">
          <span className="size-1.5 rounded-full bg-feedback-success-pill-dot" aria-hidden="true" />
          CONNECTED
        </span>
      </div>
      {(onUpdated || onDeleted) && (
        <div className="mt-3 flex justify-end">
          <ChannelActions channel={channel} onUpdated={onUpdated || (() => { })} onDeleted={onDeleted || (() => { })} />
        </div>
      )}
    </article>
  );
}