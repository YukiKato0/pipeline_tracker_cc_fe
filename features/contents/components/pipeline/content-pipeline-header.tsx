"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { getSession, subscribeSession, type SessionUser } from "@/lib/auth/session";

function useCurrentUser(): SessionUser | null {
  return useSyncExternalStore(
    subscribeSession,
    getSession,
    () => null
  );
}

export function ContentPipelineHeader() {
  const currentUser = useCurrentUser();

  return (
    <div className="mb-7 flex items-center justify-between max-[640px]:items-start max-[640px]:gap-3.5">
      <div>
        <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-brand-section-label">CONTENT OPERATIONS</p>
        <h1 className="m-0 font-serif text-[clamp(34px,4vw,46px)] font-normal leading-[1.08] text-studio-heading max-[640px]:text-4xl">Content pipeline</h1>
        <p className="mt-2.75 max-w-67.5 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
          Every story, from the first spark to the final publish.
        </p>
      </div>
      {currentUser?.role !== "editor" && (
        <Button asChild className="mt-1 min-h-9.75 rounded-[5px] bg-primary px-3.25 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover max-[640px]:mt-5.75 max-[640px]:shrink-0">
          <Link href="/contents/new">
            <Plus aria-hidden="true" data-icon="inline-start" />
            New content
          </Link>
        </Button>
      )}
    </div>
  );
}