import type { ReactNode } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function AuthenticationLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
