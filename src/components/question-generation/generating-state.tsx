"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConditionBadges } from "@/components/shared/condition-badges";
import { SECTION_LABELS, type Difficulty, type Section } from "@/lib/api/enums";

interface GeneratingStateProps {
  section: Section;
  topic: string;
  difficulty: Difficulty;
  estimatedSeconds: number;
}

export function GeneratingState({
  section,
  topic,
  difficulty,
  estimatedSeconds,
}: GeneratingStateProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => Math.min(prev + 0.5, estimatedSeconds));
    }, 500);
    return () => clearInterval(interval);
  }, [estimatedSeconds]);

  const progress = Math.min(Math.round((elapsedSeconds / estimatedSeconds) * 100), 95);
  const remainingSeconds = Math.max(Math.ceil(estimatedSeconds - elapsedSeconds), 1);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="size-8 animate-spin rounded-full border-[3px] border-brand-navy/20 border-t-brand-navy" />
        <div>
          <p className="font-semibold text-brand-navy">
            {SECTION_LABELS[section]}問題を生成しています…
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            残り約{remainingSeconds}秒
          </p>
        </div>
        <Progress value={progress} className="w-full max-w-sm" />
        <ConditionBadges section={section} topic={topic} difficulty={difficulty} />
      </CardContent>
    </Card>
  );
}
