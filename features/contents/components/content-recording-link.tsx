"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContentRecordingLinkProps {
  contentId: string | number;
  value: string;
  canEdit: boolean;
  onSave: (url: string) => Promise<void>;
}

function isGoogleDriveUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      ["drive.google.com", "docs.google.com"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function ContentRecordingLink({ contentId, value, canEdit, onSave }: ContentRecordingLinkProps) {
  const [url, setUrl] = useState(value);
  const [savedUrl, setSavedUrl] = useState(value);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextUrl = url.trim();

    if (nextUrl && !isGoogleDriveUrl(nextUrl)) {
      setError("Masukkan tautan Google Drive yang valid.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await onSave(nextUrl);
      setSavedUrl(nextUrl);
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan link hasil recording.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section aria-labelledby="recording-link-title" className="min-w-0 rounded-lg border border-studio-card-border bg-card/90 p-5 max-[640px]:px-3.5 max-[640px]:py-4">
      <div className="mb-3.5 flex items-center gap-2.5">
        <Link2 aria-hidden="true" className="size-4 text-primary" />
        <div>
          <p className="mb-1 text-[8px] font-bold tracking-[0.14em] text-studio-label-muted">RECORDING OUTPUT</p>
          <h2 className="m-0 text-sm font-semibold text-studio-title-secondary" id="recording-link-title">Link hasil recording</h2>
        </div>
      </div>

      {url && (
        <a className="mb-3 flex min-w-0 items-center gap-2 text-[11px] font-medium text-primary no-underline hover:underline" href={url} rel="noreferrer" target="_blank">
          <span className="min-w-0 break-all">{url}</span>
          <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
        </a>
      )}

      {canEdit ? (
        <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
          <Label className="sr-only" htmlFor={`recording-drive-url-${contentId}`}>Tautan Google Drive hasil recording</Label>
          <Input
            autoComplete="url"
            id={`recording-drive-url-${contentId}`}
            onChange={(event) => {
              setUrl(event.target.value);
              setError("");
            }}
            placeholder="https://drive.google.com/..."
            type="url"
            value={url}
          />
          {error && <p className="m-0 text-[10px] text-destructive" role="alert">{error}</p>}
          <div className="flex justify-end">
            <Button className="h-8 text-[10px]" disabled={isSaving || url.trim() === savedUrl} type="submit">
              {isSaving ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : null}
              {isSaving ? "Menyimpan..." : "Simpan link"}
            </Button>
          </div>
        </form>
      ) : !url ? (
        <p className="m-0 text-[10px] text-muted-foreground">Belum ada link hasil recording.</p>
      ) : null}
    </section>
  );
}