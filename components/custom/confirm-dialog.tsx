"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  /** Controls dialog open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Dialog title */
  title: React.ReactNode;
  /** Dialog description or explanation */
  description?: React.ReactNode;
  /** Optional icon to display next to title or in header badge */
  icon?: React.ReactNode;
  /** Whether to show the cancel button */
  showCancelButton?: boolean;
  /** Visual variant: destructive (red), warning (amber), or default (primary) */
  variant?: "default" | "destructive" | "warning";
  /** Confirm button text (default: "Konfirmasi") */
  confirmText?: React.ReactNode;
  /** Cancel button text (default: "Batal") */
  cancelText?: React.ReactNode;
  /** Custom confirm button variant (overrides default based on dialog variant) */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary";
  /** Loading state for async actions */
  isLoading?: boolean;
  /** Callback when confirm button is clicked. Can be async */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancel button is clicked */
  onCancel?: () => void;
  /** Optional additional content in dialog body */
  children?: React.ReactNode;
  /** Optional className for DialogContent */
  className?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  showCancelButton = true,
  variant = "default",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmVariant,
  isLoading = false,
  onConfirm,
  onCancel,
  children,
  className,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const loading = isLoading || internalLoading;

  async function handleConfirm() {
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        setInternalLoading(true);
        await result;
      }
    } finally {
      setInternalLoading(false);
    }
  }

  function handleCancel() {
    onCancel?.();
    onOpenChange?.(false);
  }

  const resolvedConfirmVariant =
    confirmVariant ?? (variant === "destructive" ? "destructive" : "default");

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={showCancelButton && !loading}
        className={cn("max-w-105 gap-5 rounded-lg p-5.5 sm:max-w-md max-[640px]:p-5", className)}
      >
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            {icon && (
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                  variant === "destructive" && "border-destructive/20 bg-destructive/10 text-destructive",
                  variant === "warning" && "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  variant === "default" && "border-primary/20 bg-primary/10 text-primary"
                )}
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
              <DialogTitle
                className={cn(
                  "font-serif text-[18px] font-semibold leading-snug tracking-tight text-foreground",
                  variant === "destructive" && "text-destructive",
                  variant === "warning" && "text-amber-600 dark:text-amber-400"
                )}
              >
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-[12px] leading-relaxed text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && <div className="text-[12px] text-muted-foreground">{children}</div>}

        <DialogFooter className="gap-2 sm:gap-2 max-[640px]:flex-col-reverse [&_button]:rounded-[5px] [&_button]:text-[11px] [&_button]:font-medium">
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="h-8.5 px-3 cursor-pointer"
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="button"
            variant={resolvedConfirmVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "h-8.5 px-3.5 cursor-pointer",
              variant === "destructive" &&
                !confirmVariant &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
            )}
          >
            {loading && <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden="true" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;

