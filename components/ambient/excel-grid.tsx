// Server component — renders spreadsheet column/row labels as ambient decoration.
// Grid lines themselves come from body::before in globals.css.

const COLUMNS = Array.from({ length: 34 }, (_, i) =>
  String.fromCharCode(65 + i), // A through AH (34 columns)
);

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function ExcelGrid() {
  return (
    <div
      className="hidden md:block"
      aria-hidden="true"
      style={{ opacity: 0.18, pointerEvents: "none" }}
    >
      {/* Column headers — one per 40px grid cell */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 40,
          right: 0,
          height: 40,
          display: "flex",
          zIndex: 0,
        }}
      >
        {COLUMNS.map((col) => (
          <div
            key={col}
            style={{
              width: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              color: "var(--text-dim)",
              letterSpacing: "0.05em",
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Row numbers — one per 40px grid cell */}
      <div
        style={{
          position: "fixed",
          top: 40,
          left: 0,
          width: 40,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 0,
        }}
      >
        {ROWS.map((row) => (
          <div
            key={row}
            style={{
              height: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              color: "var(--text-dim)",
            }}
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}
