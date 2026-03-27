import React from 'react';

interface ScoreBarProps {
  score: number; // 0–100
}

export function ScoreBar({ score }: ScoreBarProps): React.JSX.Element {
  const color = score >= 60 ? 'var(--green)' : score >= 35 ? 'var(--amber-decorative)' : 'var(--text-muted)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '60px',
          height: '6px',
          background: 'var(--bg-subtle)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background: color,
            borderRadius: '3px',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
        {score}
      </span>
    </div>
  );
}
