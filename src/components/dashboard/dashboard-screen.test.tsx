import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { mockGetDashboardSummary } from "@/lib/dashboard/mock-data";

vi.mock("@/lib/dashboard/mock-data", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/dashboard/mock-data")>();
  return {
    ...actual,
    mockGetDashboardSummary: vi.fn(actual.mockGetDashboardSummary),
  };
});

afterEach(() => {
  vi.mocked(mockGetDashboardSummary).mockClear();
});

describe("DashboardScreen (S-07)", () => {
  it("renders the summary once both requests resolve", async () => {
    render(<DashboardScreen />);

    expect(await screen.findByText("総受験回数", {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("re-fetches the summary with the new period when the period filter changes", async () => {
    const user = userEvent.setup();
    render(<DashboardScreen />);

    await screen.findByText("総受験回数", {}, { timeout: 2000 });
    vi.mocked(mockGetDashboardSummary).mockClear();

    await user.click(screen.getByRole("tab", { name: "1週間" }));

    await waitFor(() =>
      expect(mockGetDashboardSummary).toHaveBeenLastCalledWith({
        period: "7D",
        section: undefined,
      }),
    );
  });
});
