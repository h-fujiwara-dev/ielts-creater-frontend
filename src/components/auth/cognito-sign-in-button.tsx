"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CognitoSignInButtonProps {
  // 未指定時は/dashboardへ遷移する。ログイン後に元のページへ戻すためのcallbackUrlは
  // 呼び出し元（(auth)/login/page.tsx）でsanitizeCallbackUrl()を通した値を渡す（#00040）。
  callbackUrl?: string;
  // "signup"時はCognito Hosted UIのサインアップ画面へ直接遷移するprovider
  // "cognito-signup"を呼ぶ（#00062）。未指定時は従来通り"signin"（provider "cognito"）。
  mode?: "signin" | "signup";
}

const PROVIDER_ID: Record<"signin" | "signup", string> = {
  signin: "cognito",
  signup: "cognito-signup",
};

const LABEL: Record<"signin" | "signup", string> = {
  signin: "Cognitoでログイン／新規登録",
  signup: "Cognitoで新規登録",
};

// Cognito Hosted UIへリダイレクトする（Authorization Code + PKCE、#00034）。
// ログイン・新規登録・確認コード入力はいずれもHosted UI側の画面で行う。
export function CognitoSignInButton({
  callbackUrl = "/dashboard",
  mode = "signin",
}: CognitoSignInButtonProps) {
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
        signIn(PROVIDER_ID[mode], { callbackUrl }).catch(() => {
          setIsPending(false);
        });
      }}
      className="h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
    >
      {isPending ? "リダイレクト中…" : LABEL[mode]}
    </Button>
  );
}
