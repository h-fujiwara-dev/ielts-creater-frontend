import type { AttemptResult, SavedAnswer } from "./types";

// 回答下書き・採点結果をsessionStorageに保持する薄いラッパー。バックエンドが存在しない
// モック実装でも、ページ再読み込み後の回答復元（F-07）と結果画面への受け渡しを両立するため
// 単純なインメモリ変数ではなくsessionStorageを使う。

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function draftKey(attemptId: string): string {
  return `ielts-creater:attempt-draft:${attemptId}`;
}

function resultKey(attemptId: string): string {
  return `ielts-creater:attempt-result:${attemptId}`;
}

export function readDraftAnswers(attemptId: string): SavedAnswer[] {
  if (!isBrowser()) return [];
  const raw = window.sessionStorage.getItem(draftKey(attemptId));
  return raw ? (JSON.parse(raw) as SavedAnswer[]) : [];
}

export function writeDraftAnswers(attemptId: string, answers: SavedAnswer[]): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(draftKey(attemptId), JSON.stringify(answers));
}

export function readAttemptResult(attemptId: string): AttemptResult | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(resultKey(attemptId));
  return raw ? (JSON.parse(raw) as AttemptResult) : null;
}

export function writeAttemptResult(attemptId: string, result: AttemptResult): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(resultKey(attemptId), JSON.stringify(result));
}
