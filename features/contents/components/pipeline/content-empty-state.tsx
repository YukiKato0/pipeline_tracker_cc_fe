import Link from "next/link";
import { ArrowRight, Clapperboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentEmptyStateProps {
  hasFilters: boolean;
}

export function ContentEmptyState({ hasFilters }: ContentEmptyStateProps) {
  return (
    <div className="flex min-h-71.25 flex-col items-center justify-center px-5 pb-9.5 pt-7.5 text-center">
      <div className="relative mb-4.25 flex size-14.5 items-center justify-center rounded-full border border-studio-icon-border bg-studio-icon-bg text-studio-icon-text" aria-hidden="true">
        <Clapperboard size={24} strokeWidth={1.6} />
        <span className="absolute -right-0.5 -top-px size-2.75 rounded-full border-2 border-card bg-brand-gold" />
      </div>
      <p className="mb-2 text-[9px] font-bold tracking-[0.14em] text-brand-section-label">
        {hasFilters ? "FILTERS APPLIED" : "A CLEAR FRAME"}
      </p>
      <h3 className="m-0 font-serif text-[22px] font-normal text-studio-heading">
        {hasFilters ? "Tidak ada konten yang cocok dengan filter" : "Belum ada konten dibuat"}
      </h3>
      <p className="mt-2.25 max-w-105 text-[12px] leading-relaxed text-muted-foreground">
        {hasFilters
          ? "Cobalah menyetel ulang filter status, format, atau channel untuk melihat seluruh item konten."
          : "Mulai perjalanan konten Anda dengan menambahkan ide baru ke dalam pipeline."}
      </p>
      {hasFilters ? (
        <Button asChild className="mt-4.5 h-8.5 rounded-[5px] bg-primary px-3.5 text-[11px] text-primary-foreground hover:bg-primary-hover" variant="default">
          <Link href="/contents">Reset all filters</Link>
        </Button>
      ) : (
        <Button asChild className="mt-4.5 h-8.5 rounded-[5px] bg-primary px-3.5 text-[11px] text-primary-foreground hover:bg-primary-hover" variant="default">
          <Link href="/contents/new">
            <Plus className="mr-1 size-3.5" aria-hidden="true" />
            Buat konten pertama
          </Link>
        </Button>
      )}

      <div className="mt-5.5 flex items-center justify-center gap-3 border-t border-studio-card-border-subtle pt-4">
        <span className="text-[8px] font-bold tracking-widest text-studio-caption-text">INTERACTIVE PREVIEW</span>
        <Button asChild className="h-8 rounded-[5px] border-input bg-card text-[9px] text-primary" variant="outline">
          <Link href="/contents/demo-42">
            Open sample detail
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}