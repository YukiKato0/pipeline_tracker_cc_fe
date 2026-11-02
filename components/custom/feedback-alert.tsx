"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "cn";

export type FeedbackAlertType = "success" | "error";

export interface FeedbackAlertProps {
  type: FeedbackAlertType;
  message: string;
  title?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  className?: string;
}

export function FeedbackAlert({
  type,
  message,
  title,
  onDismiss,
  autoDismissMs,
  className,
}: FeedbackAlertProps) {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!onDismissRef.current || autoDismissMs === 0) return;

    const timeout = window.setTimeout(() => {
      onDismissRef.current?.();
    }, autoDismissMs ?? (type === "success" ? 3_000 : 3_000));

    return () => window.clearTimeout(timeout);
  }, [autoDismissMs, message, type]);

  const isSuccess = type === "success";

  return (
    <Alert
      className={cn(
        "mb-5 rounded-[7px] px-3.5 py-3 text-[11px]",
        isSuccess
          ? "border-feedback-success-border bg-feedback-success-bg text-feedback-success-text"
          : "border-feedback-destructive-border bg-feedback-destructive-bg text-feedback-destructive-text",
        className
      )}
      role={isSuccess ? "status" : "alert"}
    >
      {isSuccess ? (
        <CheckCircle2 className="size-4 text-feedback-success-icon" aria-hidden="true" />
      ) : (
        <CircleAlert className="size-4 text-feedback-destructive-icon" aria-hidden="true" />
      )}
      <AlertTitle>{title ?? (isSuccess ? "Berhasil" : "Pemberitahuan")}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <AlertAction>
          <button
            type="button"
            onClick={onDismiss}
            className="flex size-5 cursor-pointer items-center justify-center rounded-sm text-current opacity-70 hover:opacity-100"
            aria-label="Tutup pemberitahuan"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </AlertAction>
      )}
    </Alert>
  );
}
