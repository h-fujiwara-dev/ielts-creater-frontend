import type { Metadata } from "next";
import { Suspense } from "react";

import { QuestionGenerationScreen } from "@/components/question-generation/question-generation-screen";

export const metadata: Metadata = {
  title: "問題生成 | IELTS Creator",
};

export default function QuestionGenerationPage() {
  return (
    <Suspense>
      <QuestionGenerationScreen />
    </Suspense>
  );
}
