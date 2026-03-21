interface KeyMetricsProps { dataPoints?: number; sources?: number; insightScore?: number; }
const items = [
  { key: 'dataPoints', label: 'DATA POINTS', colour: 'var(--amber)' },
  { key: 'sources', label: 'SOURCES', colour: 'var(--blue)' },
  { key: 'insightScore', label: 'INSIGHT SCORE', colour: 'var(--green)' },
] as const;
export function KeyMetrics(props: KeyMetricsProps) {
  const visible = items.filter(i => props[i.key] != null);
  if (visible.length === 0) return null;
  return (
    <div className="flex gap-4 p-3 rounded-lg mb-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      {visible.map(({ key, label, colour }) => (
        <div key={key}>
          <div className="text-[8px] uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{label}</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)', color: colour }}>{key === 'insightScore' ? `${props[key]}/10` : `${props[key]}+`}</div>
        </div>
      ))}
    </div>
  );
}
