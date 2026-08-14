import { CircleX } from "lucide-react";

export function AuthAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
    >
      <CircleX className="size-4 shrink-0" />
      {message}
    </div>
  );
}
