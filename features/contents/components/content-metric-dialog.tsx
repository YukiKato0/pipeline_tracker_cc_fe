"use client";

import type { FormEvent } from "react";
import { Loader2, Sparkles } from "lucide-react";
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
  METRIC_FIELDS,
  METRIC_FIELD_LABELS,
  type MetricField,
  type MetricFormErrors,
  type MetricFormValues,
} from "@/features/contents/schemas/content-detail";

export interface ContentMetricDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  metricValues: MetricFormValues;
  metricErrors: MetricFormErrors;
  onMetricChange: (field: MetricField, value: string) => void;
  isRecordingMetric: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ContentMetricDialog({
  isOpen,
  onOpenChange,
  metricValues,
  metricErrors,
  onMetricChange,
  isRecordingMetric,
  onSubmit,
}: ContentMetricDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="h-8 border-input px-2.75 text-xs"
          size="sm"
          type="button"
        >
          <Sparkles aria-hidden="true" className="size-3.5" />
          <span>Record snapshot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-115 gap-5 rounded-lg max-[640px]:p-5">
        <DialogHeader>
          <p className="m-0 text-[9px] font-bold tracking-[0.14em] text-brand-section-label">PERFORMANCE METRICS</p>
          <DialogTitle className="font-serif text-[23px] font-normal text-studio-heading">Record analytics snapshot</DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-muted-foreground">
            Catat data views, likes, comments, dan shares terbaru untuk konten ini.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4.25" noValidate onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3.5">
            {METRIC_FIELDS.map((field) => (
              <div className="flex flex-col gap-1.5" key={field}>
                <Label htmlFor={`metric-${field}`}>{METRIC_FIELD_LABELS[field]}</Label>
                <Input
                  id={`metric-${field}`}
                  type="number"
                  min={0}
                  step={1}
                  disabled={isRecordingMetric}
                  value={metricValues[field]}
                  onChange={(e) => onMetricChange(field, e.target.value)}
                  placeholder="0"
                  aria-invalid={Boolean(metricErrors[field])}
                  className="h-10 rounded-[5px] border-input bg-card text-[11px] text-studio-body"
                />
                {metricErrors[field] && (
                  <p className="m-0 text-[10px] text-feedback-destructive-subtle" role="alert">
                    {metricErrors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="mt-1 gap-2.25 max-[640px]:flex-col-reverse [&_button]:rounded-[5px] [&_button]:text-[10px] max-[640px]:[&_button]:w-full">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline" disabled={isRecordingMetric}>
              Cancel
            </Button>
            <Button
              className="h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
              type="submit"
              disabled={isRecordingMetric}
            >
              {isRecordingMetric ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Save snapshot"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

