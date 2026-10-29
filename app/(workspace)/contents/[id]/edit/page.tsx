import type { Metadata } from "next";

import { Suspense } from "react";
import { ContentForm } from "@/features/contents/components/content-form";

export const metadata: Metadata = {
  title: "Edit content | Frame Creator Studio",
};

async function EditContentContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-230">
      <div className="mb-6.75">
        <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT OPERATIONS</p>
        <h1 className="m-0 font-serif text-[38px] font-normal leading-[1.1] text-studio-heading max-[640px]:text-[34px]">Edit content</h1>
        <p className="mt-2.75 max-w-67.5 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">Record {id}</p>
      </div>
      <ContentForm contentId={id} mode="edit" />
    </div>
  );
}

export default function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-9 text-xs text-muted-foreground" role="status">Loading content record</div>}>
      <EditContentContent params={params} />
    </Suspense>
  );
}
