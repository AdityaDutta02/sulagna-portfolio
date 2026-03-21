'use client';

export function TypingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-3.5 align-text-bottom ml-0.5"
      style={{
        backgroundColor: 'var(--amber)',
        animation: 'blink 1.2s step-end infinite',
      }}
      aria-hidden="true"
    />
  );
}
