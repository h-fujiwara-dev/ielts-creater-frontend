import { apiGet, apiPost } from "@/lib/api/client";

import type {
  AudioSegmentsResponse,
  CreateQuestionSetRequest,
  CreateQuestionSetResponse,
  Question,
  QuestionGroup,
  QuestionSetDetail,
} from "./types";

// backend QuestionSetDetailResponse系DTOの生形状（answerOptionsの{label,text}表現など、
// フロントエンドのビューモデルとは名称が異なる部分がある）。
interface RawAnswerOption {
  label: string;
  text: string;
}

interface RawQuestion {
  id: string;
  promptText: string;
  displayOrder: number;
  answerOptions: RawAnswerOption[] | null;
}

interface RawQuestionGroup {
  formatType: QuestionGroup["formatType"];
  instructions: string;
  questions: RawQuestion[];
}

interface RawQuestionSetDetailResponse {
  id: string;
  section: QuestionSetDetail["section"];
  topic: string;
  difficulty: QuestionSetDetail["difficulty"];
  status: QuestionSetDetail["status"];
  passage: QuestionSetDetail["passage"] | null;
  listeningContext: string | null;
  questionGroups: RawQuestionGroup[];
}

function toQuestion(raw: RawQuestion): Question {
  return {
    id: raw.id,
    promptText: raw.promptText,
    displayOrder: raw.displayOrder,
    options: raw.answerOptions?.length
      ? raw.answerOptions.map((option) => ({ label: option.label, text: option.text }))
      : undefined,
  };
}

function toQuestionSetDetail(raw: RawQuestionSetDetailResponse): QuestionSetDetail {
  return {
    id: raw.id,
    section: raw.section,
    topic: raw.topic,
    difficulty: raw.difficulty,
    status: raw.status,
    passage: raw.passage ?? undefined,
    listeningContext: raw.listeningContext ?? undefined,
    questionGroups: raw.questionGroups.map((group) => ({
      formatType: group.formatType,
      instructions: group.instructions,
      questions: group.questions.map(toQuestion),
    })),
  };
}

export function mockCreateQuestionSet(
  request: CreateQuestionSetRequest
): Promise<CreateQuestionSetResponse> {
  return apiPost<CreateQuestionSetResponse>("/api/v1/question-sets", request);
}

export async function mockGetQuestionSet(id: string): Promise<QuestionSetDetail> {
  const raw = await apiGet<RawQuestionSetDetailResponse>(`/api/v1/question-sets/${id}`);
  return toQuestionSetDetail(raw);
}

export function mockGetAudioSegments(id: string): Promise<AudioSegmentsResponse> {
  return apiGet<AudioSegmentsResponse>(`/api/v1/question-sets/${id}/audio-segments`);
}
