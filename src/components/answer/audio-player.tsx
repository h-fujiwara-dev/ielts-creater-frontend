"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { apiGetBlob } from "@/lib/api/client";
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

// 複数の音声セグメントを1つの連続音声として見せるプレイヤー。GET .../audio-segments/{id}/file
// （backendがS3から配信、Next.jsのrewritesプロキシ経由）を1セグメントずつ再生し、
// 終了時に自動で次のセグメントへ進める。
export function AudioPlayer({ segments }: AudioPlayerProps) {
  const sorted = [...segments].sort((a, b) => a.turnIndex - b.turnIndex);
  const totalDurationMs = sorted.reduce((sum, segment) => sum + segment.durationMs, 0);
  const priorDurationMs = sorted.reduce<number[]>((acc, _segment, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + sorted[index - 1].durationMs);
    return acc;
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const currentSegment = sorted[segmentIndex];
  const currentSegmentUrl = currentSegment?.url;

  // GET .../audio-segments/{id}/fileは認証必須のため、<audio src>へ直接APIのURLを
  // 渡すとブラウザのネイティブリクエストにAuthorizationヘッダーが付かず401になり
  // 再生できない。認証付きfetchでBlobとして取得しObject URLへ差し替える（#00054）。
  useEffect(() => {
    if (!currentSegmentUrl) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    apiGetBlob(currentSegmentUrl).then((blob) => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setAudioSrc(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentSegmentUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setElapsedMs((priorDurationMs[segmentIndex] ?? 0) + audio.currentTime * 1000);
    };
    const handleEnded = () => {
      if (segmentIndex < sorted.length - 1) {
        setSegmentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || !audioSrc) return;
    audio.play().catch(() => setIsPlaying(false));
  }, [audioSrc, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const progress = totalDurationMs > 0 ? (elapsedMs / totalDurationMs) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-full bg-brand-navy px-4 py-3 text-white">
      {currentSegment && audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!currentSegment || !audioSrc}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white disabled:opacity-50"
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
