"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CHANNEL_PLATFORM_LABELS,
  CHANNEL_PLATFORMS,
  type ChannelPlatform,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import {
  initialChannelFormValues,
  validateChannelForm,
  type ChannelFormErrors,
  type ChannelFormValues,
} from "@/features/channels/schemas/channel-form";
import { createChannel } from "@/features/channels/services/channels-service";
import { getErrorMessage } from "@/lib/api/errors";

export interface AddChannelDialogProps {
  onChannelAdded: (channel: ChannelRecord) => void;
}

export function AddChannelDialog({ onChannelAdded }: AddChannelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<ChannelFormValues>(initialChannelFormValues);
  const [errors, setErrors] = useState<ChannelFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      setErrors({});
      setErrorMessage("");
      setValues(initialChannelFormValues);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    const nextErrors = validateChannelForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createChannel({
        platform: values.platform as ChannelPlatform,
        handle_name: values.handle_name.trim(),
      });
      onChannelAdded(created);
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Gagal menambahkan channel ke server.");
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover" type="button">
          <Plus aria-hidden="true" data-icon="inline-start" />
          Add channel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-115 gap-5 rounded-lg max-[640px]:p-5">
        <DialogHeader>
          <p className="m-0 text-[9px] font-bold tracking-[0.14em] text-brand-section-label">CHANNEL DIRECTORY</p>
          <DialogTitle className="font-serif text-[23px] font-normal text-studio-heading">Add a channel</DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-muted-foreground">
            Choose a platform and enter the name you use to identify this channel.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert className="-mt-1 rounded-md border-feedback-destructive-border bg-feedback-destructive-bg text-[10px] leading-normal text-feedback-destructive-text **:data-[slot=alert-title]:text-[10px] **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:text-feedback-destructive-text" role="alert">
            <CircleAlert aria-hidden="true" className="size-3.5 text-feedback-destructive-icon" />
            <AlertTitle>Gagal Menyimpan</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form className="flex flex-col gap-4.25" noValidate onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.75">
            <Label htmlFor="channel-platform">Platform</Label>
            <Select
              value={values.platform}
              onValueChange={(value) => {
                setValues((currentValues: ChannelFormValues) => ({
                  ...currentValues,
                  platform: value as ChannelFormValues["platform"],
                }));
                setErrors((currentErrors) => ({ ...currentErrors, platform: undefined }));
                setErrorMessage("");
              }}
            >
              <SelectTrigger
                aria-invalid={Boolean(errors.platform)}
                aria-describedby={errors.platform ? "channel-platform-error" : undefined}
                className="h-10.25 w-full rounded-[5px] border-input bg-card text-[11px] text-studio-body"
                id="channel-platform"
                disabled={isSubmitting}
              >
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {CHANNEL_PLATFORMS.map((platformName) => (
                  <SelectItem key={platformName} value={platformName}>
                    {CHANNEL_PLATFORM_LABELS[platformName]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.75">
            <Label htmlFor="channel-handle-name">Handle channel</Label>
            <Input
              autoComplete="off"
              aria-invalid={Boolean(errors.handle_name)}
              aria-describedby={errors.handle_name ? "channel-handle-error" : undefined}
              id="channel-handle-name"
              maxLength={100}
              disabled={isSubmitting}
              onChange={(event) => {
                setValues((currentValues) => ({ ...currentValues, handle_name: event.target.value }));
                setErrors((currentErrors) => ({ ...currentErrors, handle_name: undefined }));
                setErrorMessage("");
              }}
              placeholder="Contoh: @techcreator"
              value={values.handle_name}
              className="h-10.25 rounded-[5px] border-input bg-card text-[11px] text-studio-body"
            />
          </div>

          {errors.platform && <p className="-mt-1.75 m-0 text-[10px] text-feedback-destructive-subtle" id="channel-platform-error" role="alert">{errors.platform}</p>}
          {errors.handle_name && <p className="-mt-1.75 m-0 text-[10px] text-feedback-destructive-subtle" id="channel-handle-error" role="alert">{errors.handle_name}</p>}

          <DialogFooter className="mt-1 gap-2.25 max-[640px]:flex-col-reverse [&_button]:rounded-[5px] [&_button]:text-[10px] max-[640px]:[&_button]:w-full">
            <Button onClick={() => handleOpenChange(false)} type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Save channel"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

