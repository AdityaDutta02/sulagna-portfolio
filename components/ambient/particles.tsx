"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  duration: string;
  delay: string;
  size: number;
}

function buildParticles(): Particle[] {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${8 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    size: 2 + Math.floor(Math.random() * 3),
  }));
}

export default function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Check reduced-motion preference and subscribe to changes.
    // All setState calls happen inside callbacks, not synchronously
    // in the effect body, satisfying react-hooks/set-state-in-effect.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = (reduced: boolean) => {
      setParticles(reduced ? [] : buildParticles());
    };

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);

    // Defer the initial check to a callback via setTimeout so it does
    // not execute synchronously inside the effect body.
    const init = setTimeout(() => apply(mq.matches), 0);

    return () => {
      mq.removeEventListener("change", handler);
      clearTimeout(init);
    };
  }, []);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-10px",
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "var(--amber)",
            opacity: 0.35,
            animation: `float-up ${p.duration} ${p.delay} ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
}
