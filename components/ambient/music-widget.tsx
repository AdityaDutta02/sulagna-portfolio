"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACK = { name: "midnight data", artist: "lofi bytes" };

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

// ── Web Audio ambient generator ──────────────────────────────────────────────

function createAmbientSound(ctx: AudioContext): AudioNode {
  // Brown noise via filtered white noise
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.06;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 400;

  noiseSource.connect(lowpass);
  lowpass.connect(noiseGain);

  // Gentle sine tones for warmth
  const toneFreqs = [55, 110, 165];
  const toneNodes: OscillatorNode[] = [];
  for (const freq of toneFreqs) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0.012;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    toneNodes.push(osc);
  }

  const master = ctx.createGain();
  master.gain.value = 0.7;
  noiseGain.connect(master);

  noiseSource.start();

  // Return master so caller can connect to destination; attach cleanup
  (master as unknown as { _sources: (AudioBufferSourceNode | OscillatorNode)[] })._sources = [
    noiseSource,
    ...toneNodes,
  ];
  return master;
}

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
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<(AudioNode & { _sources?: (AudioBufferSourceNode | OscillatorNode)[] }) | null>(null);

  const startPlayback = useCallback(async () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    if (!masterRef.current) {
      masterRef.current = createAmbientSound(ctx) as AudioNode & {
        _sources?: (AudioBufferSourceNode | OscillatorNode)[];
      };
      masterRef.current.connect(ctx.destination);
    }
    setPlaying(true);
  }, []);

  const stopPlayback = useCallback(() => {
    if (ctxRef.current) {
      ctxRef.current.suspend();
    }
    setPlaying(false);
  }, []);

  const handlePlayPause = useCallback(async () => {
    if (playing) {
      stopPlayback();
    } else {
      await startPlayback();
    }
  }, [playing, startPlayback, stopPlayback]);

  const handleSeekStart = useCallback(async () => {
    if (masterRef.current) {
      masterRef.current._sources?.forEach((s) => {
        try { s.stop(); } catch { /* already stopped */ }
      });
      masterRef.current.disconnect();
      masterRef.current = null;
    }
    if (playing) await startPlayback();
  }, [playing, startPlayback]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20 }}>
      {expanded ? (
        <ExpandedPlayer
          playing={playing}
          onPlayPause={handlePlayPause}
          onPrev={handleSeekStart}
          onNext={handleSeekStart}
          onMinimize={() => setExpanded(false)}
        />
      ) : (
        <CollapsedPill playing={playing} onClick={() => setExpanded(true)} />
      )}
    </div>
  );
}

// ── Collapsed pill ───────────────────────────────────────────────────────────

interface CollapsedPillProps { playing: boolean; onClick: () => void }

function CollapsedPill({ playing, onClick }: CollapsedPillProps) {
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
          {TRACK.name}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-dim)" }}>
          {TRACK.artist}
        </div>
      </div>
      <EqBars bars={PILL_BARS} playing={playing} gap={1} barWidth={2} opacity={0.7} />
    </button>
  );
}

// ── Expanded player ──────────────────────────────────────────────────────────

interface ExpandedPlayerProps {
  playing: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMinimize: () => void;
}

function ExpandedPlayer({ playing, onPlayPause, onPrev, onNext, onMinimize }: ExpandedPlayerProps) {
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
              {TRACK.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)" }}>
              {TRACK.artist}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <EqBars bars={PLAYER_BARS} playing={playing} gap={3} barWidth={3} opacity={0.6} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <ControlButton onClick={onPrev} label="Restart" size={28}>⏮</ControlButton>
          <ControlButton onClick={onPlayPause} label={playing ? "Pause" : "Play"} size={36} primary>
            {playing ? "⏸" : "▶"}
          </ControlButton>
          <ControlButton onClick={onNext} label="Restart" size={28}>⏭</ControlButton>
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
