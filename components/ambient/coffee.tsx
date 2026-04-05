"use client";

const STEAM_LINES = [
  { delay: "0s", left: "8px" },
  { delay: "0.5s", left: "16px" },
  { delay: "1s", left: "24px" },
];

export default function Coffee() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:flex"
      style={{
        position: "fixed",
        bottom: 60,
        left: 24,
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Steam lines */}
      <div style={{ position: "relative", width: 36, height: 16 }}>
        {STEAM_LINES.map((steam, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: steam.left,
              bottom: 0,
              width: 2,
              height: 12,
              borderRadius: 1,
              backgroundColor: "var(--text-dim)",
              animation: `steam-float 2s ${steam.delay} ease-in-out infinite`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>

      {/* Cup emoji */}
      <span style={{ fontSize: 18, lineHeight: 1 }}>☕</span>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          color: "var(--text-dim)",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        brewing insights...
      </span>
    </div>
  );
}
