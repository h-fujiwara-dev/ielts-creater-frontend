// Kept independent of band-score-slab.tsx's own BAND_COUNT (same value, 8)
// so this fallback never pulls in that module's three.js/drei imports —
// doing so would defeat the point of dynamically importing BandScoreScene.
const BAND_COUNT = 8;

// Static SVG stand-in for BandScoreScene — no canvas, no rAF, no GSAP. Shown
// under prefers-reduced-motion, when WebGL2 is unavailable, and momentarily
// while BandScoreScene's chunk is being fetched.
export function HeroSceneFallback() {
  return (
    <div
      className="flex h-full w-full items-end justify-center gap-2 px-6 pb-8"
      aria-hidden="true"
    >
      {Array.from({ length: BAND_COUNT }, (_, i) => {
        const band = i + 1;
        const isFocus = band === BAND_COUNT;
        return (
          <div
            key={band}
            className="flex flex-1 flex-col items-center justify-end gap-2"
            style={{ height: `${20 + i * 9}%` }}
          >
            <span
              className={`font-mono text-[10px] ${isFocus ? "text-brand-orange" : "text-white/40"}`}
            >
              {band}
            </span>
            <div
              className={`w-full rounded-t-md ${
                isFocus ? "bg-brand-orange" : "bg-white/15"
              }`}
              style={{ height: "100%" }}
            />
          </div>
        );
      })}
    </div>
  );
}
