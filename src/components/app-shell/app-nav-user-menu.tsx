"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import type { AppSessionUser } from "@/lib/auth/types";

function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface AppNavUserMenuProps {
  user: AppSessionUser;
}

export function AppNavUserMenu({ user }: AppNavUserMenuProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition-colors duration-200 hover:border-border hover:bg-muted">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
        {getInitials(user.displayName)}
      </span>
      <span className="hidden text-sm font-semibold text-brand-navy sm:inline">
        {user.displayName}
      </span>
      <button
        type="button"
        aria-label="ログアウト"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-brand-navy/60 transition-colors duration-200 hover:bg-white hover:text-brand-navy"
      >
        <LogOut className="size-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
