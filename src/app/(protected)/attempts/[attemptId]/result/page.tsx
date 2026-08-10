import type { Metadata } from "next";

import { ResultScreen } from "@/components/result/result-screen";

export const metadata: Metadata = {
  title: "結果 | IELTS Creator",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return <ResultScreen attemptId={attemptId} />;
}
