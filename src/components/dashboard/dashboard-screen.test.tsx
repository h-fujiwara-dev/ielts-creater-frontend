import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { mockGetDashboardSummary } from "@/lib/dashboard/mock-data";
import { jsonResponse, route, stubFetchRoutes } from "@/test/fetch-mock";

vi.mock("@/lib/dashboard/mock-data", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/dashboard/mock-data")>();
  return {
    ...actual,
    mockGetDashboardSummary: vi.fn(actual.mockGetDashboardSummary),
  };
});

const SUMMARY_RESPONSE = {
  totalAttempts: 42,
  averageAccuracyBySection: { READING: 0.72, LISTENING: 0.65 },
  scoreTrend: [{ date: "2026-08-01", accuracy: 0.6 }],
  accuracyByFormat: { TFNG: 0.78, MCQ: 0.64, FILL_BLANK: 0.58, MATCHING_HEADINGS: 0.45 },
};

beforeEach(() => {
  stubFetchRoutes([
    route("GET", "/api/v1/dashboard/summary?period=30D", () => jsonResponse(SUMMARY_RESPONSE)),
    route("GET", "/api/v1/dashboard/summary?period=7D", () => jsonResponse(SUMMARY_RESPONSE)),
  ]);
});

afterEach(() => {
  vi.mocked(mockGetDashboardSummary).mockClear();
  vi.unstubAllGlobals();
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
