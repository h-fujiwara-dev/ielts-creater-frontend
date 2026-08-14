import type { ReactNode } from "react";

import { AuthBrandPanel } from "./auth-brand-panel";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid w-full overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 min-[780px]:grid-cols-[0.85fr_1fr]">
      <AuthBrandPanel />
      <div className="flex flex-col justify-center p-10">{children}</div>
    </div>
  );
}
