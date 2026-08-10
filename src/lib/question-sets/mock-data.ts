import type { Difficulty, Section } from "@/lib/api/enums";
import { simulateDelay } from "@/lib/mock/simulate-delay";

import type {
  CreateQuestionSetRequest,
  CreateQuestionSetResponse,
  QuestionSetDetail,
} from "./types";

const TOPIC_PRESETS = [
  "Environment",
  "Technology",
  "Education",
  "Health",
  "Travel",
  "Culture",
  "Science",
  "Work",
];

function pickRandomTopic(): string {
  return TOPIC_PRESETS[Math.floor(Math.random() * TOPIC_PRESETS.length)];
}

// セクションごとに固定IDを返すことで、#00021以降の回答画面がリロードしても
// 同じフィクスチャを参照できるようにする（実バックエンドではUUIDが払い出される）。
const QUESTION_SET_ID_BY_SECTION: Record<Section, string> = {
  READING: "mock-qs-reading",
  LISTENING: "mock-qs-listening",
};

interface GenerationJob {
  section: Section;
  topic: string;
  difficulty: Difficulty;
  startedAt: number;
  durationMs: number;
  outcome: "READY" | "FAILED";
}

const generationJobs = new Map<string, GenerationJob>();

// 生成中インジケーターの状態遷移を実際に再現するため、生成開始からの経過時間で
// GENERATING→READY/FAILEDを判定する。トピックに"fail"を含めると、生成失敗状態を
// 確定的に再現できる（動作確認用のsentinel）。
export function mockCreateQuestionSet(
  request: CreateQuestionSetRequest
): Promise<CreateQuestionSetResponse> {
  const id = QUESTION_SET_ID_BY_SECTION[request.section];
  const topic = request.topic?.trim() || pickRandomTopic();
  const outcome: GenerationJob["outcome"] = topic.toLowerCase().includes("fail")
    ? "FAILED"
    : "READY";

  generationJobs.set(id, {
    section: request.section,
    topic,
    difficulty: request.difficulty,
    startedAt: Date.now(),
    durationMs: request.section === "READING" ? 4000 : 6000,
    outcome,
  });

  return simulateDelay({ id, status: "GENERATING", topic }, 400);
}

function buildReadyFixture(job: GenerationJob, id: string): QuestionSetDetail {
  if (job.section === "READING") {
    return {
      id,
      section: "READING",
      topic: job.topic,
      difficulty: job.difficulty,
      status: "READY",
      passage: {
        title: "The Impact of Urban Green Spaces",
        paragraphs: [
          {
            id: "A",
            text: "Urban green spaces, such as parks and rooftop gardens, have become an essential part of city planning as populations continue to grow.",
          },
        ],
      },
      questionGroups: [
        {
          formatType: "TFNG",
          instructions:
            "Do the following statements agree with the information given in the passage?",
          questions: [
            {
              id: "q1",
              promptText: "Urban parks reduce average city temperatures.",
              displayOrder: 1,
            },
          ],
        },
      ],
    };
  }

  return {
    id,
    section: "LISTENING",
    topic: job.topic,
    difficulty: job.difficulty,
    status: "READY",
    questionGroups: [
      {
        formatType: "MCQ",
        instructions: "音声を聞いて、正しい選択肢を選んでください。",
        questions: [
          {
            id: "q1",
            promptText: "What is the main topic of the talk?",
            displayOrder: 1,
            options: [
              { id: "a", label: "Campus facilities" },
              { id: "b", label: "Library opening hours" },
              { id: "c", label: "Course registration" },
            ],
          },
        ],
      },
    ],
  };
}

export function mockGetQuestionSet(id: string): Promise<QuestionSetDetail> {
  const job = generationJobs.get(id);

  // 生成ジョブが見つからない（直接アクセス・リロード等）場合は、READY済みの
  // フィクスチャにフォールバックする。
  if (!job) {
    const fallbackSection: Section = id === QUESTION_SET_ID_BY_SECTION.LISTENING
      ? "LISTENING"
      : "READING";
    return simulateDelay(
      buildReadyFixture(
        {
          section: fallbackSection,
          topic: pickRandomTopic(),
          difficulty: "BAND_6_7",
          startedAt: Date.now(),
          durationMs: 0,
          outcome: "READY",
        },
        id
      ),
      200
    );
  }

  const elapsed = Date.now() - job.startedAt;
  if (elapsed < job.durationMs) {
    return simulateDelay(
      {
        id,
        section: job.section,
        topic: job.topic,
        difficulty: job.difficulty,
        status: "GENERATING",
        questionGroups: [],
      },
      200
    );
  }

  if (job.outcome === "FAILED") {
    return simulateDelay(
      {
        id,
        section: job.section,
        topic: job.topic,
        difficulty: job.difficulty,
        status: "FAILED",
        questionGroups: [],
      },
      200
    );
  }

  return simulateDelay(buildReadyFixture(job, id), 200);
}
