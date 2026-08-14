import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AudioPlayer } from "@/components/answer/audio-player";
import { route, stubFetchRoutes } from "@/test/fetch-mock";

const SEGMENT_URL = "/api/v1/question-sets/qs-1/audio-segments/seg-1/file";
const SEGMENTS = [{ turnIndex: 0, url: SEGMENT_URL, durationMs: 5000 }];

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:mock-audio");
  URL.revokeObjectURL = vi.fn();
});

describe("AudioPlayer", () => {
  it("fetches the audio segment as an authenticated request and plays it via a Blob URL (#00054)", async () => {
    stubFetchRoutes([
      route("GET", SEGMENT_URL, () => new Response(new Blob(["audio-bytes"]), { status: 200 })),
    ]);

    render(<AudioPlayer segments={SEGMENTS} />);

    await waitFor(() => {
      expect(document.querySelector("audio")?.getAttribute("src")).toBe("blob:mock-audio");
    });

    expect(screen.getByRole("button", { name: "再生" })).not.toBeDisabled();
  });

  it("keeps the play button disabled until the audio Blob has loaded", () => {
    stubFetchRoutes([
      route(
        "GET",
        SEGMENT_URL,
        () => new Promise<Response>(() => {}) // never resolves within this test
      ),
    ]);

    render(<AudioPlayer segments={SEGMENTS} />);

    expect(screen.getByRole("button", { name: "再生" })).toBeDisabled();
  });

  it("updates the elapsed time display on timeupdate once the Blob-backed <audio> element has mounted (#00054)", async () => {
    stubFetchRoutes([
      route("GET", SEGMENT_URL, () => new Response(new Blob(["audio-bytes"]), { status: 200 })),
    ]);

    render(<AudioPlayer segments={SEGMENTS} />);

    const audio = await waitFor(() => {
      const el = document.querySelector("audio");
      expect(el).not.toBeNull();
      return el as HTMLAudioElement;
    });

    expect(screen.getByText("00:00 / 00:05")).toBeInTheDocument();

    Object.defineProperty(audio, "currentTime", { value: 3, configurable: true });
    audio.dispatchEvent(new Event("timeupdate"));

    await waitFor(() => {
      expect(screen.getByText("00:03 / 00:05")).toBeInTheDocument();
    });
  });
});
