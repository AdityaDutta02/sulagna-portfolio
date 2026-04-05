"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACKS = [
  {
    name: "hanging lanterns",
    artist: "kalaido",
    src: "https://archive.org/download/kalaido-hanging-lanterns_202101/Kalaido%20-%20Hanging%20Lanterns.mp3",
  },
  {
    name: "first snow",
    artist: "kerusu",
    src: "https://archive.org/download/kalaido-hanging-lanterns_202101/Kerusu%20-%20First%20Snow.mp3",
  },
  {
    name: "car radio",
    artist: "flovry",
    src: "https://archive.org/download/kalaido-hanging-lanterns_202101/flovry%20-%20car%20radio.mp3",
  },
  {
    name: "waves",
    artist: "matt quentin",
    src: "https://archive.org/download/kalaido-hanging-lanterns_202101/Matt%20Quentin%20-%20Waves.mp3",
  },
  {
    name: "rain beat",
    artist: "lofi type beat",
    src: "https://archive.org/download/kalaido-hanging-lanterns_202101/(FREE)%20Lo-fi%20Type%20Beat%20-%20Rain.mp3",
  },
];

// EQ bar configs for collapsed pill (5 bars)
const PILL_BARS = [
  { h: 8, sp: "0.6s" },
  { h: 12, sp: "0.9s" },
  { h: 6, sp: "0.7s" },
  { h: 14, sp: "1.1s" },
  { h: 10, sp: "0.8s" },
];

// EQ bar configs for expanded player (12 bars)
const PLAYER_BARS = [
  { h: 10, sp: "0.6s" },
  { h: 16, sp: "0.9s" },
  { h: 8, sp: "0.7s" },
  { h: 20, sp: "1.1s" },
  { h: 12, sp: "0.8s" },
  { h: 18, sp: "1.3s" },
  { h: 6, sp: "0.65s" },
  { h: 14, sp: "1.0s" },
  { h: 22, sp: "1.2s" },
  { h: 10, sp: "0.75s" },
  { h: 16, sp: "1.15s" },
  { h: 8, sp: "0.85s" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

interface EqBarsProps {
  bars: { h: number; sp: string }[];
  playing: boolean;
  gap?: number;
  barWidth?: number;
  opacity?: number;
}

function EqBars({ bars, playing, gap = 2, barWidth = 3, opacity = 1 }: EqBarsProps) {
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap, opacity }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            height: bar.h,
            borderRadius: 1,
            background: "var(--amber)",
            transformOrigin: "bottom",
            animationName: playing ? "eq" : "none",
            animationDuration: bar.sp,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
      ))}
    </div>
  );
}

interface VinylProps { size: number; spinning: boolean }

function Vinyl({ size, spinning }: VinylProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #3a3a3a, #111)",
        flexShrink: 0,
        position: "relative",
        animationName: spinning ? "spin" : "none",
        animationDuration: "3s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "30%",
          borderRadius: "50%",
          background: "var(--amber)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function MusicWidget() {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Tracks intended play state across async gaps
  const shouldPlayRef = useRef(false);

  const track = TRACKS[trackIdx];

  // Initialise audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIdx((i) => (i + 1) % TRACKS.length);
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Swap src whenever track changes; resume playback if we were playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[trackIdx].src;
    audio.load();
    if (shouldPlayRef.current) {
      audio.play().catch(() => {
        shouldPlayRef.current = false;
        setPlaying(false);
      });
    }
  }, [trackIdx]);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      shouldPlayRef.current = false;
      setPlaying(false);
    } else {
      try {
        await audio.play();
        shouldPlayRef.current = true;
        setPlaying(true);
      } catch {
        shouldPlayRef.current = false;
        setPlaying(false);
      }
    }
  }, [playing]);

  const handleNext = useCallback(() => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20 }}>
      {expanded ? (
        <ExpandedPlayer
          playing={playing}
          track={track}
          onPlayPause={handlePlayPause}
          onTrack={(dir) => (dir === "next" ? handleNext() : handlePrev())}
          onMinimize={() => setExpanded(false)}
        />
      ) : (
        <CollapsedPill playing={playing} track={track} onClick={() => setExpanded(true)} />
      )}
    </div>
  );
}

// ── Collapsed pill ───────────────────────────────────────────────────────────

interface CollapsedPillProps {
  playing: boolean;
  track: { name: string; artist: string };
  onClick: () => void;
}

function CollapsedPill({ playing, track, onClick }: CollapsedPillProps) {
  return (
    <button
      onClick={onClick}
      data-testid="music-pill"
      aria-label="Open music player"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 100,
        width: 180,
        height: 44,
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Vinyl size={28} spinning={playing} />
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {track.name}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-dim)" }}>
          {track.artist}
        </div>
      </div>
      <EqBars bars={PILL_BARS} playing={playing} gap={1} barWidth={2} opacity={0.7} />
    </button>
  );
}

// ── Expanded player ──────────────────────────────────────────────────────────

interface ExpandedPlayerProps {
  playing: boolean;
  track: { name: string; artist: string };
  onPlayPause: () => void;
  onTrack: (dir: "prev" | "next") => void;
  onMinimize: () => void;
}

function ExpandedPlayer({ playing, track, onPlayPause, onTrack, onMinimize }: ExpandedPlayerProps) {
  return (
    <div
      data-testid="music-expanded"
      style={{ width: 260, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.10)", overflow: "hidden" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          ♫ lofi.radio
        </span>
        <button onClick={onMinimize} data-testid="music-minimize" aria-label="Minimize music player" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: 14, lineHeight: 1, padding: "2px 4px" }}>
          −
        </button>
      </div>
      <div style={{ padding: "16px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Vinyl size={52} spinning={playing} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
              {track.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)" }}>
              {track.artist}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <EqBars bars={PLAYER_BARS} playing={playing} gap={3} barWidth={3} opacity={0.6} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <ControlButton onClick={() => onTrack("prev")} label="Previous track" size={28}>⏮</ControlButton>
          <ControlButton onClick={onPlayPause} label={playing ? "Pause" : "Play"} size={36} primary>
            {playing ? "⏸" : "▶"}
          </ControlButton>
          <ControlButton onClick={() => onTrack("next")} label="Next track" size={28}>⏭</ControlButton>
        </div>
      </div>
    </div>
  );
}

// ── Control button ───────────────────────────────────────────────────────────

interface ControlButtonProps {
  onClick: () => void;
  label: string;
  size: number;
  primary?: boolean;
  children: React.ReactNode;
}

function ControlButton({ onClick, label, size, primary = false, children }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: primary ? "none" : "1px solid var(--border)",
        background: primary ? "var(--amber)" : "transparent",
        color: primary ? "var(--bg-card)" : "var(--text-muted)",
        fontSize: primary ? 13 : 11,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
