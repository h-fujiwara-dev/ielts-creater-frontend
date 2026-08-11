import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { AppNavUserMenu } from "./app-nav-user-menu";

describe("AppNavUserMenu (#00041)", () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
      writable: true,
    });
  });

  it("navigates to /api/auth/cognito-logout so both NextAuth and Cognito sessions are cleared", async () => {
    // jsdomのlocation.hrefは直接再定義できない（non-configurable）ため、
    // window.location自体をテスト用スタブに差し替える。
    const locationStub = { href: "" };
    Object.defineProperty(window, "location", {
      configurable: true,
      value: locationStub,
      writable: true,
    });

    const user = userEvent.setup();
    render(<AppNavUserMenu user={{ id: "u1", email: "user@example.com", displayName: "Taro" }} />);
    await user.click(screen.getByRole("button", { name: "ログアウト" }));

    expect(locationStub.href).toBe("/api/auth/cognito-logout");
  });
});
