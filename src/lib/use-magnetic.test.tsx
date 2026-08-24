import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMagnetic } from "./use-magnetic";

function Probe() {
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button ref={ref} style={{ width: 40, height: 40 }}>
      CTA
    </button>
  );
}

function mockMatchMedia(matches: boolean) {
  return vi.fn((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("useMagnetic", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("does nothing under prefers-reduced-motion (test default)", () => {
    const { getByRole } = render(<Probe />);
    const button = getByRole("button");

    fireEvent.mouseMove(document, { clientX: 20, clientY: 20 });

    expect(button.style.transform).toBe("");
  });

  describe("with motion enabled and a fine pointer", () => {
    beforeEach(() => {
      window.matchMedia = mockMatchMedia(false);
    });

    it("pulls the element toward a nearby cursor and resets once the cursor moves away", () => {
      const { getByRole } = render(<Probe />);
      const button = getByRole("button");
      vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: 40,
        bottom: 40,
        width: 40,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect);

      fireEvent.mouseMove(document, { clientX: 30, clientY: 30 });
      expect(button.style.transform).not.toBe("");

      fireEvent.mouseMove(document, { clientX: 5000, clientY: 5000 });
      expect(button.style.transform).toBe("");
    });
  });
});
