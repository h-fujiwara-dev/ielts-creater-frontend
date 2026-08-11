import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell/app-shell";

// middleware.tsが未ログイン時に(auth)/loginへリダイレクトするため、通常ここへは
// 認証済みセッションでのみ到達する。念のため未認証時はここでもリダイレクトする。
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
