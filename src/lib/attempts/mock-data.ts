import { apiGet, apiPatch, apiPost, buildQueryString } from "@/lib/api/client";

import type {
  AttemptListQuery,
  AttemptListResponse,
  AttemptResult,
  GetSavedAnswersResponse,
  PatchAnswersRequest,
  StartAttemptRequest,
  StartAttemptResponse,
} from "./types";

export function mockStartAttempt(request: StartAttemptRequest): Promise<StartAttemptResponse> {
  return apiPost<StartAttemptResponse>("/api/v1/attempts", request);
}

export function mockGetSavedAnswers(attemptId: string): Promise<GetSavedAnswersResponse> {
  return apiGet<GetSavedAnswersResponse>(`/api/v1/attempts/${attemptId}/answers`);
}

export function mockPatchAnswers(attemptId: string, request: PatchAnswersRequest): Promise<void> {
  return apiPatch<void>(`/api/v1/attempts/${attemptId}/answers`, request);
}

export function mockSubmitAttempt(attemptId: string): Promise<AttemptResult> {
  return apiPost<AttemptResult>(`/api/v1/attempts/${attemptId}/submit`);
}

export function mockGetAttemptResult(attemptId: string): Promise<AttemptResult> {
  return apiGet<AttemptResult>(`/api/v1/attempts/${attemptId}`);
}

export function mockGetAttempts(query: AttemptListQuery = {}): Promise<AttemptListResponse> {
  const qs = buildQueryString({ section: query.section, page: query.page, size: query.size });
  return apiGet<AttemptListResponse>(`/api/v1/attempts${qs}`);
}
