import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroScene } from "@/components/three/hero-scene";

vi.mock("@/components/three/band-score-scene", () => ({
  BandScoreScene: () => <div data-testid="band-score-scene" />,
}));

describe("HeroScene", () => {
  afterEach(() => {
    vi.mocked(window.matchMedia).mockReset();
    window.matchMedia = vi.fn(
      () =>
        ({
          matches: true,
          media: "",
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
  });

  it("renders the static fallback under prefers-reduced-motion (test default), never requesting the 3D chunk", async () => {
    render(<HeroScene />);

    expect(await screen.findByText("8")).toBeInTheDocument();
    expect(screen.queryByTestId("band-score-scene")).not.toBeInTheDocument();
  });

  it("renders the static fallback when WebGL2 is unavailable, even without reduced motion", async () => {
    window.matchMedia = vi.fn(
      () =>
        ({
          matches: false,
          media: "",
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );

    render(<HeroScene />);

    expect(await screen.findByText("8")).toBeInTheDocument();
    expect(screen.queryByTestId("band-score-scene")).not.toBeInTheDocument();
  });

  it("mounts the 3D scene once motion is allowed and WebGL2 is available", async () => {
    window.matchMedia = vi.fn(
      () =>
        ({
          matches: false,
          media: "",
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as unknown as ReturnType<HTMLCanvasElement["getContext"]>,
    );

    render(<HeroScene />);

    expect(await screen.findByTestId("band-score-scene")).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
