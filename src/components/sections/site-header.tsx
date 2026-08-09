import { BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy/5 bg-brand-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex cursor-pointer items-center gap-2 text-lg font-bold text-brand-navy">
          <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
          IELTS Creator
        </div>
        <Button
          type="button"
          size="lg"
          className="cursor-pointer rounded-full bg-brand-orange px-5 text-brand-navy shadow-sm transition-all duration-200 hover:bg-brand-orange/90 hover:shadow-md"
        >
          ログイン
        </Button>
      </div>
    </header>
  );
}
