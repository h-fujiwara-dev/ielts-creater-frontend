interface ScoreRingProps {
  rawScore: number;
  maxScore: number;
}

const SIZE = 120;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ rawScore, maxScore }: ScoreRingProps) {
  const percent = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className="relative flex size-[120px] shrink-0 items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="stroke-muted"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          className="stroke-brand-orange transition-all duration-500"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-brand-navy">{percent}%</span>
        <span className="text-xs text-muted-foreground">
          {rawScore} / {maxScore}問
        </span>
      </div>
    </div>
  );
}
