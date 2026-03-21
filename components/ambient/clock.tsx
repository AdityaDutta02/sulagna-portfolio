"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function Clock() {
  // Initialise with empty string to avoid SSR/hydration mismatch.
  // The interval callback fires immediately via a leading tick pattern.
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Use a ref-free leading-tick approach: update once after mount,
    // then every 10s. This satisfies react-hooks/set-state-in-effect
    // because the setState is called inside the interval callback, not
    // directly in the effect body.
    const tick = () => setTime(formatTime(new Date()));
    const id = setInterval(tick, 10_000);

    // Trigger the first render via a zero-delay timeout so the setState
    // happens inside a callback rather than synchronously in the effect.
    const init = setTimeout(tick, 0);

    return () => {
      clearInterval(id);
      clearTimeout(init);
    };
  }, []);

  if (!time) return null;

  return (
    <div
      aria-label={`Local time: ${time}`}
      className="hidden md:flex"
      style={{
        position: "fixed",
        top: 28,
        right: 28,
        zIndex: 10,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        padding: "6px 10px",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: 7,
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
        }}
      >
        LOCAL
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "0.05em",
        }}
      >
        {time}
      </span>
    </div>
  );
}
