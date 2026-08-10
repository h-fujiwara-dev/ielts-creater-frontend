import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmCodeForm } from "@/components/auth/confirm-code-form";
import { DEV_CONFIRMATION_CODE } from "@/lib/auth/dev-user";

describe("ConfirmCodeForm (S-02)", () => {
  it("shows the pending email", () => {
    render(<ConfirmCodeForm email="new-user@example.com" onConfirmSuccess={vi.fn()} />);

    expect(screen.getByText("new-user@example.com")).toBeInTheDocument();
  });

  it("calls onConfirmSuccess for the correct dev confirmation code", async () => {
    const onConfirmSuccess = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmCodeForm email="new-user@example.com" onConfirmSuccess={onConfirmSuccess} />);

    await user.type(screen.getByLabelText("確認コード"), DEV_CONFIRMATION_CODE);
    await user.click(screen.getByRole("button", { name: "確認する" }));

    expect(onConfirmSuccess).toHaveBeenCalledTimes(1);
  });

  it("shows an auth error alert for an incorrect code", async () => {
    const onConfirmSuccess = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmCodeForm email="new-user@example.com" onConfirmSuccess={onConfirmSuccess} />);

    await user.type(screen.getByLabelText("確認コード"), "000000");
    await user.click(screen.getByRole("button", { name: "確認する" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "確認コードが正しくないか、有効期限が切れています",
    );
    expect(onConfirmSuccess).not.toHaveBeenCalled();
  });
});
