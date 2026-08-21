"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface GuestSignInButtonProps {
  callbackUrl?: string;
  className?: string;
}

// ゲスト機能（#00056）。共有デモアカウントで自動ログインし、Hosted UIでの入力は発生させない。
// 実装パターンはCognitoSignInButtonに合わせる（isPending管理・signIn失敗時のリセット、#00039）。
export function GuestSignInButton({
  callbackUrl = "/dashboard",
  className,
}: GuestSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        signIn("guest", { callbackUrl }).catch(() => {
          setIsPending(false);
        });
      }}
      className={className}
    >
      {isPending ? "準備中…" : "ゲストとして始める"}
    </Button>
  );
}
