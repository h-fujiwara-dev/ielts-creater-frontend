"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CognitoSignInButtonProps {
  // 未指定時は/dashboardへ遷移する。ログイン後に元のページへ戻すためのcallbackUrlは
  // 呼び出し元（(auth)/login/page.tsx）でsanitizeCallbackUrl()を通した値を渡す（#00040）。
  callbackUrl?: string;
}

// Cognito Hosted UIへリダイレクトする（Authorization Code + PKCE、#00034）。
// ログイン・新規登録・確認コード入力はいずれもHosted UI側の画面で行う。
export function CognitoSignInButton({ callbackUrl = "/dashboard" }: CognitoSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        // signIn()はリダイレクト前にCSRF/プロバイダ情報取得のfetchを行うため、オフライン等で
        // そこが失敗するとリダイレクトされないままisPendingが固着してしまう。catchでリセットする
        // （#00039）。
        signIn("cognito", { callbackUrl }).catch(() => {
          setIsPending(false);
        });
      }}
      className="h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
    >
      {isPending ? "リダイレクト中…" : "Cognitoでログイン／新規登録"}
    </Button>
  );
}
