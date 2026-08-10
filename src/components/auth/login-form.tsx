"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifyDevCredentials } from "@/lib/auth/dev-user";
import { loginFormSchema, type LoginFormValues } from "@/lib/auth/schemas";

import { AuthAlert } from "./auth-alert";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = handleSubmit((values) => {
    if (!verifyDevCredentials(values.email, values.password)) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    router.push("/dashboard");
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">おかえりなさい</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        アカウント情報を入力してログインしてください
      </p>

      {authError && (
        <div className="mt-5">
          <AuthAlert message="メールアドレスまたはパスワードが正しくありません" />
        </div>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Field data-invalid={!!errors.email || authError}>
          <FieldLabel htmlFor="login-email">メールアドレス</FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email || authError}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password || authError}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="login-password">パスワード</FieldLabel>
            <a href="#" className="text-xs font-semibold text-brand-navy">
              パスワードをお忘れですか？
            </a>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            aria-invalid={!!errors.password || authError}
            {...register("password")}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
        >
          ログイン
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        または
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-brand-navy underline-offset-2 hover:underline"
        >
          こちらからサインアップ
        </button>
      </p>
    </div>
  );
}
