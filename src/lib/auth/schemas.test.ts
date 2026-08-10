import { describe, expect, it } from "vitest";

import {
  confirmCodeFormSchema,
  confirmationCodeSchema,
  emailSchema,
  loginFormSchema,
  loginPasswordSchema,
  signupFormSchema,
  signupPasswordSchema,
} from "@/lib/auth/schemas";

describe("emailSchema", () => {
  it("accepts a valid email", () => {
    expect(emailSchema.safeParse("dev@example.com").success).toBe(true);
  });

  it("rejects an empty string", () => {
    const result = emailSchema.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("メールアドレスを入力してください");
    }
  });

  it("rejects a malformed email", () => {
    const result = emailSchema.safeParse("not-an-email");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("メールアドレスの形式で入力してください");
    }
  });
});

describe("loginPasswordSchema", () => {
  it("only requires a non-empty value", () => {
    expect(loginPasswordSchema.safeParse("x").success).toBe(true);
    expect(loginPasswordSchema.safeParse("").success).toBe(false);
  });
});

describe("signupPasswordSchema", () => {
  it.each([
    ["DevPass123", true],
    ["short1A", false], // 8文字未満
    ["alllowercase1", false], // 大文字なし
    ["ALLUPPERCASE1", false], // 小文字なし
    ["NoDigitsHere", false], // 数字なし
  ])("%s -> valid=%s", (value, expected) => {
    expect(signupPasswordSchema.safeParse(value).success).toBe(expected);
  });
});

describe("confirmationCodeSchema", () => {
  it("accepts exactly 6 digits", () => {
    expect(confirmationCodeSchema.safeParse("482913").success).toBe(true);
  });

  it.each(["12345", "1234567", "12345a"])("rejects %s", (value) => {
    expect(confirmationCodeSchema.safeParse(value).success).toBe(false);
  });
});

describe("loginFormSchema", () => {
  it("validates the combined shape", () => {
    const result = loginFormSchema.safeParse({
      email: "dev@example.com",
      password: "DevPass123",
    });
    expect(result.success).toBe(true);
  });
});

describe("signupFormSchema", () => {
  it("rejects a weak password even with a valid email", () => {
    const result = signupFormSchema.safeParse({
      email: "dev@example.com",
      password: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("confirmCodeFormSchema", () => {
  it("validates a 6-digit code", () => {
    expect(confirmCodeFormSchema.safeParse({ code: "482913" }).success).toBe(true);
  });
});
