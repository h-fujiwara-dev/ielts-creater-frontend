// NextAuth.js Cognitoプロバイダ連携を想定した型定義。
// 実際の認証方式（Cognito Hosted UIへのOAuthリダイレクト or カスタムAPIによる
// USER_PASSWORD_AUTH等の直接認証）は、Cognito実接続を行う別チケットで決定する。
// このチケットではどちらの方式にも転用できる形に留める。

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export type SignInError = "CredentialsSignin" | "UserNotConfirmed" | "UnknownError";

export type SignInResult = { ok: true } | { ok: false; error: SignInError };

export interface SignUpInput {
  email: string;
  password: string;
}

export type SignUpError = "UsernameExists" | "InvalidPassword" | "UnknownError";

export type SignUpResult = { ok: true } | { ok: false; error: SignUpError };

export interface ConfirmSignUpInput {
  email: string;
  code: string;
}

export type ConfirmSignUpError = "CodeMismatch" | "ExpiredCode" | "UnknownError";

export type ConfirmSignUpResult = { ok: true } | { ok: false; error: ConfirmSignUpError };

// GET /api/v1/me のレスポンス形状に対応
// (backendリポジトリ docs/API設計書/GET_me.md)
export interface AppSessionUser {
  id: string;
  email: string;
  displayName: string;
}
