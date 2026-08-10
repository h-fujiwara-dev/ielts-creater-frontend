"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupFormSchema, type SignupFormValues } from "@/lib/auth/schemas";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

export function SignupForm({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit = handleSubmit((values) => {
    // Phase 1: Cognito未接続のため、バリデーション通過時点でサインアップ成功として扱う
    onSignupSuccess(values.email);
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">アカウントを作成</h2>
      <p className="mt-1 text-sm text-muted-foreground">メールアドレスとパスワードで登録します</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="signup-email">メールアドレス</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="signup-password">パスワード</FieldLabel>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password ? (
            <FieldError errors={[errors.password]} />
          ) : (
            <p className="text-sm text-muted-foreground">
              8文字以上、英大文字・小文字・数字を含めてください
            </p>
          )}
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
        >
          サインアップ
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        または
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        すでにアカウントをお持ちの方は{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-brand-navy underline-offset-2 hover:underline"
        >
          こちらからログイン
        </button>
      </p>
    </div>
  );
}
