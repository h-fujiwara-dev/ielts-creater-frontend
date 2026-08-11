import type { Metadata } from "next";

import { LoginSignupFlow } from "@/components/auth/login-signup-flow";

export const metadata: Metadata = {
  title: "ログイン / サインアップ | IELTS Creator",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const initialStep = step === "signup" ? "signup" : "login";

  return <LoginSignupFlow initialStep={initialStep} />;
}
