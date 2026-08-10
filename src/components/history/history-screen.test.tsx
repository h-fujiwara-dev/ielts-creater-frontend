import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HistoryScreen } from "@/components/history/history-screen";
import { mockGetAttempts } from "@/lib/attempts/mock-data";

vi.mock("@/lib/attempts/mock-data", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/attempts/mock-data")>();
  return {
    ...actual,
    mockGetAttempts: vi.fn(actual.mockGetAttempts),
  };
});

afterEach(() => {
  vi.mocked(mockGetAttempts).mockClear();
});

describe("HistoryScreen (S-06)", () => {
  it("renders the first page of attempts (page size 5) with pagination", async () => {
    render(<HistoryScreen />);

    expect(
      await screen.findAllByRole("button", { name: "もう一度解く" }, { timeout: 2000 }),
    ).toHaveLength(5);
    // 12 fixture items / page size 5 -> 3 pages.
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("re-fetches with the section filter and resets to page 1 when switching tabs", async () => {
    const user = userEvent.setup();
    render(<HistoryScreen />);

    await screen.findAllByRole("button", { name: "もう一度解く" }, { timeout: 2000 });

    await user.click(screen.getByRole("tab", { name: "Reading" }));

    await waitFor(() =>
      expect(mockGetAttempts).toHaveBeenLastCalledWith({
        section: "READING",
        page: 0,
        size: 5,
      }),
    );
  });

  it("requests the next page when a pagination button is clicked", async () => {
    const user = userEvent.setup();
    render(<HistoryScreen />);

    await screen.findAllByRole("button", { name: "もう一度解く" }, { timeout: 2000 });

    await user.click(screen.getByRole("button", { name: "2" }));

    await waitFor(() =>
      expect(mockGetAttempts).toHaveBeenLastCalledWith({
        section: undefined,
        page: 1,
        size: 5,
      }),
    );
  });

  it("shows the empty state when there are no attempts", async () => {
    vi.mocked(mockGetAttempts).mockResolvedValueOnce({ items: [], page: 0, totalPages: 1 });

    render(<HistoryScreen />);

    expect(await screen.findByText("まだ受験履歴がありません", {}, { timeout: 2000 })).toBeInTheDocument();
  });
});
