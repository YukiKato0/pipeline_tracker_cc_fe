"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import {
  Clapperboard,
  Layers3,
  LogOut,
  Menu,
  Radio,
  X,
} from "lucide-react";
import { clearSession, getSession, subscribeSession, type SessionUser } from "@/lib/auth/session";

function ActiveWorkspaceNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isPipelineActive = pathname.startsWith("/contents");
  const isChannelsActive = pathname.startsWith("/channels");

  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-2">
      <p className="mb-1 ml-2 text-[10px] font-bold tracking-[0.14em] text-studio-label-muted">Workspace</p>
      <Link
        href="/contents"
        aria-current={isPipelineActive ? "page" : undefined}
        className={`group flex min-h-10.5 items-center gap-2.75 rounded-[7px] px-2.75 text-[13px] text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground ${isPipelineActive ? "bg-studio-accent-active font-semibold text-studio-accent-active-text" : ""}`}
        onClick={onNavigate}
      >
        <Layers3 aria-hidden="true" size={18} strokeWidth={1.8} />
        <span>Pipeline</span>
        <span className={`ml-auto h-4.25 w-0.75 rounded-sm bg-studio-accent-bar ${isPipelineActive ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
      </Link>
      <Link
        href="/channels"
        aria-current={isChannelsActive ? "page" : undefined}
        className={`group flex min-h-10.5 items-center gap-2.75 rounded-[7px] px-2.75 text-[13px] text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground ${isChannelsActive ? "bg-studio-accent-active font-semibold text-studio-accent-active-text" : ""}`}
        onClick={onNavigate}
      >
        <Radio aria-hidden="true" size={18} strokeWidth={1.8} />
        <span>Channels</span>
        <span className={`ml-auto h-4.25 w-0.75 rounded-sm bg-studio-accent-bar ${isChannelsActive ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
      </Link>
    </nav>
  );
}

function WorkspaceNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<nav aria-label="Primary navigation" className="flex flex-col gap-2" />}>
      <ActiveWorkspaceNavigation onNavigate={onNavigate} />
    </Suspense>
  );
}

function CurrentWorkspaceSection() {
  const currentSection = usePathname().startsWith("/channels") ? "Channels" : "Pipeline";
  return <strong>{currentSection}</strong>;
}

function WorkspaceBrand() {
  return (
    <Link className="flex w-fit items-center gap-2.75 text-foreground no-underline" href="/contents" aria-label="Frame workspace home">
      <span className="inline-flex size-9.5 items-center justify-center rounded-lg bg-brand-badge-bg text-brand-gold">
        <Clapperboard aria-hidden="true" size={19} strokeWidth={1.8} />
      </span>
      <span className="flex flex-col gap-0.75">
        <strong className="text-[14px] font-extrabold tracking-[0.12em] leading-none">FRAME</strong>
        <span className="text-[9px] font-semibold tracking-[0.13em] text-studio-pill-text">CREATOR STUDIO</span>
      </span>
    </Link>
  );
}

function useCurrentUser(): SessionUser | null {
  return useSyncExternalStore(
    subscribeSession,
    getSession,
    () => null
  );
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const currentUser = useCurrentUser();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="flex min-h-screen">
      <aside className="flex min-h-screen flex-[0_0_248px] flex-col border-r border-border bg-sidebar px-4.5 py-7 max-[800px]:flex-[0_0_218px] max-[800px]:px-3.5 max-[640px]:hidden">
        <WorkspaceBrand />
        <div className="my-9.5 mb-8.5 flex min-h-14.5 w-full items-center gap-2.5 rounded-lg border border-border bg-card p-2.25 text-left text-foreground shadow-xs">
          <span suppressHydrationWarning className="inline-flex size-8.5 flex-[0_0_34px] items-center justify-center rounded-md bg-brand-gold-subtle font-serif text-[17px] text-brand-gold-dark" aria-hidden="true">
            {userInitial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <strong suppressHydrationWarning className="truncate text-[12px] font-semibold">{currentUser?.name || "Creator Studio"}</strong>
            <span suppressHydrationWarning className="truncate text-[10px] text-muted-foreground">{currentUser?.email || "Personal workspace"}</span>
          </div>
        </div>
        <WorkspaceNavigation />
        <div className="mt-auto flex items-center justify-between border-t border-border px-1 pb-0.5 pt-4.5 text-[10px] text-studio-subtle-text">
          <span className="flex items-center gap-2">
            <span className="inline-block size-2.5 flex-[0_0_10px] rounded-full border-[3px] border-feedback-success-border bg-feedback-success-pill-dot" aria-hidden="true" />
            Active Session
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[10px] text-destructive hover:underline"
            type="button"
          >
            <LogOut size={12} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-15.5 items-center justify-between border-b border-border bg-sidebar/85 backdrop-blur-xs px-10.5 max-[800px]:px-6.25 max-[640px]:h-14.5 max-[640px]:justify-between max-[640px]:px-4">
          <div className="flex items-center gap-3">
            <button
              aria-label={isMobileNavigationOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileNavigationOpen}
              aria-controls="mobile-navigation"
              className="hidden size-9 flex-[0_0_36px] items-center justify-center rounded-md border border-border bg-transparent p-0 text-studio-body max-[640px]:inline-flex"
              onClick={() => setIsMobileNavigationOpen((isOpen) => !isOpen)}
              type="button"
            >
              {isMobileNavigationOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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
                {currentUser.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-[5px] border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-studio-tag-text transition-colors hover:border-feedback-destructive-hover-border hover:bg-feedback-destructive-hover-bg hover:text-feedback-destructive-hover-text"
              type="button"
            >
              <LogOut size={13} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {isMobileNavigationOpen && (
          <div className="fixed inset-x-0 bottom-0 top-14.5 z-20 min-[641px]:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 w-full border-0 bg-brand-header/30 backdrop-blur-xs"
              onClick={() => setIsMobileNavigationOpen(false)}
              type="button"
            />
            <aside className="absolute bottom-0 left-0 top-0 w-[min(290px,calc(100vw-48px))] border-r border-border bg-sidebar px-4.5 py-5.5" id="mobile-navigation">
              <WorkspaceBrand />
              <div className="mt-8.75">
                <WorkspaceNavigation onNavigate={() => setIsMobileNavigationOpen(false)} />
              </div>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 bg-studio-canvas px-10.5 pb-6.5 pt-12.5 max-[800px]:px-6.25 max-[800px]:py-9.75 max-[640px]:px-4 max-[640px]:py-8.5">
          {children}
        </main>
      </div>
    </div>
  );
}

export default WorkspaceShell;
