// Server component — "open to opportunities" indicator fixed bottom-left.

export default function StatusBadge() {
  return (
    <div
      className="hidden md:flex"
      style={{
        position: "fixed",
        bottom: 24,
        left: 28,
        alignItems: "center",
        gap: 6,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Pulsing green dot */}
      <div
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--green)",
          animation: "dot-pulse 1.4s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        open to opportunities
      </span>
    </div>
  );
}
