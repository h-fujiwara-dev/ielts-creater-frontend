import type { Difficulty, Section } from "@/lib/api/enums";
import { simulateDelay } from "@/lib/mock/simulate-delay";

import type {
  AudioSegmentsResponse,
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

// Matching Headingsの見出し選択肢（ダミー選択肢を含む、画面設計書S-04の実装メモ参照）。
// Paragraph 2→h2, Paragraph 3→h4が正解（src/lib/attempts/mock-data.tsの採点キーと対応）。
const HEADING_OPTIONS = [
  { id: "h1", label: "The economic case for green spaces" },
  { id: "h2", label: "How urban parks influence local temperatures" },
  { id: "h3", label: "Comparing rural and urban wildlife" },
  { id: "h4", label: "Funding challenges facing green space projects" },
  { id: "h5", label: "Alternative approaches in space-constrained cities" },
];

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
            text: "Urban green spaces, such as parks and rooftop gardens, have become an essential part of city planning as populations continue to grow. Advocates argue that access to nature within cities improves both physical and mental wellbeing.",
          },
          {
            id: "B",
            text: "Research shows that tree cover and vegetation can lower surrounding air temperatures by several degrees during summer months, a phenomenon known as the urban heat island effect. Some cities use vertical gardens and rooftop parks as space-efficient alternatives to large parks, allowing greenery to be introduced even in dense districts.",
          },
          {
            id: "C",
            text: "However, funding for green space projects has not increased steadily. In several major cities, budgets for parks and public gardens were cut during economic downturns and only partially restored afterward, leaving maintenance backlogs.",
          },
          {
            id: "D",
            text: "Rising land prices have put economic pressure on urban green spaces, as developers compete for the same land that could otherwise be used for parks. Balancing commercial development with public green space remains a central challenge for city planners.",
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
            {
              id: "q2",
              promptText: "All city residents live within walking distance of a park.",
              displayOrder: 2,
            },
            {
              id: "q3",
              promptText:
                "Government funding for green spaces has increased every year since 2010.",
              displayOrder: 3,
            },
          ],
        },
        {
          formatType: "FILL_BLANK",
          instructions:
            "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          questions: [
            {
              id: "q4",
              promptText:
                "Some cities use ______ and rooftop parks as space-efficient alternatives to large parks.",
              displayOrder: 4,
            },
            {
              id: "q5",
              promptText:
                "Rising land prices have put ______ pressure on urban green spaces.",
              displayOrder: 5,
            },
          ],
        },
        {
          formatType: "MATCHING_HEADINGS",
          instructions:
            "Choose the correct heading for each paragraph from the list of headings below.",
          questions: [
            {
              id: "q6",
              promptText: "Paragraph 2",
              displayOrder: 6,
              options: HEADING_OPTIONS,
            },
            {
              id: "q7",
              promptText: "Paragraph 3",
              displayOrder: 7,
              options: HEADING_OPTIONS,
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
            id: "ql1",
            promptText: "What is the main topic of the talk?",
            displayOrder: 1,
            options: [
              { id: "a", label: "Campus facilities" },
              { id: "b", label: "Library opening hours" },
              { id: "c", label: "Course registration" },
            ],
          },
          {
            id: "ql2",
            promptText: "What time does the library open on weekdays?",
            displayOrder: 2,
            options: [
              { id: "a", label: "8:00 AM" },
              { id: "b", label: "9:00 AM" },
              { id: "c", label: "10:00 AM" },
            ],
          },
        ],
      },
    ],
  };
}

// GET /api/v1/question-sets/{id}/audio-segments のモック。実バックエンドは署名付きS3 URL
// を返すが、モックでは型のみ満たし実音声ファイルには接続しない（#00021実装メモ参照）。
export function mockGetAudioSegments(id: string): Promise<AudioSegmentsResponse> {
  return simulateDelay(
    {
      segments: [
        { turnIndex: 0, url: `mock://${id}/turn-0.mp3`, durationMs: 112000 },
        { turnIndex: 1, url: `mock://${id}/turn-1.mp3`, durationMs: 108000 },
      ],
    },
    200
  );
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
