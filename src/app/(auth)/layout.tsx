import type { ReactNode } from "react";

import { AuthHeader } from "@/components/sections/auth-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream">
      <AuthHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
