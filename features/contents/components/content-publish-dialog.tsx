"use client";

import type { FormEvent } from "react";
import { CircleAlert, ExternalLink, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ContentPublishDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  urlInput: string;
  onUrlInputChange: (value: string) => void;
  error: string;
  isPublishing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ContentPublishDialog({
  isOpen,
  onOpenChange,
  urlInput,
  onUrlInputChange,
  error,
  isPublishing,
  onSubmit,
}: ContentPublishDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-115 gap-5 rounded-lg max-[640px]:p-5">
        <DialogHeader>
          <p className="m-0 text-[9px] font-bold tracking-[0.14em] text-brand-section-label">PUBLICATION</p>
          <DialogTitle className="font-serif text-[23px] font-normal text-studio-heading">Publish content</DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-muted-foreground">
            Untuk memindahkan konten ke tahap Published, masukkan tautan publikasi resmi.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="-mt-1 rounded-md border-feedback-destructive-border bg-feedback-destructive-bg text-[10px] leading-normal text-feedback-destructive-text **:data-[slot=alert-title]:text-[10px] **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:text-feedback-destructive-text" role="alert">
            <CircleAlert aria-hidden="true" className="size-3.5 text-feedback-destructive-icon" />
            <AlertTitle>Validasi Publikasi Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="flex flex-col gap-4.25" noValidate onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.75">
            <Label htmlFor="publish-url-field">
              Published URL <span className="text-feedback-destructive-subtle">*</span>
            </Label>
            <Input
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "publish-url-error" : undefined}
              id="publish-url-field"
              disabled={isPublishing}
              onChange={(e) => onUrlInputChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=... atau https://instagram.com/p/..."
              value={urlInput}
              className="h-10.25 rounded-[5px] border-input bg-card text-[11px] text-studio-body"
            />
          </div>

          <DialogFooter className="mt-1 gap-2.25 max-[640px]:flex-col-reverse [&_button]:rounded-[5px] [&_button]:text-[10px] max-[640px]:[&_button]:w-full">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline" disabled={isPublishing}>
              Cancel
            </Button>
            <Button
              className="h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
              type="submit"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden="true" />
                  Publishing...
                </>
              ) : (
                <>
                  <ExternalLink aria-hidden="true" className="mr-1 size-3.5" />
                  Publish now
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

