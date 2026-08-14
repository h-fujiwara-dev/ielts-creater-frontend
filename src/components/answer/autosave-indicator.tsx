import { Check, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type AutosaveState = "idle" | "saving" | "saved";

interface AutosaveIndicatorProps {
  state: AutosaveState;
}

export function AutosaveIndicator({ state }: AutosaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>回答は自動保存されます</span>
      {state === "saving" && (
        <Badge variant="secondary">
          <Loader2 className="size-3 animate-spin" />
          保存中…
        </Badge>
      )}
      {state === "saved" && (
        <Badge variant="success">
          <Check className="size-3" />
          保存済み
        </Badge>
      )}
    </div>
  );
}
