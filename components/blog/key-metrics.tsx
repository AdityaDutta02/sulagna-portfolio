interface KeyMetricsProps { dataPoints?: number; sources?: number; insightScore?: number; }

const metrics = [
  { key: 'dataPoints' as const, label: 'Data Points', icon: '◆', colour: 'var(--amber)' },
  { key: 'sources' as const, label: 'Sources', icon: '◇', colour: 'var(--blue)' },
  { key: 'insightScore' as const, label: 'Insight Score', icon: '★', colour: 'var(--green)' },
];

export function KeyMetrics(props: KeyMetricsProps) {
  const visible = metrics.filter(m => props[m.key] != null);
  if (visible.length === 0) return null;

  return (
    <div
      className="flex items-center gap-6 py-4 px-1 mb-8"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      {visible.map(({ key, label, icon, colour }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs" style={{ color: colour }}>{icon}</span>
          <div>
            <div
              className="text-lg font-bold leading-none"
              style={{ fontFamily: 'var(--font-mono)', color: colour }}
            >
              {key === 'insightScore' ? `${props[key]}/10` : `${props[key]}+`}
            </div>
            <div
              className="text-[9px] uppercase tracking-wider mt-0.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}
            >
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
