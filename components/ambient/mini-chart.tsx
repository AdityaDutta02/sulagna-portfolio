"use client";

// 7 oscillating EQ bars near the coffee widget. Uses the `eq` keyframe from globals.css.
const BARS = [
  { height: 14, duration: "0.8s", delay: "0s" },
  { height: 20, duration: "1.1s", delay: "0.15s" },
  { height: 10, duration: "0.9s", delay: "0.3s" },
  { height: 18, duration: "1.3s", delay: "0.05s" },
  { height: 12, duration: "1.5s", delay: "0.4s" },
  { height: 22, duration: "1.0s", delay: "0.2s" },
  { height: 16, duration: "1.2s", delay: "0.35s" },
];

export default function MiniChart() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:flex"
      style={{
        position: "fixed",
        bottom: 24,
        left: 80,
        alignItems: "flex-end",
        gap: 2,
        zIndex: 50,
        opacity: 0.3,
        pointerEvents: "none",
      }}
    >
      {BARS.map((bar, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: bar.height,
            borderRadius: 1,
            backgroundColor: "var(--amber)",
            animation: `eq ${bar.duration} ${bar.delay} ease-in-out infinite alternate`,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}
