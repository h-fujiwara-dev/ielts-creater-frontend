import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "メールアドレスを入力してください")
  .email("メールアドレスの形式で入力してください");

// 画面設計書の入力項目表に準拠: ログイン時のパスワードは必須のみ
export const loginPasswordSchema = z.string().min(1, "パスワードを入力してください");

// HTML叩き台のフォームヒント「8文字以上、英大文字・小文字・数字を含めてください」に準拠
export const signupPasswordSchema = z
  .string()
  .min(8, "8文字以上で入力してください")
  .regex(/[A-Z]/, "英大文字を含めてください")
  .regex(/[a-z]/, "英小文字を含めてください")
  .regex(/[0-9]/, "数字を含めてください");

export const confirmationCodeSchema = z
  .string()
  .length(6, "6桁で入力してください")
  .regex(/^\d{6}$/, "半角数字で入力してください");

export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const signupFormSchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
});

export const confirmCodeFormSchema = z.object({
  code: confirmationCodeSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type ConfirmCodeFormValues = z.infer<typeof confirmCodeFormSchema>;
