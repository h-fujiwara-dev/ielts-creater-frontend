// Static SVG stand-in for HeroVisualScene's headphones + book — no canvas, no
// rAF, no GSAP. Shown under prefers-reduced-motion, when WebGL2 is
// unavailable, and momentarily while HeroVisualScene's chunk is being fetched.
export function HeroSceneFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4" aria-hidden="true">
      <svg viewBox="0 0 260 140" className="w-full max-w-xs">
        {/* Headphones (Listening) */}
        <path
          d="M 25 78 A 40 40 0 0 1 105 78"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="16" y="70" width="18" height="32" rx="7" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
        <rect x="96" y="70" width="18" height="32" rx="7" fill="#1e293b" stroke="#f97316" strokeWidth="2" />

        {/* Book (Reading) */}
        <line x1="195" y1="35" x2="195" y2="95" stroke="#475569" strokeWidth="3" />
        <g transform="rotate(-18 195 65)">
          <rect x="150" y="40" width="45" height="55" rx="3" fill="#fffdf9" stroke="#334155" strokeWidth="1.5" />
          <line x1="160" y1="55" x2="185" y2="55" stroke="#f97316" strokeWidth="2" />
          <line x1="160" y1="65" x2="185" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <line x1="160" y1="75" x2="185" y2="75" stroke="#94a3b8" strokeWidth="2" />
        </g>
        <g transform="rotate(18 195 65)">
          <rect x="195" y="40" width="45" height="55" rx="3" fill="#fffdf9" stroke="#334155" strokeWidth="1.5" />
          <line x1="205" y1="55" x2="230" y2="55" stroke="#94a3b8" strokeWidth="2" />
          <line x1="205" y1="65" x2="230" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <line x1="205" y1="75" x2="230" y2="75" stroke="#94a3b8" strokeWidth="2" />
        </g>
      </svg>
      <div className="flex gap-10">
        <p className="font-mono text-[10px] tracking-widest text-white/50">LISTENING</p>
        <p className="font-mono text-[10px] tracking-widest text-white/50">READING</p>
      </div>
    </div>
  );
}
