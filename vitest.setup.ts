import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  window.localStorage.clear();
  vi.clearAllMocks();
});

// jsdom does not implement matchMedia. Default to "prefers-reduced-motion: reduce"
// so DotField/useInView-driven reveal animations take their static/no-op branch
// deterministically. Individual tests can override via window.matchMedia mockReturnValue.
class MockMediaQueryList implements MediaQueryList {
  matches = true;
  media: string;
  onchange = null;

  constructor(media: string) {
    this.media = media;
  }

  addEventListener() {}
  removeEventListener() {}
  addListener() {}
  removeListener() {}
  dispatchEvent() {
    return false;
  }
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => new MockMediaQueryList(query)),
});

// jsdom does not implement IntersectionObserver / ResizeObserver.
// Needed by useInView() (S-01 reveal animations) and recharts' ResponsiveContainer (S-07).
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- jsdom has no IntersectionObserver
global.IntersectionObserver = MockObserver;
global.ResizeObserver = MockObserver;

// jsdom does not implement elementFromPoint. input-otp (S-02 confirmation code)
// polls it internally to sync focus/selection, which otherwise throws asynchronously
// after a test has already finished.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}
