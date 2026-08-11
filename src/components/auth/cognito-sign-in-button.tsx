"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

// Cognito Hosted UIへリダイレクトする（Authorization Code + PKCE、#00034）。
// ログイン・新規登録・確認コード入力はいずれもHosted UI側の画面で行う。
export function CognitoSignInButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        void signIn("cognito", { callbackUrl: "/dashboard" });
      }}
      className="h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
    >
      {isPending ? "リダイレクト中…" : "Cognitoでログイン／新規登録"}
    </Button>
  );
}
