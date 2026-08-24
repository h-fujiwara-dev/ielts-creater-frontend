import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInView } from "./use-in-view";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  target: Element | null = null;
  unobserve = vi.fn();
  disconnect = vi.fn();
  observe = vi.fn((el: Element) => {
    this.target = el;
  });

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as never);
  }
}

function Probe({ threshold }: { threshold?: number } = {}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });
  return <div ref={ref}>{inView ? "in-view" : "out-of-view"}</div>;
}

describe("useInView", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    // @ts-expect-error -- narrower fake than the DOM type, sufficient for this test
    global.IntersectionObserver = FakeIntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("starts out of view and observes the attached element", () => {
    render(<Probe />);

    expect(screen.getByText("out-of-view")).toBeInTheDocument();
    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(FakeIntersectionObserver.instances[0].observe).toHaveBeenCalled();
  });

  it("flips to inView and unobserves once the element intersects", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.instances[0];

    act(() => {
      observer.trigger(true);
    });

    expect(screen.getByText("in-view")).toBeInTheDocument();
    expect(observer.unobserve).toHaveBeenCalledWith(observer.target);
  });

  it("stays out of view when the entry is not intersecting", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.instances[0];

    act(() => {
      observer.trigger(false);
    });

    expect(screen.getByText("out-of-view")).toBeInTheDocument();
    expect(observer.unobserve).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Probe />);
    const observer = FakeIntersectionObserver.instances[0];

    unmount();

    expect(observer.disconnect).toHaveBeenCalled();
  });
});
