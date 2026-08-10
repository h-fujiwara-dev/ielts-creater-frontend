"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import type { AudioSegment } from "@/lib/question-sets/types";

interface AudioPlayerProps {
  segments: AudioSegment[];
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// 複数の音声セグメントを1つの連続音声として見せるプレイヤー。実際の音声ファイルには
// 接続せず（署名付きURLの発行はスコープ外）、再生位置はローカルstateで疑似的に進める。
export function AudioPlayer({ segments }: AudioPlayerProps) {
  const totalDurationMs = segments.reduce((sum, segment) => sum + segment.durationMs, 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 1000;
        if (next >= totalDurationMs) {
          setIsPlaying(false);
          return totalDurationMs;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, totalDurationMs]);

  const progress = totalDurationMs > 0 ? (elapsedMs / totalDurationMs) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-full bg-brand-navy px-4 py-3 text-white">
      <button
        type="button"
        onClick={() => setIsPlaying((prev) => !prev)}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white"
        aria-label={isPlaying ? "一時停止" : "再生"}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
        <div className="h-full bg-brand-orange" style={{ width: `${progress}%` }} />
      </div>
      <span className="w-24 shrink-0 text-right text-sm tabular-nums text-white/80">
        {formatTime(elapsedMs)} / {formatTime(totalDurationMs)}
      </span>
    </div>
  );
}
