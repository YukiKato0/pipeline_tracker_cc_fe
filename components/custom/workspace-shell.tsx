"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { LogOut } from "lucide-react";
import { clearSession, getSession, subscribeSession, type SessionUser } from "@/lib/auth/session";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { WorkspaceHeader } from "@/components/custom/workspace-header";
import { WorkspaceSidebar } from "@/components/custom/workspace-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function useCurrentUser(): SessionUser | null {
  return useSyncExternalStore(
    subscribeSession,
    getSession,
    () => null
  );
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const currentUser = useCurrentUser();

  function handleLogout() {
    setIsLogoutDialogOpen(false);
    clearSession();
    router.push("/login");
  }

  return (
    <SidebarProvider>
      <WorkspaceSidebar
        currentUser={currentUser}
        onLogout={() => setIsLogoutDialogOpen(true)}
      />
      <SidebarInset className="min-w-0 flex-1 bg-studio-canvas">
        <WorkspaceHeader
          currentUser={currentUser}
          onLogout={() => setIsLogoutDialogOpen(true)}
        />
        <main className="min-w-0 flex-1 bg-studio-canvas px-10.5 pb-6.5 pt-12.5 max-[800px]:px-6.25 max-[800px]:py-9.75 max-[640px]:px-4 max-[640px]:py-8.5">
          {children}
        </main>
      </SidebarInset>
      <ConfirmDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari sesi Creator Studio?"
        icon={<LogOut className="size-5 text-destructive" />}
        variant="destructive"
        confirmText="Ya, Logout"
        cancelText="Batal"
        onConfirm={handleLogout}
      />
    </SidebarProvider>
  );
}

export default WorkspaceShell;
