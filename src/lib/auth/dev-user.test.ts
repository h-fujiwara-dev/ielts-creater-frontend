import { describe, expect, it } from "vitest";

import {
  DEV_CONFIRMATION_CODE,
  DEV_USER_EMAIL,
  DEV_USER_PASSWORD,
  verifyDevConfirmationCode,
  verifyDevCredentials,
} from "@/lib/auth/dev-user";

describe("verifyDevCredentials", () => {
  it("returns true for the fixed dev user", () => {
    expect(verifyDevCredentials(DEV_USER_EMAIL, DEV_USER_PASSWORD)).toBe(true);
  });

  it("returns false for a wrong password", () => {
    expect(verifyDevCredentials(DEV_USER_EMAIL, "wrong")).toBe(false);
  });

  it("returns false for a wrong email", () => {
    expect(verifyDevCredentials("someone@example.com", DEV_USER_PASSWORD)).toBe(false);
  });
});

describe("verifyDevConfirmationCode", () => {
  it("returns true for the fixed confirmation code", () => {
    expect(verifyDevConfirmationCode(DEV_CONFIRMATION_CODE)).toBe(true);
  });

  it("returns false for any other code", () => {
    expect(verifyDevConfirmationCode("000000")).toBe(false);
  });
});
