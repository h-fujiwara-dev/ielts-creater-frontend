import type { Metadata } from "next";

import { AnswerScreen } from "@/components/answer/answer-screen";

export const metadata: Metadata = {
  title: "回答 | IELTS Creator",
};

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;
  return <AnswerScreen questionSetId={setId} />;
}
