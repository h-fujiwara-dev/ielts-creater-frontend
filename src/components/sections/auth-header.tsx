import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="border-b border-brand-navy/5 bg-brand-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-brand-navy"
        >
          <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
          IELTS Creator
        </Link>
      </div>
    </header>
  );
}
