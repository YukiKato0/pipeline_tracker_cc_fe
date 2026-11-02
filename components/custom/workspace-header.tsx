"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SessionUser } from "@/lib/auth/session";

function CurrentWorkspaceSection() {
  const currentSection = usePathname().startsWith("/channels") ? "Channels" : "Pipeline";
  return <strong>{currentSection}</strong>;
}

type WorkspaceHeaderProps = {
  currentUser: SessionUser | null;
  onLogout: () => void;
};

export function WorkspaceHeader({ currentUser }: WorkspaceHeaderProps) {
  return (
    <header className="flex h-15.5 items-center justify-between border-b border-border bg-sidebar/85 px-10.5 backdrop-blur-xs max-[800px]:px-6.25 max-[640px]:h-14.5 max-[640px]:px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="size-9 flex-[0_0_36px] cursor-pointer rounded-md border border-border bg-card p-0 text-studio-body transition-colors hover:bg-muted hover:text-foreground"
        />
        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground max-[640px]:gap-1.75 max-[640px]:text-[10px]">
          <span>My studio</span>
          <span className="text-border" aria-hidden="true">/</span>
          <Suspense fallback={<strong>Pipeline</strong>}>
            <CurrentWorkspaceSection />
          </Suspense>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        {currentUser && (
          <span suppressHydrationWarning className="text-[11px] font-medium text-studio-body max-[640px]:hidden">
            Hai, {currentUser.name}
          </span>
        )}
      </div>
    </header>
  );
}