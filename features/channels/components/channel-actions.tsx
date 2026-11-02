"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { FeedbackAlert } from "@/components/custom/feedback-alert";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CHANNEL_PLATFORM_LABELS,
  CHANNEL_PLATFORMS,
  type ChannelPlatform,
  type ChannelRecord,
} from "@/features/channels/types/channel";
import { validateChannelForm, type ChannelFormValues } from "@/features/channels/schemas/channel-form";
import { deleteChannel, updateChannel } from "@/features/channels/services/channels-service";
import { getErrorMessage } from "@/lib/api/errors";

export interface ChannelActionsProps {
  channel: ChannelRecord;
  onUpdated: (channel: ChannelRecord) => void;
  onDeleted: (channel: ChannelRecord) => void;
}

export function ChannelActions({ channel, onUpdated, onDeleted }: ChannelActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState<ChannelFormValues>({
    platform: channel.platform,
    handle_name: channel.handle_name,
  });

  function handleEditOpenChange(open: boolean) {
    setIsEditOpen(open);
    if (open) {
      setValues({ platform: channel.platform, handle_name: channel.handle_name });
      setErrorMessage("");
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const errors = validateChannelForm(values);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0] || "Data channel tidak valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateChannel(channel.id, {
        platform: values.platform as ChannelPlatform,
        handle_name: values.handle_name.trim(),
      });
      onUpdated(updated);
      setIsEditOpen(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Gagal memperbarui channel."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await deleteChannel(channel.id);
      setIsDeleteOpen(false);
      onDeleted(channel);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Gagal menghapus channel."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm" className="size-7 rounded-[5px]" type="button" aria-label={`Edit ${channel.handle_name}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-115 gap-5 rounded-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-[23px] font-normal text-studio-heading">Edit channel</DialogTitle>
              <DialogDescription className="text-[11px]">Perbarui platform atau nama channel.</DialogDescription>
            </DialogHeader>
            {errorMessage && <FeedbackAlert type="error" title="Gagal Menyimpan" message={errorMessage} />}
            <form className="flex flex-col gap-4.25" noValidate onSubmit={handleUpdate}>
              <div className="flex flex-col gap-1.75">
                <Label htmlFor={`platform-${channel.id}`}>Platform</Label>
                <Select
                  value={values.platform}
                  onValueChange={(value) => setValues((current) => ({ ...current, platform: value as ChannelPlatform }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-10.25 w-full" id={`platform-${channel.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>{CHANNEL_PLATFORM_LABELS[platform]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.75">
                <Label htmlFor={`handle-${channel.id}`}>Handle channel</Label>
                <Input
                  id={`handle-${channel.id}`}
                  maxLength={100}
                  disabled={isSubmitting}
                  value={values.handle_name}
                  onChange={(event) => setValues((current) => ({ ...current, handle_name: event.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title={`Hapus ${channel.handle_name}?`}
          description="Channel beserta konten yang terhubung akan dihapus dari akun Anda."
          variant="destructive"
          confirmText="Hapus channel"
          isLoading={isSubmitting}
          onConfirm={handleDelete}
        >
          {errorMessage && <FeedbackAlert type="error" message={errorMessage} onDismiss={() => setErrorMessage("")} />}
        </ConfirmDialog>
        <Button
          variant="outline"
          size="icon-sm"
          className="size-7 rounded-[5px] text-destructive hover:bg-destructive/10"
          type="button"
          aria-label={`Hapus ${channel.handle_name}`}
          onClick={() => {
            setErrorMessage("");
            setIsDeleteOpen(true);
          }}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
