import type { Metadata } from "next";
import { ContentForm } from "@/features/contents/components/content-form";

export const metadata: Metadata = {
  title: "New content | Frame Creator Studio",
};

export default function NewContentPage() {
  return (
    <div className="mx-auto max-w-230">
      <div className="mb-6.75">
        <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT OPERATIONS</p>
        <h1 className="m-0 font-serif text-[38px] font-normal leading-[1.1] text-studio-heading max-[640px]:text-[34px]">New content</h1>
        <p className="mt-2.75 max-w-67.5 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">Start with the essentials. The details can find their shape as you work.</p>
      </div>
      <ContentForm mode="create" />
    </div>
  );
}
