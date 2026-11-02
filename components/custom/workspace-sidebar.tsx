"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Layers3, LogOut, Radio } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { SessionUser } from "@/lib/auth/session";
import { Button } from "../ui/button";

type WorkspaceSidebarProps = {
  currentUser: SessionUser | null;
  onLogout: () => void;
};

function WorkspaceBrand() {
  return (
    <Link className="flex w-fit items-center gap-2.75 text-foreground no-underline" href="/contents" aria-label="Frame workspace home">
      <span className="inline-flex size-9.5 items-center justify-center rounded-lg bg-brand-badge-bg text-brand-gold">
        <Clapperboard aria-hidden="true" size={19} strokeWidth={1.8} />
      </span>
      <span className="flex flex-col gap-0.75">
        <strong className="text-[14px] font-extrabold leading-none tracking-[0.12em]">FRAME</strong>
        <span className="text-[9px] font-semibold tracking-[0.13em] text-studio-pill-text">CREATOR STUDIO</span>
      </span>
    </Link>
  );
}

export function WorkspaceSidebar({ currentUser, onLogout }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "C";

  function closeMobileNavigation() {
    if (isMobile) setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="my-9.5 mb-0 gap-0 px-4.5 py-0 max-[800px]:px-3.5">
        <WorkspaceBrand />
        <div className="mt-9.5 mb-8.5 flex min-h-14.5 w-full items-center gap-2.5 rounded-lg border border-border bg-card p-2.25 text-left text-foreground shadow-xs">
          <span suppressHydrationWarning className="inline-flex size-8.5 flex-[0_0_34px] items-center justify-center rounded-md bg-brand-gold-subtle font-serif text-[17px] text-brand-gold-dark" aria-hidden="true">
            {userInitial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <strong suppressHydrationWarning className="truncate text-[12px] font-semibold">{currentUser?.name || "Creator Studio"}</strong>
            <span suppressHydrationWarning className="truncate text-[10px] text-muted-foreground">{currentUser?.email || "Personal workspace"}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2.5">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-1 ml-2 h-auto p-0 text-[10px] font-bold tracking-[0.14em] text-studio-label-muted group-data-[collapsible=icon]:hidden">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/contents")}
                className="min-h-10.5 rounded-[7px] px-2.75 text-[13px] data-[active=true]:bg-studio-accent-active data-[active=true]:font-semibold data-[active=true]:text-studio-accent-active-text"
              >
                <Link href="/contents" aria-current={pathname.startsWith("/contents") ? "page" : undefined} onClick={closeMobileNavigation}>
                  <Layers3 aria-hidden="true" size={18} strokeWidth={1.8} />
                  <span>Pipeline</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {currentUser?.role !== "editor" && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/channels")}
                  className="min-h-10.5 rounded-[7px] px-2.75 text-[13px] data-[active=true]:bg-studio-accent-active data-[active=true]:font-semibold data-[active=true]:text-studio-accent-active-text"
                >
                  <Link href="/channels" aria-current={pathname.startsWith("/channels") ? "page" : undefined} onClick={closeMobileNavigation}>
                    <Radio aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>Channels</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto flex-row items-center justify-end border-t border-border px-2 py-4.5 text-[10px] text-studio-subtle-text">
        <Button
          onClick={onLogout}
          className="items-center gap-1 text-[10px]"
          type="button"
          variant="destructive"
        >
          <LogOut size={12} aria-hidden="true" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}