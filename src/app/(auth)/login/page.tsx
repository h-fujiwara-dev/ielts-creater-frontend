import type { Metadata } from "next";

import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthShell } from "@/components/auth/auth-shell";
import { CognitoSignInButton } from "@/components/auth/cognito-sign-in-button";
import { sanitizeCallbackUrl } from "@/lib/auth/callback-url";

export const metadata: Metadata = {
  title: "ログイン / サインアップ | IELTS Creator",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; step?: string }>;
}) {
  const { error, callbackUrl, step } = await searchParams;
  // TOP画面の「無料ではじめる」ボタンは/login?step=signupへ遷移する（#00062）。
  // Cognito Hosted UIのサインアップ画面へ直接誘導するprovider "cognito-signup"を使う。
  const isSignup = step === "signup";

  return (
    <AuthShell>
      <h2 className="text-xl font-bold text-brand-navy">
        {isSignup ? "アカウントを作成" : "おかえりなさい"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {isSignup
          ? "Cognitoで新規登録してください"
          : "Cognitoでログイン、またはアカウントを新規登録してください"}
      </p>

      {error && (
        <div className="mt-5">
          <AuthAlert message="ログインに失敗しました。もう一度お試しください。" />
        </div>
      )}

      <div className="mt-6">
        <CognitoSignInButton
          callbackUrl={sanitizeCallbackUrl(callbackUrl)}
          mode={isSignup ? "signup" : "signin"}
        />
      </div>
    </AuthShell>
  );
}
