interface DataCalloutProps { stat: string; source?: string; children: React.ReactNode; }
export function DataCallout({ stat, source, children }: DataCalloutProps) {
  return (
    <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--cream)', borderLeft: '4px solid var(--amber)' }}>
      <div className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{stat}</div>
      <div className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{children}</div>
      {source && <div className="text-[10px] mt-2" style={{ color: 'var(--text-dim)' }}>Source: {source}</div>}
    </div>
  );
}
