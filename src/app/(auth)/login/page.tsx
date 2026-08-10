import type { Metadata } from "next";

import { LoginSignupFlow } from "@/components/auth/login-signup-flow";

export const metadata: Metadata = {
  title: "ログイン / サインアップ | IELTS Creator",
};

export default function LoginPage() {
  return <LoginSignupFlow />;
}
