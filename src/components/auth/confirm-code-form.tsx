"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyDevConfirmationCode } from "@/lib/auth/dev-user";
import { confirmCodeFormSchema, type ConfirmCodeFormValues } from "@/lib/auth/schemas";

import { AuthAlert } from "./auth-alert";

interface ConfirmCodeFormProps {
  email: string;
  onConfirmSuccess: () => void;
}

export function ConfirmCodeForm({ email, onConfirmSuccess }: ConfirmCodeFormProps) {
  const [authError, setAuthError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmCodeFormValues>({
    resolver: zodResolver(confirmCodeFormSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = handleSubmit((values) => {
    if (!verifyDevConfirmationCode(values.code)) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    onConfirmSuccess();
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">確認コードを入力</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="font-semibold text-brand-navy">{email}</span> 宛に確認コードを送信しました
      </p>

      {authError && (
        <div className="mt-5">
          <AuthAlert message="確認コードが正しくないか、有効期限が切れています" />
        </div>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Field data-invalid={!!errors.code || authError}>
          <FieldLabel htmlFor="confirm-code">確認コード</FieldLabel>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <InputOTP
                id="confirm-code"
                maxLength={6}
                inputMode="numeric"
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                aria-invalid={!!errors.code || authError}
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-10 rounded-lg border text-xl font-bold first:rounded-lg first:border-l last:rounded-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          <FieldError errors={errors.code ? [errors.code] : undefined} />
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
        >
          確認する
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        コードが届かない場合は <button type="button" className="font-semibold text-brand-navy underline-offset-2 hover:underline">再送信</button>
      </p>
    </div>
  );
}
