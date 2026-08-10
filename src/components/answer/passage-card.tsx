import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Passage } from "@/lib/question-sets/types";

interface PassageCardProps {
  passage: Passage;
}

export function PassageCard({ passage }: PassageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{passage.title}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[32rem] overflow-y-auto">
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-brand-navy/90">
          {passage.paragraphs.map((paragraph) => (
            <p key={paragraph.id}>{paragraph.text}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
