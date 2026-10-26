"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ChannelRecord } from "@/features/channels/types/channel";
import { getChannels } from "@/features/channels/services/channels-service";
import { AddChannelDialog } from "@/features/channels/components/add-channel-dialog";
import { ChannelTable } from "@/features/channels/components/channel-table";
import { getErrorMessage } from "@/lib/api/errors";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchChannels = () => {
    setIsLoading(true);
    setLoadError(null);
    getChannels()
      .then((data) => {
        setChannels(data);
      })
      .catch((err: unknown) => {
        const msg = getErrorMessage(err, "Gagal memuat saluran dari server backend.");
        setLoadError(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    getChannels()
      .then((data) => {
        if (!ignore) {
          setChannels(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = getErrorMessage(err, "Gagal memuat saluran dari server backend.");
          setLoadError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  function handleChannelAdded(newChannel: ChannelRecord) {
    setChannels((prev) => [newChannel, ...prev]);
    setSuccessBanner(`Channel ${newChannel.handle_name} berhasil ditambahkan!`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  }

  return (
    <div className="mx-auto max-w-342.5">
      <div className="mb-7 flex items-center justify-between max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-3.75">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">YOUR CREATOR NETWORK</p>
          <h1 className="m-0 font-serif text-[clamp(34px,4vw,46px)] font-normal leading-[1.08] text-studio-heading max-[640px]:text-4xl">Channels</h1>
          <p className="mt-2.75 max-w-67.5 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
            Keep the places where you publish in one considered directory.
          </p>
        </div>
        <div className="flex items-center gap-2.5 max-[640px]:self-start">
          <Button
            onClick={fetchChannels}
            disabled={isLoading}
            variant="outline"
            className="h-9.75 rounded-[5px] border-input px-2.75 text-[11px] text-studio-body"
            type="button"
            title="Refresh channels"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
            <span className="max-[640px]:hidden">Refresh</span>
          </Button>
          <AddChannelDialog onChannelAdded={handleChannelAdded} />
        </div>
      </div>

      {successBanner && (
        <Alert className="mb-6 rounded-[7px] border-feedback-success-border bg-feedback-success-bg px-3.75 py-3 text-feedback-success-text **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-description]:text-[10px]" role="status">
          <CheckCircle2 aria-hidden="true" className="size-4 text-feedback-success-icon" />
          <AlertTitle>Berhasil Ditambahkan</AlertTitle>
          <AlertDescription>{successBanner}</AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert className="mb-6 grid-cols-[18px_1fr] items-start rounded-[7px] border-feedback-destructive-border bg-feedback-destructive-bg px-3.75 py-3.5 text-feedback-destructive-text [&>svg]:mt-px [&>svg]:text-feedback-destructive-icon **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:leading-normal **:data-[slot=alert-description]:text-feedback-destructive-text">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Koneksi Backend Bermasalah</AlertTitle>
          <AlertDescription>
            {loadError}. Pastikan server backend Anda aktif di endpoint yang terkonfigurasi.
          </AlertDescription>
        </Alert>
      )}

      <ChannelTable channels={channels} isLoading={isLoading} />
    </div>
  );
}
