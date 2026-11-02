import { Loader2, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  CHANNEL_PLATFORM_LABELS,
  CHANNEL_PLATFORMS,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import { PlatformIcon } from "@/features/channels/components/platform-icon";
import { ChannelCard } from "@/features/channels/components/channel-card";

export interface ChannelTableProps {
  channels: ChannelRecord[];
  isLoading: boolean;
}

export function ChannelTable({ channels, isLoading }: ChannelTableProps) {
  return (
    <section aria-labelledby="channel-directory-title" className="overflow-hidden rounded-lg border border-studio-card-border bg-card/90 shadow-sm">
      <div className="flex min-h-19.75 items-center justify-between border-b border-studio-card-border-subtle px-5.75 py-4 max-[640px]:px-3.75">
        <div>
          <p className="mb-1.75 text-[9px] font-bold tracking-[0.14em] text-studio-label-muted">DIRECTORY</p>
          <h2 className="m-0 text-[15px] font-semibold text-studio-title-secondary" id="channel-directory-title">Connected channels</h2>
        </div>
        <Badge className="h-6 rounded border-studio-pill-border bg-studio-pill-bg text-[9px] text-studio-pill-text" variant="outline">
          {isLoading ? "SYNCING..." : `${channels.length} CHANNELS`}
        </Badge>
      </div>

      <div className="space-y-2.5 p-3.5 min-[641px]:hidden">
        {isLoading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-2.5 py-8 text-center text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
            <span className="text-[12px]">Memuat daftar channel dari backend...</span>
          </div>
        ) : channels.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            Belum ada channel terdaftar.
          </p>
        ) : (
          channels.map((channel) => <ChannelCard channel={channel} key={String(channel.id)} />)
        )}
      </div>

      <div className="hidden overflow-x-auto min-[641px]:block">
        <table className="w-full min-w-130 border-collapse">
          <thead>
            <tr>
              <th className="border-b border-studio-card-border-subtle bg-studio-card-header px-5 py-3.25 text-left text-[9px] font-semibold tracking-[0.08em] text-studio-label-muted uppercase" scope="col">Platform</th>
              <th className="border-b border-studio-card-border-subtle bg-studio-card-header px-5 py-3.25 text-left text-[9px] font-semibold tracking-[0.08em] text-studio-label-muted uppercase" scope="col">Channel name</th>
              <th className="border-b border-studio-card-border-subtle bg-studio-card-header px-5 py-3.25 text-left text-[9px] font-semibold tracking-[0.08em] text-studio-label-muted uppercase" scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex min-h-48 flex-col items-center justify-center gap-2.5 py-8 text-center text-muted-foreground">
                    <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
                    <span className="text-[12px]">Memuat daftar channel dari backend...</span>
                  </div>
                </td>
              </tr>
            ) : channels.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex min-h-78.75 flex-col items-center justify-center px-5 py-8.5 text-center max-[640px]:min-h-75 max-[640px]:px-4">
                    <span className="mb-4.25 inline-flex size-13.5 items-center justify-center rounded-full border border-studio-icon-border bg-studio-icon-bg text-studio-icon-text" aria-hidden="true">
                      <Radio size={22} strokeWidth={1.7} />
                    </span>
                    <h3 className="m-0 font-serif text-[21px] font-normal text-studio-heading">Belum ada channel terdaftar</h3>
                    <p className="mt-2 max-w-97.5 text-[11px] leading-relaxed text-muted-foreground">
                      Klik tombol &quot;Add channel&quot; di atas untuk mendaftarkan channel platform YouTube, TikTok, Instagram, atau LinkedIn Anda.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Supported platforms">
                      {CHANNEL_PLATFORMS.map((platformName) => (
                        <span className="inline-flex min-h-7.25 items-center gap-1.5 rounded border border-studio-tag-border bg-studio-tag-bg px-2.25 text-[9px] text-studio-tag-text" key={platformName}>
                          <PlatformIcon platform={platformName} size={14} />
                          {CHANNEL_PLATFORM_LABELS[platformName]}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              channels.map((channel) => (
                <tr key={String(channel.id)} className="transition-colors hover:bg-studio-card-header">
                  <td className="border-b border-studio-card-border-subtle px-5 py-3.5 text-left text-[12px] font-medium text-studio-heading">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-studio-icon-text">
                        <PlatformIcon platform={channel.platform} size={14} />
                      </span>
                      <span>{CHANNEL_PLATFORM_LABELS[channel.platform] || channel.platform}</span>
                    </span>
                  </td>
                  <td className="border-b border-studio-card-border-subtle px-5 py-3.5 text-left text-[12px] text-studio-body">
                    <span className="font-semibold">{channel.handle_name}</span>
                  </td>
                  <td className="border-b border-studio-card-border-subtle px-5 py-3.5 text-left text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-feedback-success-pill-border bg-feedback-success-pill-bg px-2.25 py-0.5 text-[9px] font-semibold text-feedback-success-pill-text">
                      <span className="size-1.5 rounded-full bg-feedback-success-pill-dot" aria-hidden="true" />
                      CONNECTED
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

