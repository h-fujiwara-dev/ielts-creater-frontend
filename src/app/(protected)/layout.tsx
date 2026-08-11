import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell/app-shell";
import { hasAppUser } from "@/lib/auth/types";

// middleware.tsが未ログイン時に(auth)/loginへリダイレクトするため、通常ここへは
// 認証済みセッションでのみ到達する。念のため未認証時はここでもリダイレクトする。
// hasAppUser()でmiddleware.tsと同じ基準を用いる（#00038）。
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!hasAppUser(session)) {
    redirect("/login");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
